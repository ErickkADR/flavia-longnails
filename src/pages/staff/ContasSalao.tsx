import { useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { useTable } from '../../hooks/useTable';
import { MonthNav } from './MonthNav';
import { StatCards } from './Dashboard';
import {
  BarChart, ChartCard, DonutChart, KpiStrip, LineChart, RankedList, SERIES,
  delta, fmtDec, fmtInt, fmtMoney,
} from './Charts';
import type { Bar, Kpi, LinePoint, RankItem, Segment } from './Charts';
import './StaffModule.css';
import './Charts.css';

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
  price: number | null;
  scheduled_at: string;
  status: 'agendado' | 'concluido' | 'cancelado';
}

interface RentPayment {
  id: string;
  professional: string;
  reference_month: string;
  amount: number;
  paid: boolean;
  paid_on: string | null;
  notes: string | null;
  created_at: string;
}

const PROFESSIONALS = ['Flávia', 'Jheny', 'Vitória', 'Mayte'];

/**
 * Quem paga aluguel de posto de trabalho hoje. A Flávia é dona do studio e não paga
 * pra si mesma, por isso não entra. Se entrar colaboradora nova, some aqui e no check
 * da tabela `rent_payments` no migration.sql, senão o insert é recusado pelo banco.
 */
const RENT_PAYERS = ['Jheny', 'Vitória', 'Mayte'];
const DEFAULT_RENT = 500;

const ORDEM_SEMANA = [1, 2, 3, 4, 5, 6, 0];
const ABREV_DIA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const NOME_DIA = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

type KpiId = 'faturamento' | 'saldo' | 'servicos' | 'clientes';

const pad = (n: number) => String(n).padStart(2, '0');
// Data LOCAL (Brasília), não o recorte UTC do ISO: um atendimento às 22h do dia 31 é do
// dia 31, não do dia 1º do mês seguinte.
const localDay = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const normalize = (name: string) => name.trim().toLowerCase();
const iniciais = (nome: string) => nome.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase();

function shiftMonth(key: string, delta: number) {
  const [y, m] = key.split('-').map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
}

const dateOf = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
};

/**
 * O mês financeiro do salão vira no dia em que o aluguel é pago (pedido do Erick,
 * 09/10/2026): o ciclo "2026-10" vai de 07/10 a 06/11. A chave do ciclo é a mesma do
 * `reference_month` do aluguel, então marcar o aluguel de outubro cai no ciclo de outubro.
 */
const CICLO_DIA = 7;

function cycleDays(key: string) {
  const [y, m] = key.split('-').map(Number);
  const out: string[] = [];
  const fim = new Date(y, m, CICLO_DIA - 1);
  for (let d = new Date(y, m - 1, CICLO_DIA); d <= fim; d.setDate(d.getDate() + 1)) out.push(localDay(d));
  return out;
}

function cycleOf(iso: string) {
  return Number(iso.slice(8, 10)) >= CICLO_DIA ? iso.slice(0, 7) : shiftMonth(iso.slice(0, 7), -1);
}

const ddmm = (iso: string) => (iso ? `${iso.slice(8, 10)}/${iso.slice(5, 7)}` : '');
const cycleLabel = (key: string) => {
  const d = cycleDays(key);
  return `${ddmm(d[0])} a ${ddmm(d[d.length - 1])}`;
};

/** `services` (jsonb) manda; `service` (texto legado) sustenta as linhas importadas sem
 * o array — mesmo critério do `labelOf` em Agendamento.tsx. */
function entriesOf(a: Appointment): ServiceEntry[] {
  if (a.services && a.services.length > 0) return a.services;
  return [{ name: a.service, price: a.price ?? 0 }];
}
const valorDe = (a: Appointment) => a.price ?? entriesOf(a).reduce((s, e) => s + e.price, 0);
const chaveCliente = (a: Appointment) => (a.client_id ? `id:${a.client_id}` : `nome:${normalize(a.client_name)}`);

interface Resumo {
  realizados: (Appointment & { dia: string })[];
  faturamento: number;
  aluguel: number;
  saldo: number;
  servicos: number;
  clientes: number;
  porDia: Record<string, { fat: number; alu: number; serv: number; cli: Set<string>; atend: number }>;
}

