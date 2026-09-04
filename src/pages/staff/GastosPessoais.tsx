import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { useTable } from '../../hooks/useTable';
import './StaffModule.css';

interface Expense {
  id: string;
  category: string;
  description: string | null;
  amount: number;
  occurred_on: string;
  created_at: string;
  owner_id: string;
}

export function GastosPessoais() {
  const { rows, loading, error, insert, remove } = useTable<Expense>('personal_expenses', 'occurred_on');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [occurredOn, setOccurredOn] = useState(() => new Date().toISOString().slice(0, 10));
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const total = useMemo(() => rows.reduce((sum, e) => sum + e.amount, 0), [rows]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      await insert({ category, description: description || null, amount: Number(amount), occurred_on: occurredOn });
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
        <div className="mod-title">Controle de Gastos Pessoais</div>
        <div className="mod-sub">
          Visível só pra você. Total: <strong style={{ color: 'var(--accent-deep)' }}>R${total.toFixed(2)}</strong>
        </div>
      </div>

      <form className="mod-form" onSubmit={handleSubmit}>
        <label className="mod-field">
          <span>Categoria</span>
          <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Transporte, alimentação..." required />
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
          <span>Data</span>
          <input type="date" value={occurredOn} onChange={(e) => setOccurredOn(e.target.value)} required />
        </label>
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Salvando...' : 'Adicionar'}
        </button>
      </form>

      {(error || formError) && <p className="mod-error">{error ?? formError}</p>}

      <div className="mod-table-wrap">
        {loading ? (
          <p className="mod-empty">Carregando...</p>
        ) : rows.length === 0 ? (
          <p className="mod-empty">Nenhum gasto registrado ainda.</p>
        ) : (
          <table className="mod-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Categoria</th>
                <th>Descrição</th>
                <th>Valor</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((e) => (
                <tr key={e.id}>
                  <td>{new Date(e.occurred_on).toLocaleDateString('pt-BR')}</td>
                  <td>{e.category}</td>
                  <td>{e.description ?? '—'}</td>
                  <td>R${e.amount}</td>
                  <td><button className="mod-table-del" onClick={() => remove(e.id)}>remover</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
