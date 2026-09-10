import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { useTable } from '../../hooks/useTable';
import { Icon } from '../../components/Icon';
import './StaffModule.css';
import './Retorno.css';

/**
 * Painel RETORNO: quem sumiu e precisa ser chamada de volta.
 *
 * A lista NÃO é uma tabela no banco. Ela é calculada aqui a partir da data do último
 * atendimento em `appointments`, cruzada com o cadastro de `clients`. Isso é de
 * propósito: se fosse tabela, alguém teria que alimentar, e ela envelheceria sozinha.
 * Do jeito que está, a cliente entra na lista sem ninguém fazer nada e sai dela no
 * momento em que um atendimento novo é marcado.
 *
 * O banco guarda só a EXCEÇÃO, em `client_returns`: quem a profissional marcou como
 * recusada (some por 14 dias) ou dispensou (some de vez).
 */

/** A partir de quantos dias sem aparecer a cliente entra na lista. */
const RETURN_AFTER_DAYS = 14;
/** Quantos dias uma recusa segura o card antes de ele voltar. */
const SNOOZE_DAYS = 14;

interface AppointmentRef {
  id: string;
  client_id: string | null;
  client_name: string;
  service: string;
  services: { name: string; price: number }[] | null;
  scheduled_at: string;
  status: 'agendado' | 'concluido' | 'cancelado';
}

interface Client {
  id: string;
  name: string;
  phone: string | null;
}

interface ClientReturn {
  id: string;
  client_key: string;
  client_id: string | null;
  client_name: string;
  status: 'recusado' | 'dispensado';
  snooze_until: string | null;
  created_at: string;
}

interface Candidato {
  key: string;
  clientId: string | null;
  nome: string;
  telefone: string | null;
  ultimoEm: Date;
  dias: number;
  ultimoServico: string;
  recusadaAte: Date | null;
}

const normalize = (s: string) => s.trim().toLowerCase();

function servicoDe(a: AppointmentRef): string {
  if (a.services && a.services.length > 0) return a.services.map((s) => s.name).join(' + ');
  return a.service;
}

/** "2 meses e 3 dias", "45 dias", "1 mês". Dia seco em número grande cansa de ler. */
function tempoSem(dias: number): string {
  if (dias < 30) return `${dias} dias`;
  const meses = Math.floor(dias / 30);
  const resto = dias % 30;
  const m = meses === 1 ? '1 mês' : `${meses} meses`;
  if (resto === 0) return m;
  return `${m} e ${resto} ${resto === 1 ? 'dia' : 'dias'}`;
}

function diasEntre(a: Date, b: Date): number {
  return Math.floor((b.getTime() - a.getTime()) / 86400000);
}