/**
 * "Realizado" = não cancelado e já aconteceu. Não existe fluxo que marque `concluido`
 * no app, então filtrar por ele deixaria tudo zerado; só "cancelado" fica de fora, igual
 * Clientes.tsx/Retorno.tsx, mais o corte por data (agendamento futuro não é faturamento).
 */
function resumir(appts: Appointment[], rents: RentPayment[], key: string, agora: number, limiteDias = Infinity): Resumo {
  const porDia: Resumo['porDia'] = {};
  const dia = (d: string) => (porDia[d] ??= { fat: 0, alu: 0, serv: 0, cli: new Set(), atend: 0 });
  const janela = new Set(cycleDays(key).slice(0, limiteDias));
  const inicio = `${key}-${pad(CICLO_DIA)}`;

  const realizados = appts
    .filter((a) => a.status !== 'cancelado' && new Date(a.scheduled_at).getTime() <= agora)
    .map((a) => ({ ...a, dia: localDay(new Date(a.scheduled_at)) }))
    .filter((a) => janela.has(a.dia));

  for (const a of realizados) {
    const d = dia(a.dia);
    d.fat += valorDe(a);
    d.serv += entriesOf(a).length;
    d.cli.add(chaveCliente(a));
    d.atend += 1;
  }

  // Aluguel entra no dia em que foi marcado como pago; se o pagamento caiu fora do ciclo
  // (pagou adiantado ou atrasado), entra no primeiro dia do ciclo de referência.
  let aluguel = 0;
  for (const r of rents) {
    if (!r.paid || r.reference_month.slice(0, 7) !== key) continue;
    const d = r.paid_on && cycleOf(r.paid_on) === key ? r.paid_on : inicio;
    if (!janela.has(d)) continue;
    aluguel += r.amount;
    dia(d).alu += r.amount;
  }

  const faturamento = realizados.reduce((s, a) => s + valorDe(a), 0);
  return {
    realizados,
    faturamento,
    aluguel,
    saldo: faturamento + aluguel,
    servicos: realizados.reduce((s, a) => s + entriesOf(a).length, 0),
    clientes: new Set(realizados.map(chaveCliente)).size,
    porDia,
  };
}

