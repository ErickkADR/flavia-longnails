import { useEffect, useMemo, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { useTable } from '../../hooks/useTable';
import { priceOf, servicesForName } from '../../data/professionals';
import type { Service } from '../../data/professionals';
import { addDays, weekDays } from '../../lib/schedule';
import { WeekAgenda } from './WeekAgenda';
import type { AgendaItem } from './WeekAgenda';
import './StaffModule.css';

interface ServiceEntry {
  name: string;
  price: number;
}

interface Appointment {
  id: string;
  client_id: string | null;
  client_name: string;
  professional: string;
  service: string;
  services: ServiceEntry[] | null;
  scheduled_at: string;
  duration_min: number;
  price: number | null;
  status: 'agendado' | 'concluido' | 'cancelado';
  created_at: string;
}

interface Client {
  id: string;
  name: string;
}

/** `services` (jsonb, novo) manda; `service` (texto, legado) atende as 260 linhas importadas. */
function labelOf(a: Appointment): string {
  if (a.services && a.services.length > 0) return a.services.map((s) => s.name).join(' + ');
  return a.service;
}

function toLocalInput(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function formatDuration(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h${String(m).padStart(2, '0')}`;
}

export function Agendamento() {
  const { name } = useAuth();
  const { rows, loading, error, insert, remove } = useTable<Appointment>('appointments', 'scheduled_at');
  const { rows: clients } = useTable<Client>('clients', 'name');

  const catalog = useMemo(() => servicesForName(name), [name]);

  const [clientQuery, setClientQuery] = useState('');
  const [clientId, setClientId] = useState<string | null>(null);
  const [listOpen, setListOpen] = useState(false);
  const [picked, setPicked] = useState<Service[]>([]);
  const [priceOverride, setPriceOverride] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [weekRef, setWeekRef] = useState(() => new Date());
  const [copiedDay, setCopiedDay] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const comboRef = useRef<HTMLDivElement>(null);

  const totalPrice = useMemo(() => picked.reduce((sum, s) => sum + priceOf(s), 0), [picked]);
  const totalDuration = useMemo(
    () => picked.reduce((sum, s) => sum + s.durationMin, 0) || 60,
    [picked]
  );

  const matches = useMemo(() => {
    const q = clientQuery.trim().toLowerCase();
    if (!q) return clients.slice(0, 8);
    return clients.filter((c) => c.name.toLowerCase().includes(q)).slice(0, 8);
  }, [clients, clientQuery]);

  const isNewClient = useMemo(() => {
    const q = clientQuery.trim().toLowerCase();
    return q.length > 0 && !clients.some((c) => c.name.toLowerCase() === q);
  }, [clients, clientQuery]);

  const days = useMemo(() => weekDays(weekRef), [weekRef]);

  const agendaItems: AgendaItem[] = useMemo(
    () =>
      rows.map((a) => ({
        id: a.id,
        client_name: a.client_name,
        label: labelOf(a),
        start: new Date(a.scheduled_at),
        durationMin: a.duration_min || 60,
        status: a.status,
      })),
    [rows]
  );

  // Fecha a lista do autocomplete ao clicar fora. Sem isso ela fica aberta por cima
  // do resto do formulário e come o clique dos chips.
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (comboRef.current && !comboRef.current.contains(e.target as Node)) setListOpen(false);
    }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  function toggleService(s: Service) {
    setPicked((cur) =>
      cur.some((x) => x.name === s.name) ? cur.filter((x) => x.name !== s.name) : [...cur, s]
    );
    setPriceOverride('');
  }

  async function handleCopyDay(day: Date, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedDay(day.toDateString());
      setTimeout(() => setCopiedDay(null), 2200);
    } catch {
      // Clipboard exige contexto seguro (https ou localhost). Se falhar, mostra o texto
      // pra copiar na mão em vez de sumir sem explicação.
      setFormError(`Não consegui copiar sozinho. A mensagem é: ${text}`);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (picked.length === 0) {
      setFormError('Escolha pelo menos um serviço.');
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      const entries: ServiceEntry[] = picked.map((s) => ({ name: s.name, price: priceOf(s) }));
      await insert({
        client_id: clientId,
        client_name: clientQuery.trim(),
        professional: name,
        service: entries.map((s) => s.name).join(' + '),
        services: entries,
        scheduled_at: new Date(scheduledAt).toISOString(),
        duration_min: totalDuration,
        price: priceOverride ? Number(priceOverride) : totalPrice,
        status: 'agendado',
      });
      setClientQuery('');
      setClientId(null);
      setPicked([]);
      setPriceOverride('');
      setScheduledAt('');
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Erro ao salvar.');
    } finally {
      setSaving(false);
    }
  }

  const weekLabel = `${days[0].toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} a ${days[5].toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}`;
  const valorFinal = priceOverride ? Number(priceOverride) : totalPrice;

  return (
    <div>
      <div className="mod-header">
        <div className="mod-title">Agendamento de Clientes</div>
        <div className="mod-sub">Marque um atendimento e veja sua semana</div>
      </div>

      {/* O formulário vem antes da agenda: marcar é a ação principal da tela, e a grade
          é consulta. Estava invertido, e a grade vazia empurrava o formulário pra fora
          da primeira dobra. */}
      <form className="ag-form" onSubmit={handleSubmit}>
        <div className="ag-form-head">
          <span className="ag-form-title">Novo atendimento</span>
          <span className="ag-form-pro">no nome de {name}</span>
        </div>

        <div className="ag-row">
          <div className="ag-field combo" ref={comboRef}>
            <span>Cliente</span>
            <input
              value={clientQuery}
              onChange={(e) => { setClientQuery(e.target.value); setClientId(null); setListOpen(true); }}
              onFocus={() => setListOpen(true)}
              placeholder="Comece a digitar o nome"
              autoComplete="off"
              required
            />
            {clientId && <span className="ag-badge-ok">cadastrada</span>}
            {listOpen && (matches.length > 0 || isNewClient) && (
              <ul className="combo-list">
                {matches.map((c) => (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => { setClientQuery(c.name); setClientId(c.id); setListOpen(false); }}
                    >
                      {c.name}
                    </button>
                  </li>
                ))}
                {isNewClient && <li className="combo-new">Cliente nova, vai entrar só neste agendamento</li>}
              </ul>
            )}
          </div>

          <label className="ag-field">
            <span>Data e hora</span>
            <input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} required />
          </label>

          <label className="ag-field ag-field-sm">
            <span>Valor (R$)</span>
            <input
              type="number" step="0.01" min="0"
              value={priceOverride}
              placeholder={totalPrice.toFixed(2)}
              onChange={(e) => setPriceOverride(e.target.value)}
            />
          </label>
        </div>

        <div className="ag-services">
          <div className="ag-services-head">
            <span>Serviços</span>
            {picked.length > 0 && (
              <button type="button" className="ag-clear" onClick={() => { setPicked([]); setPriceOverride(''); }}>
                limpar seleção
              </button>
            )}
          </div>
          <div className="svc-chips">
            {catalog.map((s) => {
              const on = picked.some((x) => x.name === s.name);
              return (
                <button
                  type="button"
                  key={s.name}
                  className={`svc-chip${on ? ' is-on' : ''}`}
                  onClick={() => toggleService(s)}
                  aria-pressed={on}
                >
                  <span className="svc-chip-ico">{s.icon}</span>
                  <span className="svc-chip-name">{s.name}</span>
                  <span className="svc-chip-meta">{s.price} · {formatDuration(s.durationMin)}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Faixa de resumo: fecha o que foi montado antes de gravar. Fica apagada até
            existir seleção, pra não anunciar R$0,00 numa tela recém-aberta. */}
        <div className={`ag-summary${picked.length > 0 ? ' is-on' : ''}`}>
          <div className="ag-summary-list">
            {picked.length === 0
              ? <span className="ag-summary-empty">Nenhum serviço selecionado ainda</span>
              : picked.map((s) => <span className="ag-tag" key={s.name}>{s.name}</span>)}
          </div>
          <div className="ag-summary-right">
            <div className="ag-summary-total">
              <span className="ag-summary-lbl">Total</span>
              <span className="ag-summary-val">R${valorFinal.toFixed(2)}</span>
            </div>
            <div className="ag-summary-total">
              <span className="ag-summary-lbl">Duração</span>
              <span className="ag-summary-val">{formatDuration(totalDuration)}</span>
            </div>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Salvando...' : 'Agendar'}
            </button>
          </div>
        </div>
      </form>

      {(error || formError) && <p className="mod-error">{error ?? formError}</p>}

      <div className="ag-agenda-head">
        <div>
          <div className="ag-sec-title">Sua semana</div>
          <div className="ag-sec-sub">
            Clique num espaço vazio para jogar o horário no formulário, ou no cabeçalho do dia
            para copiar a mensagem de vagas. As vagas já consideram a duração do que você selecionou
            acima ({formatDuration(totalDuration)}).
          </div>
        </div>
        <div className="month-nav ag-week-nav">
          <button type="button" onClick={() => setWeekRef((d) => addDays(d, -7))} aria-label="Semana anterior">‹</button>
          <span>{weekLabel}</span>
          <button type="button" onClick={() => setWeekRef((d) => addDays(d, 7))} aria-label="Próxima semana">›</button>
        </div>
      </div>

      <WeekAgenda
        days={days}
        items={agendaItems}
        durationMin={totalDuration}
        onPickSlot={(start) => setScheduledAt(toLocalInput(start))}
        onCopyDay={handleCopyDay}
        copiedDay={copiedDay}
      />

      <div className="ag-agenda-head ag-list-head">
        <div>
          <div className="ag-sec-title">Todos os atendimentos</div>
          <div className="ag-sec-sub">Seu histórico completo, do mais recente pro mais antigo.</div>
        </div>
      </div>

      <div className="mod-table-wrap">
        {loading ? (
          <p className="mod-empty">Carregando...</p>
        ) : rows.length === 0 ? (
          <p className="mod-empty">Nenhum agendamento seu ainda.</p>
        ) : (
          <table className="mod-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Cliente</th>
                <th>Serviços</th>
                <th>Duração</th>
                <th>Valor</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((a) => (
                <tr key={a.id}>
                  <td>{new Date(a.scheduled_at).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</td>
                  <td>{a.client_name}</td>
                  <td>{labelOf(a)}</td>
                  <td>{formatDuration(a.duration_min || 60)}</td>
                  <td>{a.price != null ? `R$${a.price}` : '—'}</td>
                  <td><span className={`mod-tag ${a.status}`}>{a.status}</span></td>
                  <td><button className="mod-table-del" onClick={() => remove(a.id)}>remover</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