export function Retorno() {
  const { name } = useAuth();
  const navigate = useNavigate();
  const { rows: appointments, loading } = useTable<AppointmentRef>('appointments', 'scheduled_at');
  const { rows: clients } = useTable<Client>('clients', 'name');
  const { rows: marcas, insert, update, remove, reload } = useTable<ClientReturn>('client_returns');

  const [copiado, setCopiado] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const telefonePorNome = useMemo(() => {
    const m = new Map<string, { id: string; phone: string | null }>();
    for (const c of clients) m.set(normalize(c.name), { id: c.id, phone: c.phone });
    return m;
  }, [clients]);

  const candidatos: Candidato[] = useMemo(() => {
    const hoje = new Date();

    // Último atendimento por cliente. Cancelado não conta como visita, e agendamento
    // futuro tira a cliente da lista: ela já está voltando.
    const ultimo = new Map<string, AppointmentRef>();
    for (const a of appointments) {
      if (a.status === 'cancelado') continue;
      const key = a.client_id ? `id:${a.client_id}` : `nome:${normalize(a.client_name)}`;
      const atual = ultimo.get(key);
      if (!atual || new Date(a.scheduled_at) > new Date(atual.scheduled_at)) ultimo.set(key, a);
    }

    const porChave = new Map<string, ClientReturn>();
    for (const m of marcas) porChave.set(m.client_key, m);

    const out: Candidato[] = [];
    for (const [, a] of ultimo) {
      const quando = new Date(a.scheduled_at);
      if (quando > hoje) continue; // tem atendimento marcado pra frente
      const dias = diasEntre(quando, hoje);
      if (dias < RETURN_AFTER_DAYS) continue;

      const chave = normalize(a.client_name);
      const marca = porChave.get(chave);
      if (marca) {
        // Marca anterior ao último atendimento não vale mais: a cliente voltou depois
        // de ter sido recusada ou dispensada, então o ciclo recomeça.
        const marcaVale = new Date(marca.created_at) > quando;
        if (marcaVale) {
          if (marca.status === 'dispensado') continue;
          if (marca.snooze_until && new Date(`${marca.snooze_until}T23:59:59`) > hoje) continue;
        }
      }

      const cadastro = telefonePorNome.get(chave);
      out.push({
        key: chave,
        clientId: a.client_id ?? cadastro?.id ?? null,
        nome: a.client_name,
        telefone: cadastro?.phone ?? null,
        ultimoEm: quando,
        dias,
        ultimoServico: servicoDe(a),
        recusadaAte: marca?.snooze_until ? new Date(`${marca.snooze_until}T00:00:00`) : null,
      });
    }
    return out.sort((x, y) => y.dias - x.dias);
  }, [appointments, marcas, telefonePorNome]);

  function mensagemPara(c: Candidato): string {
    const primeiro = c.nome.trim().split(/\s+/)[0];
    return (
      `Oi ${primeiro}! Aqui é a ${name}, do Afrodite Studio.\n\n` +
      `Passando pra saber de você: já faz ${tempoSem(c.dias)} desde o seu último atendimento` +
      `${c.ultimoServico ? ` (${c.ultimoServico})` : ''}.\n\n` +
      `Que tal fazer a manutenção? Se preferir experimentar outra coisa, também consigo ` +
      `te indicar o que combina. Quer que eu veja um horário pra você?`
    );
  }

  async function enviarMensagem(c: Candidato) {
    const texto = mensagemPara(c);
    // Com telefone cadastrado a conversa abre direto. Sem telefone (o caso dos 110
    // clientes importados, que vieram só com nome) o texto vai pra área de transferência
    // pra ela colar no chat que já tem aberto.
    if (c.telefone) {
      const numero = c.telefone.replace(/\D/g, '');
      const comDDI = numero.startsWith('55') ? numero : `55${numero}`;
      window.open(`https://wa.me/${comDDI}?text=${encodeURIComponent(texto)}`, '_blank', 'noopener');
      return;
    }
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(c.key);
      setTimeout(() => setCopiado(null), 2400);
    } catch {
      setErro(`Não consegui copiar sozinho. A mensagem é: ${texto}`);
    }
  }

  /** Leva pro agendamento com a cliente já preenchida; só o serviço fica em aberto. */
  function contatoFeito(c: Candidato) {
    navigate('/area-colaboradora/agendamento', {
      state: { clientId: c.clientId, clientName: c.nome },
    });
  }

  async function marcar(c: Candidato, status: ClientReturn['status']) {
    setErro(null);
    const snooze =
      status === 'recusado'
        ? new Date(Date.now() + SNOOZE_DAYS * 86400000).toISOString().slice(0, 10)
        : null;
    const existente = marcas.find((m) => m.client_key === c.key);
    try {
      if (existente) {
        await update(existente.id, {
          status,
          snooze_until: snooze,
          created_at: new Date().toISOString(),
        } as Partial<ClientReturn>);
      } else {
        await insert({
          client_key: c.key,
          client_id: c.clientId,
          client_name: c.nome,
          status,
          snooze_until: snooze,
        });
      }
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro ao salvar.');
    }
  }

  /** Devolve pra lista uma cliente que tinha sido recusada ou dispensada. */
  async function desfazer(m: ClientReturn) {
    try {
      await remove(m.id);
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro ao desfazer.');
    }
  }

  const ocultas = useMemo(() => {
    const hoje = new Date();
    return marcas.filter(
      (m) =>
        m.status === 'dispensado' ||
        (m.snooze_until && new Date(`${m.snooze_until}T23:59:59`) > hoje)
    );
  }, [marcas]);

  return (
    <div>
      <div className="mod-header">
        <div className="mod-title">Retorno de Clientes</div>
        <div className="mod-sub">
          Quem não aparece há {RETURN_AFTER_DAYS} dias ou mais. A lista se monta sozinha a
          partir da sua agenda: marcou atendimento novo, a cliente sai daqui.
        </div>
      </div>

      {erro && <p className="mod-error">{erro}</p>}

      {loading ? (
        <p className="mod-empty">Carregando...</p>
      ) : candidatos.length === 0 ? (
        <div className="ret-zero">
          <Icon name="coracao" className="ret-zero-icon" />
          <p>
            Ninguém para chamar de volta agora. Toda cliente sua atendida nos últimos{' '}
            {RETURN_AFTER_DAYS} dias, ou já com horário marcado.
          </p>
        </div>
      ) : (
        <>
          <div className="ret-count">
            {candidatos.length} {candidatos.length === 1 ? 'cliente' : 'clientes'} para chamar de volta
          </div>
          <div className="ret-grid">
            {candidatos.map((c) => (
              <article className="ret-card" key={c.key}>
                <header className="ret-card-top">
                  <div>
                    <h3 className="ret-nome">{c.nome}</h3>
                    <div className="ret-ultimo">
                      Último: {c.ultimoServico || 'sem serviço registrado'}
                      <span className="ret-data">
                        {c.ultimoEm.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="ret-del"
                    onClick={() => marcar(c, 'dispensado')}
                    title="Tirar esta cliente da lista de retorno"
                    aria-label={`Remover ${c.nome} da lista de retorno`}
                  >
                    <Icon name="lixeira" />
                  </button>
                </header>

                {/* O tempo sem voltar é a informação que decide a prioridade, então ganha
                    o maior peso visual do card. A barra enche até 90 dias: passou disso,
                    fica cheia e o número continua contando. */}
                <div className="ret-tempo">
                  <span className="ret-tempo-num">{tempoSem(c.dias)}</span>
                  <span className="ret-tempo-lbl">sem voltar</span>
                  <div className="ret-barra" aria-hidden="true">
                    <div
                      className="ret-barra-fill"
                      style={{ width: `${Math.min(100, Math.round((c.dias / 90) * 100))}%` }}
                    />
                  </div>
                </div>

                {!c.telefone && (
                  <p className="ret-aviso">
                    Sem telefone no cadastro. A mensagem vai pra área de transferência.
                  </p>
                )}

                <div className="ret-acoes">
                  <button type="button" className="ret-btn is-primary" onClick={() => enviarMensagem(c)}>
                    <Icon name="whatsapp" />
                    {copiado === c.key ? 'Copiado!' : 'Enviar mensagem'}
                  </button>
                  <button type="button" className="ret-btn" onClick={() => contatoFeito(c)}>
                    <Icon name="check" />
                    Contato feito
                  </button>
                  <button type="button" className="ret-btn is-ghost" onClick={() => marcar(c, 'recusado')}>
                    <Icon name="cancelamento" />
                    Recusado
                  </button>
                </div>
              </article>
            ))}
          </div>
        </>
      )}

      {ocultas.length > 0 && (
        <div className="admin-section">
          <div className="admin-title">Fora da lista</div>
          <div className="admin-sub">
            Recusadas voltam sozinhas depois de {SNOOZE_DAYS} dias. Dispensadas só voltam se você
            devolver aqui, ou se a cliente marcar um atendimento novo.
          </div>
          <div className="ret-ocultas">
            {ocultas.map((m) => (
              <div className="ret-oculta" key={m.id}>
                <span className="ret-oculta-nome">{m.client_name || m.client_key}</span>
                <span className={`mod-tag ${m.status === 'recusado' ? 'agendado' : 'cancelado'}`}>
                  {m.status === 'recusado'
                    ? `volta em ${new Date(`${m.snooze_until}T00:00:00`).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}`
                    : 'dispensada'}
                </span>
                <button type="button" className="mod-table-del" onClick={() => desfazer(m)}>
                  devolver
                </button>
              </div>
            ))}
          </div>
          <button type="button" className="ret-reload" onClick={() => reload()}>
            Atualizar lista
          </button>
        </div>
      )}
    </div>
  );
}
