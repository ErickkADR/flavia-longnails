import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { useTable } from '../../hooks/useTable';
import { useMonthFilter } from '../../hooks/useMonthFilter';
import { MonthNav } from './MonthNav';
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

const PROFESSIONALS = ['Flávia', 'Jheny', 'Vitória'];

export function ContasSalao() {
  const { rows, loading, error, insert, remove } = useTable<Transaction>('salon_transactions', 'occurred_on');
  const { filtered, label, prevMonth, nextMonth } = useMonthFilter(rows, 'occurred_on');

  const [type, setType] = useState<Transaction['type']>('entrada');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [professional, setProfessional] = useState(PROFESSIONALS[0]);
  const [occurredOn, setOccurredOn] = useState(() => new Date().toISOString().slice(0, 10));
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const balance = useMemo(
    () => filtered.reduce((sum, t) => sum + (t.type === 'entrada' ? t.amount : -t.amount), 0),
    [filtered]
  );

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      await insert({ type, category, description: description || null, amount: Number(amount), professional, occurred_on: occurredOn });
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
        <div className="mod-sub">
          Saldo do mês: <strong style={{ color: balance >= 0 ? 'var(--accent-deep)' : '#a13f2c' }}>R${balance.toFixed(2)}</strong>
        </div>
      </div>

      <MonthNav label={label} onPrev={prevMonth} onNext={nextMonth} />

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
    </div>
  );
}
