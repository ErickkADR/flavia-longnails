import { useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { useTable } from '../../hooks/useTable';
import { useMonthFilter } from '../../hooks/useMonthFilter';
import { MonthNav } from './MonthNav';
import { StatCards, CategoryBars, groupSum } from './Dashboard';
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
  price: number | null;
  scheduled_at: string;
  status: 'agendado' | 'concluido' | 'cancelado';
}

interface Expense {
  id: string;
  type: 'entrada' | 'saida';
  scope: 'pessoal' | 'salao';
  amount: number;
  occurred_on: string;
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

const money = (n: number) => `R$${n.toFixed(2)}`;
const normalize = (name: string) => name.trim().toLowerCase();

/** `services` (jsonb) manda; `service` (texto legado) sustenta as linhas importadas sem
 * o array — mesmo critério do `labelOf` em Agendamento.tsx. */
function entriesOf(a: Appointment): ServiceEntry[] {
  if (a.services && a.services.length > 0) return a.services;
  return [{ name: a.service, price: a.price ?? 0 }];
}

export function ContasSalao() {
  const { isOwner } = useAuth();

  // Fonte real do faturamento: os atendimentos de verdade, não lançamento manual. A RLS
  // de appointments (migration.sql) deixa a dona ler as linhas das 4, igual já acontecia
  // em personal_expenses — sem isso essa consulta voltaria só com os atendimentos dela.
  const { rows: appointments, loading: apptLoading, error: apptError } = useTable<Appointment>(
    'appointments',
    'scheduled_at'
  );
  const { filtered: apptMonth, label, month, prevMonth, nextMonth } = useMonthFilter(appointments, 'scheduled_at');

  // "Feito" = não cancelado e já aconteceu. Um agendamento pra semana que vem conta como
  // marcado, não como faturado — mesmo critério que Clientes.tsx/Retorno.tsx já usam pra
  // contar visita (só "cancelado" fica de fora), mais o corte por data porque aqui o que
  // importa é dinheiro que já entrou, não compromisso futuro.
  const now = Date.now();
  const realizados = useMemo(
    () => apptMonth.filter((a) => a.status !== 'cancelado' && new Date(a.scheduled_at).getTime() <= now),
    [apptMonth, now]
  );

  // Saídas continuam vindo de Gastos Pessoais, âmbito "salão" (aluguel, produto, limpeza,
  // comida) — não duplicar um segundo lugar pra lançar a mesma coisa. A RLS de lá já
  // deixa a Flávia ler as linhas de todo mundo.
  const { rows: expenses, error: expError } = useTable<Expense>('personal_expenses', 'occurred_on');
  const { filtered: expMonth } = useMonthFilter(expenses, 'occurred_on');
  const saidas = useMemo(
    () => expMonth.filter((e) => e.type === 'saida' && e.scope === 'salao').reduce((s, e) => s + e.amount, 0),
    [expMonth]
  );

  const { rows: rents, upsert: upsertRent } = useTable<RentPayment>('rent_payments', 'reference_month');
  const [rentError, setRentError] = useState<string | null>(null);

  const entradas = useMemo(
    () => realizados.reduce((s, a) => s + (a.price ?? entriesOf(a).reduce((x, e) => x + e.price, 0)), 0),
    [realizados]
  );

  const allEntries = useMemo(() => realizados.flatMap(entriesOf), [realizados]);
  const qtdServicos = allEntries.length;

  const qtdClientes = useMemo(() => {
    const chaves = new Set(realizados.map((a) => (a.client_id ? `id:${a.client_id}` : `nome:${normalize(a.client_name)}`)));
    return chaves.size;
  }, [realizados]);

  const servicosRanking = useMemo(() => groupSum(allEntries, (e) => e.name, () => 1), [allEntries]);
  const servicoTop = servicosRanking[0] ?? null;

  const faturamentoPorProfissional = useMemo(
    () => groupSum(realizados, (a) => a.professional, (a) => a.price ?? entriesOf(a).reduce((x, e) => x + e.price, 0)),
    [realizados]
  );

  const saldo = entradas - saidas;
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

  // Aluguel é receita do salão, mas vive fora de `entradas` (que só soma atendimento):
  // é um valor fixo por posto, não um serviço prestado. Pedido do Erick: mostrar o
  // impacto dele no saldo, não só o total pago isolado.
  const aluguelRecebido = useMemo(
    () => rentRows.reduce((s, r) => s + (r.record?.paid ? r.record.amount : 0), 0),
    [rentRows]
  );
  const saldoComAluguel = saldo + aluguelRecebido;

  async function toggleRent(nome: string, current: RentPayment | null) {
    const paid = !current?.paid;
    try {
      await upsertRent(
        {
          professional: nome,
          reference_month: referenceMonth,
          amount: current?.amount ?? DEFAULT_RENT,
          paid,
          paid_on: paid ? new Date().toISOString().slice(0, 10) : null,
        },
        'professional,reference_month'
      );
    } catch (err) {
      setRentError(err instanceof Error ? err.message : 'Erro ao gravar o aluguel.');
    }
  }

  // Trava de rota: além do link sumir da sidebar (StaffLayout), quem digitar a URL direto
  // também é mandada embora daqui. A RLS de appointments/personal_expenses é a trava de
  // verdade; isso aqui é defesa em profundidade.
  if (!isOwner) return <Navigate to="/area-colaboradora/gastos" replace />;

  return (
    <div>
      <div className="mod-header">
        <div className="mod-title">Controle de Contas do Salão</div>
        <div className="mod-sub">Faturamento de verdade, direto dos atendimentos das {PROFESSIONALS.length} profissionais</div>
      </div>

      <MonthNav label={label} onPrev={prevMonth} onNext={nextMonth} />

      {(apptError || expError || rentError) && <p className="mod-error">{apptError ?? expError ?? rentError}</p>}

      {apptLoading ? (
        <p className="mod-empty">Carregando...</p>
      ) : (
        <div className="dash">
          <StatCards
            cards={[
              { label: 'Faturamento do mês', value: money(entradas), tone: 'pos' },
              { label: 'Saídas do salão', value: money(saidas), tone: 'neg' },
              { label: 'Saldo do mês', value: money(saldo), tone: saldo >= 0 ? 'pos' : 'neg' },
              { label: 'Serviços realizados', value: String(qtdServicos), note: label },
              { label: 'Clientes atendidas', value: String(qtdClientes), note: label },
              {
                label: 'Serviço mais realizado',
                value: servicoTop ? servicoTop.label : '—',
                tone: 'accent',
                note: servicoTop ? `${servicoTop.value}x no mês` : 'Nenhum atendimento ainda',
              },
            ]}
          />
          <div className="admin-grid">
            <CategoryBars title="Faturamento por profissional" rows={faturamentoPorProfissional} />
            <CategoryBars title="Serviços mais realizados" rows={servicosRanking} format={(n) => `${n}x`} />
          </div>
        </div>
      )}

      {isOwner && (
        <div className="admin-section">
          <div className="admin-title">Aluguel das Colaboradoras</div>
          <div className="admin-sub">
            Quem já pagou o posto de trabalho em {label.toLowerCase()}.
            {rentPending > 0
              ? ` Faltam ${rentPending} de ${rentRows.length}.`
              : ' Todas em dia neste mês.'}
            {' '}Só você enxerga esta seção.
          </div>

          <StatCards
            cards={[
              { label: 'Aluguel recebido no mês', value: money(aluguelRecebido), tone: 'pos' },
              { label: 'Saldo sem aluguel', value: money(saldo), tone: saldo >= 0 ? 'pos' : 'neg' },
              { label: 'Saldo com aluguel', value: money(saldoComAluguel), tone: saldoComAluguel >= 0 ? 'pos' : 'neg' },
            ]}
          />

          <div className="rent-grid">
            {rentRows.map(({ professional: nome, record }) => {
              const pago = record?.paid ?? false;
              const valor = record?.amount ?? DEFAULT_RENT;
              return (
                <div className={`rent-card${pago ? ' is-paid' : ''}`} key={nome}>
                  <div className="rent-name">{nome}</div>
                  <div className="rent-amount">Aluguel do mês: <strong>{money(valor)}</strong></div>
                  <div className={`rent-status ${pago ? 'paid' : 'due'}`}>
                    {pago
                      ? `Pago${record?.paid_on ? ` em ${new Date(record.paid_on).toLocaleDateString('pt-BR')}` : ''}`
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
      )}
    </div>
  );
}
