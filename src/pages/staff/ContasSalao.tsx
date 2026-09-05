import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { useTable } from '../../hooks/useTable';
import { useMonthFilter } from '../../hooks/useMonthFilter';
import { MonthNav } from './MonthNav';
import { StatCards, CategoryBars, groupSum } from './Dashboard';
import './StaffModule.css';

interface Transaction {
  id: string;
  type: 'entrada' | 'saida';
  category: string;
  description: string | null;
  amount: number;
  professional: string | null;
  occurred_on: string;
  created_at: string;
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

const PROFESSIONALS = ['Flávia', 'Jheny', 'Vitória'];

/**
 * Quem paga aluguel de posto de trabalho hoje. A Flávia é dona do studio e não paga
 * pra si mesma, por isso não entra. Se entrar colaboradora nova, some aqui e no check
 * da tabela `rent_payments` no migration.sql, senão o insert é recusado pelo banco.
 */
const RENT_PAYERS = ['Jheny', 'Vitória'];
const DEFAULT_RENT = 500;

const money = (n: number) => `R$${n.toFixed(2)}`;

export function ContasSalao() {
  const { isOwner } = useAuth();
  const { rows, loading, error, insert, remove } = useTable<Transaction>('salon_transactions', 'occurred_on');
  const { filtered, label, month, prevMonth, nextMonth } = useMonthFilter(rows, 'occurred_on');

  // A RLS de rent_payments só libera pra Flávia. Nas outras duas a consulta volta vazia
  // e o painel nem é renderizado, então não há vazamento nem erro na tela.
  const { rows: rents, upsert: upsertRent } = useTable<RentPayment>('rent_payments', 'reference_month');

  const [type, setType] = useState<Transaction['type']>('entrada');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [professional, setProfessional] = useState(PROFESSIONALS[0]);
  const [occurredOn, setOccurredOn] = useState(() => new Date().toISOString().slice(0, 10));
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const stats = useMemo(() => {
    const entradas = filtered.filter((t) => t.type === 'entrada').reduce((s, t) => s + t.amount, 0);
    const saidas = filtered.filter((t) => t.type === 'saida').reduce((s, t) => s + t.amount, 0);
    return { entradas, saidas, saldo: entradas - saidas };
  }, [filtered]);

  const barsSaida = useMemo(
    () => groupSum(filtered.filter((t) => t.type === 'saida'), (t) => t.category, (t) => t.amount),
    [filtered]
  );
  const barsEntrada = useMemo(
    () => groupSum(filtered.filter((t) => t.type === 'entrada'), (t) => t.category, (t) => t.amount),
    [filtered]
  );

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
          paid_on: paid ? new Date().toISOString().slice(0, 10) : null,
        },
        'professional,reference_month'
      );
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Erro ao gravar o aluguel.');
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      await insert({
        type,
        category,
        description: description || null,
        amount: Number(amount),
        professional,
        occurred_on: occurredOn,
      });
      setCategory('');
      setDescription('');
      setAmount('');
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Erro ao salvar.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="mod-header">
        <div className="mod-title">Controle de Contas do Salão</div>
        <div className="mod-sub">Entradas e saídas compartilhadas entre as três</div>
      </div>

      <MonthNav label={label} onPrev={prevMonth} onNext={nextMonth} />

      <div className="dash">
        <StatCards
          cards={[
            { label: 'Entradas', value: money(stats.entradas), tone: 'pos' },
            { label: 'Saídas', value: money(stats.saidas), tone: 'neg' },
            { label: 'Saldo do mês', value: money(stats.saldo), tone: stats.saldo >= 0 ? 'pos' : 'neg' },
            { label: 'Lançamentos', value: String(filtered.length), note: label },
          ]}
        />
        <div className="admin-grid">
          <CategoryBars title="Para onde foi o dinheiro" rows={barsSaida} />
          <CategoryBars title="De onde veio o dinheiro" rows={barsEntrada} />
        </div>
      </div>

      <form className="mod-form" onSubmit={handleSubmit}>
        <label className="mod-field">
          <span>Tipo</span>
          <select value={type} onChange={(e) => setType(e.target.value as Transaction['type'])}>
            <option value="entrada">Entrada</option>
            <option value="saida">Saída</option>
          </select>
        </label>
        <label className="mod-field">
          <span>Categoria</span>
          <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Serviço, produto, aluguel..." required />
        </label>
        <label className="mod-field">
          <span>Descrição</span>
          <input value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
        <label className="mod-field">
          <span>Valor (R$)</span>
          <input type="number" step="0.01" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        </label>
        <label className="mod-field">
          <span>Profissional</span>
          <select value={professional} onChange={(e) => setProfessional(e.target.value)}>
            {PROFESSIONALS.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </label>
        <label className="mod-field">
          <span>Data</span>
          <input type="date" value={occurredOn} onChange={(e) => setOccurredOn(e.target.value)} required />
        </label>
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Salvando...' : 'Lançar'}
        </button>
      </form>

      {(error || formError) && <p className="mod-error">{error ?? formError}</p>}

      <div className="mod-table-wrap">
        {loading ? (
          <p className="mod-empty">Carregando...</p>
        ) : filtered.length === 0 ? (
          <p className="mod-empty">Nenhum lançamento neste mês.</p>
        ) : (
          <table className="mod-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Tipo</th>
                <th>Categoria</th>
                <th>Descrição</th>
                <th>Profissional</th>
                <th>Valor</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id}>
                  <td>{new Date(t.occurred_on).toLocaleDateString('pt-BR')}</td>
                  <td><span className={`mod-tag ${t.type}`}>{t.type}</span></td>
                  <td>{t.category}</td>
                  <td>{t.description ?? '—'}</td>
                  <td>{t.professional ?? '—'}</td>
                  <td>{t.type === 'saida' ? '-' : ''}R${t.amount}</td>
                  <td><button className="mod-table-del" onClick={() => remove(t.id)}>remover</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

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