export function ContasSalao() {
  const { isOwner } = useAuth();
  // A RLS de appointments (migration.sql) deixa a dona ler as linhas das 4, igual
  // personal_expenses — sem isso esta consulta voltaria só com os atendimentos dela.
  const { rows: appointments, loading, error } = useTable<Appointment>('appointments', 'scheduled_at');
  const { rows: rents, upsert: upsertRent } = useTable<RentPayment>('rent_payments', 'reference_month');
  const [kpi, setKpi] = useState<KpiId>('faturamento');
  const [rentError, setRentError] = useState<string | null>(null);

  const [agora] = useState(() => Date.now());
  const hoje = localDay(new Date());
  const [month, setMonth] = useState(() => cycleOf(hoje));
  const label = cycleLabel(month);
  const mesAnterior = shiftMonth(month, -1);

  // Janela do gráfico: ciclo corrente vai até hoje (não desenha dia que ainda não existiu).
  const cicloCorrente = month === cycleOf(hoje);
  const dias = useMemo(() => {
    const todos = cycleDays(month);
    return cicloCorrente ? todos.filter((d) => d <= hoje) : todos;
  }, [month, hoje, cicloCorrente]);

  const cur = useMemo(() => resumir(appointments, rents, month, agora), [appointments, rents, month, agora]);
  // Ciclo em andamento compara com o MESMO trecho do anterior (mesmo número de dias desde
  // o dia 7), igual o Suporte Remoto: contra o ciclo inteiro, todo começo pareceria queda.
  const limite = cicloCorrente ? dias.length : Infinity;
  const ant = useMemo(
    () => resumir(appointments, rents, mesAnterior, agora, limite),
    [appointments, rents, mesAnterior, agora, limite]
  );
  const diasAnt = useMemo(() => cycleDays(mesAnterior), [mesAnterior]);
  const trechoAnt = diasAnt.slice(0, limite);
  const refComparacao = `vs. ${ddmm(trechoAnt[0])} a ${ddmm(trechoAnt[trechoAnt.length - 1])}`;

  const servicosRanking = useMemo(() => {
    const m = new Map<string, { vezes: number; valor: number }>();
    for (const a of cur.realizados) {
      for (const e of entriesOf(a)) {
        const k = e.name || 'Sem nome';
        const atual = m.get(k) ?? { vezes: 0, valor: 0 };
        atual.vezes += 1;
        atual.valor += e.price;
        m.set(k, atual);
      }
    }
    return [...m.entries()]
      .map(([nome, v]) => ({ nome, ...v }))
      .sort((a, b) => b.vezes - a.vezes || b.valor - a.valor || a.nome.localeCompare(b.nome, 'pt-BR'));
  }, [cur.realizados]);
  const servicoTop = servicosRanking[0] ?? null;

  const porProfissional = useMemo(
    () =>
      PROFESSIONALS.map((nome, i) => {
        const dela = cur.realizados.filter((a) => a.professional === nome);
        return {
          nome,
          cor: SERIES[i % SERIES.length],
          atendimentos: dela.length,
          faturamento: dela.reduce((s, a) => s + valorDe(a), 0),
          clientes: new Set(dela.map(chaveCliente)).size,
        };
      }),
    [cur.realizados]
  );

  const kpis: Kpi[] = [
    { id: 'faturamento', label: 'Faturamento do mês', value: fmtMoney(cur.faturamento), delta: delta(cur.faturamento, ant.faturamento), hint: 'só serviços' },
    { id: 'saldo', label: 'Saldo do mês', value: fmtMoney(cur.saldo), delta: delta(cur.saldo, ant.saldo), hint: 'serviços + aluguéis pagos' },
    {
      id: 'servicos', label: 'Serviços realizados', value: fmtInt(cur.servicos), delta: delta(cur.servicos, ant.servicos),
      hint: servicoTop ? `mais feito: ${servicoTop.nome}` : 'nenhum ainda',
    },
    { id: 'clientes', label: 'Clientes atendidas', value: fmtInt(cur.clientes), delta: delta(cur.clientes, ant.clientes) },
  ];
  const kpiAtual = kpis.find((k) => k.id === kpi)!;
  const ehDinheiro = kpi === 'faturamento' || kpi === 'saldo';

  const yDo = (r: Resumo, d: string): number => {
    const p = r.porDia[d];
    if (!p) return 0;
    if (kpi === 'faturamento') return p.fat;
    if (kpi === 'saldo') return p.fat + p.alu;
    if (kpi === 'servicos') return p.serv;
    return p.cli.size;
  };
  const serieCur: LinePoint[] = dias.map((d) => ({ x: d, y: yDo(cur, d) }));
  const seriePrev: LinePoint[] = dias.map((_, i) => (diasAnt[i] ? { x: diasAnt[i], y: yDo(ant, diasAnt[i]) } : { x: '', y: null }));
  const nomesLinha: Record<KpiId, string> = {
    faturamento: 'Faturamento por dia', saldo: 'Saldo por dia', servicos: 'Serviços por dia', clientes: 'Clientes por dia',
  };

  const barras: Bar[] = useMemo(() => {
    const soma = [0, 0, 0, 0, 0, 0, 0], ocorr = [0, 0, 0, 0, 0, 0, 0];
    for (const d of dias) {
      const w = dateOf(d).getDay();
      soma[w] += cur.porDia[d]?.atend ?? 0;
      ocorr[w] += 1;
    }
    return ORDEM_SEMANA.map((w) => ({ label: ABREV_DIA[w], full: `${NOME_DIA[w]}, média`, value: ocorr[w] ? soma[w] / ocorr[w] : 0 }));
  }, [dias, cur.porDia]);
  const totalAtend = cur.realizados.length;
  const mediaDia = dias.length ? totalAtend / dias.length : 0;
  const fmtMedia = (v: number) => (v < 10 && v % 1 !== 0 ? fmtDec(v) : fmtInt(v));

  const segProf: Segment[] = porProfissional.map((p) => ({
    id: p.nome, label: p.nome, value: p.faturamento, color: p.cor,
    sub: `${p.atendimentos} atendimento${p.atendimentos !== 1 ? 's' : ''}`,
  }));

  const segServ: Segment[] = useMemo(() => {
    const top = servicosRanking.slice(0, 4).map((s, i) => ({ id: s.nome, label: s.nome, value: s.vezes, color: SERIES[i] }));
    const resto = servicosRanking.slice(4).reduce((t, s) => t + s.vezes, 0);
    return resto > 0 ? [...top, { id: 'outros', label: 'Outros', value: resto, color: SERIES[4] }] : top;
  }, [servicosRanking]);

  const maxAtend = Math.max(1, ...porProfissional.map((p) => p.atendimentos));
  const rankProf: RankItem[] = [...porProfissional]
    .sort((a, b) => b.faturamento - a.faturamento || b.atendimentos - a.atendimentos)
    .map((p, i) => ({
      id: p.nome,
      pos: `${i + 1}º`,
      title: p.nome,
      sub: p.atendimentos === 0 ? 'sem atendimentos no mês' : `${p.clientes} cliente${p.clientes !== 1 ? 's' : ''}`,
      highlight: i === 0 && p.faturamento > 0,
      avatar: { text: iniciais(p.nome), color: p.cor },
      bar: p.atendimentos / maxAtend,
      cols: [
        { text: fmtInt(p.atendimentos), sub: p.atendimentos === 1 ? 'atendimento' : 'atendimentos', muted: p.atendimentos === 0 },
        { text: fmtMoney(p.faturamento), sub: 'faturado', muted: p.faturamento === 0 },
      ],
    }));

  const maxVezes = Math.max(1, ...servicosRanking.map((s) => s.vezes));
  const rankServ: RankItem[] = servicosRanking.slice(0, 8).map((s, i) => ({
    id: s.nome,
    pos: `${i + 1}º`,
    title: s.nome,
    highlight: i === 0,
    bar: s.vezes / maxVezes,
    cols: [
      { text: `${fmtInt(s.vezes)}x`, sub: s.vezes === 1 ? 'vez' : 'vezes' },
      { text: fmtMoney(s.valor), sub: 'faturado' },
    ],
  }));

  const referenceMonth = `${month}-01`;
  const rentRows = useMemo(
    () =>
      RENT_PAYERS.map((nome) => {
        const found = rents.find((r) => r.professional === nome && r.reference_month.slice(0, 7) === month);
        return { professional: nome, record: found ?? null };
      }),
    [rents, month]
  );
  const rentPending = rentRows.filter((r) => !r.record?.paid).length;

  async function toggleRent(nome: string, current: RentPayment | null) {
    const paid = !current?.paid;
    try {
      await upsertRent(
        {
          professional: nome,
          reference_month: referenceMonth,
          amount: current?.amount ?? DEFAULT_RENT,
          paid,
          paid_on: paid ? localDay(new Date()) : null,
        },
        'professional,reference_month'
      );
    } catch (err) {
      setRentError(err instanceof Error ? err.message : 'Erro ao gravar o aluguel.');
    }
  }

  // Trava de rota: além do link sumir da sidebar (StaffLayout), quem digitar a URL direto
  // também é mandada embora daqui. A RLS é a trava de verdade; isso é defesa em profundidade.
  if (!isOwner) return <Navigate to="/area-colaboradora/gastos" replace />;

  const fmtDia = ddmm;
  const tipDia = (x: string) =>
    dateOf(x).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' }).replace('.', '');

  return (
    <div>
      <div className="mod-header">
        <div className="mod-title">Controle de Contas do Salão</div>
        <div className="mod-sub">Calculado sozinho a partir dos atendimentos das {PROFESSIONALS.length} profissionais e dos aluguéis pagos</div>
      </div>

      <div className="cs-cycle-nav"><MonthNav label={`Ciclo ${label}`} onPrev={() => setMonth((m) => shiftMonth(m, -1))} onNext={() => setMonth((m) => shiftMonth(m, 1))} /></div>

      {(error || rentError) && <p className="mod-error">{error ?? rentError}</p>}

      {loading ? (
        <p className="mod-empty">Carregando...</p>
      ) : (
        <div className="cs-main">
          <section className="ch-card cs-panel">
            <div className="cs-panel__head">
              <div>
                <h2 className="ch-title">Visão geral</h2>
                <p className="ch-sub">Ciclo de {label} (o mês vira no dia {CICLO_DIA}, dia do aluguel), {refComparacao.replace("vs.", "comparado com")}</p>
              </div>
            </div>
            <KpiStrip items={kpis} selected={kpi} onSelect={(id) => setKpi(id as KpiId)} />
            <div className="cs-panel__chart">
              <LineChart
                title={nomesLinha[kpi]}
                sub={`${fmtDia(dias[0] ?? '')} a ${fmtDia(dias[dias.length - 1] ?? '')}`}
                totalLabel="No mês"
                total={kpiAtual.value}
                delta={kpiAtual.delta}
                deltaRef={refComparacao}
                cur={serieCur}
                prev={seriePrev}
                format={ehDinheiro ? fmtMoney : fmtInt}
                formatX={fmtDia}
                tipTitle={tipDia}
                names={['Este ciclo', 'Ciclo anterior']}
                emptyMessage={dias.length === 0 ? 'Este mês ainda não começou.' : undefined}
              />
            </div>
          </section>

          <div className="cs-grid cs-grid--3">
            <ChartCard>
              <BarChart
                title="Atendimentos por dia da semana"
                sub="Média de cada dia da semana no mês"
                statLabel="Média diária"
                stat={fmtMedia(mediaDia)}
                unit="atendimentos/dia"
                range={`${fmtInt(totalAtend)} no mês`}
                bars={barras}
                avg={mediaDia}
                avgText={`Média ${fmtMedia(mediaDia)}`}
                format={fmtMedia}
              />
            </ChartCard>
            <ChartCard>
              <DonutChart
                title="Faturamento por profissional"
                sub="Quanto cada uma trouxe em serviços"
                segments={segProf}
                centerLabel="Faturamento"
                centerValue={fmtMoney(cur.faturamento)}
                format={fmtMoney}
                emptyMessage="Nenhum atendimento realizado neste mês."
              />
            </ChartCard>
            <ChartCard>
              <DonutChart
                title="Serviços mais realizados"
                sub="Quantas vezes cada serviço foi feito"
                segments={segServ}
                centerLabel="Serviços"
                centerValue={fmtInt(cur.servicos)}
                format={(v) => `${fmtInt(v)}x`}
                footnote={servicoTop ? `Mais realizado: ${servicoTop.nome} (${servicoTop.vezes}x).` : undefined}
                emptyMessage="Nenhum serviço realizado neste mês."
              />
            </ChartCard>
          </div>

          <div className="cs-grid cs-grid--2">
            <ChartCard title="Rank de profissionais" sub="Atendimentos e faturamento no mês">
              <RankedList items={rankProf} emptyText="Nenhuma profissional encontrada." />
            </ChartCard>
            <ChartCard title="Ranking de serviços" sub="Os mais feitos no mês e quanto trouxeram">
              <RankedList items={rankServ} emptyText="Nenhum serviço realizado neste mês." />
            </ChartCard>
          </div>
        </div>
      )}

      <div className="admin-section">
        <div className="admin-title">Aluguel das Colaboradoras</div>
        <div className="admin-sub">
          Quem já pagou o posto de trabalho no ciclo de {label}.
          {rentPending > 0 ? ` Faltam ${rentPending} de ${rentRows.length}.` : ' Todas em dia neste mês.'}
          {' '}Marcar como pago soma no saldo do mês.
        </div>

        <StatCards
          cards={[
            { label: 'Aluguel recebido no mês', value: fmtMoney(cur.aluguel), tone: 'accent' },
            { label: 'Sem aluguel (só serviços)', value: fmtMoney(cur.faturamento), tone: 'pos' },
            { label: 'Com aluguel (saldo do mês)', value: fmtMoney(cur.saldo), tone: 'pos' },
          ]}
        />

        <div className="rent-grid">
          {rentRows.map(({ professional: nome, record }) => {
            const pago = record?.paid ?? false;
            const valor = record?.amount ?? DEFAULT_RENT;
            return (
              <div className={`rent-card${pago ? ' is-paid' : ''}`} key={nome}>
                <div className="rent-name">{nome}</div>
                <div className="rent-amount">Aluguel do mês: <strong>{fmtMoney(valor)}</strong></div>
                <div className={`rent-status ${pago ? 'paid' : 'due'}`}>
                  {pago
                    ? `Pago${record?.paid_on ? ` em ${dateOf(record.paid_on).toLocaleDateString('pt-BR')}` : ''}`
                    : 'Em aberto'}
                </div>
                <button type="button" className="rent-toggle" onClick={() => toggleRent(nome, record)}>
                  {pago ? 'Desmarcar' : 'Marcar como pago'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
