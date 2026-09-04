import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { useTable } from '../../hooks/useTable';
import { useMonthFilter } from '../../hooks/useMonthFilter';
import { MonthNav } from './MonthNav';
import './StaffModule.css';

interface Expense {
  id: string;
  owner_id: string;
  professional: string;
  type: 'entrada' | 'saida';
  category: string;
  description: string | null;
  amount: number;
  occurred_on: string;
  created_at: string;
}

export function GastosPessoais() {
  const { name, isOwner } = useAuth();
  // Com RLS: a Flávia recebe as linhas de todo mundo aqui; as outras, só as próprias.
  const { rows, loading, error, insert, remove } = useTable<Expense>('personal_expenses', 'occurred_on');
  const { filtered, label, prevMonth, nextMonth } = useMonthFilter(rows, 'occurred_on');

  const [type, setType] = useState<Expense['type']>('saida');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [occurredOn, setOccurredOn] = useState(() => new Date().toISOString().slice(0, 10));
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const mine = useMemo(() => filtered.filter((e) => e.professional === name), [filtered, name]);
  const balance = useMemo(() => mine.reduce((sum, e) => sum + (e.type === 'entrada' ? e.amount : -e.amount), 0), [mine]);

  const teamSummary = useMemo(() => {
    if (!isOwner) return [];
    const byPerson = new Map<string, { entradas: number; saidas: number }>();
    for (const e of filtered) {
      const cur = byPerson.get(e.professional) ?? { entradas: 0, saidas: 0 };
      if (e.type === 'entrada') cur.entradas += e.amount;
      else cur.saidas += e.amount;
      byPerson.set(e.professional, cur);
    }
    return Array.from(byPerson.entries()).map(([professional, v]) => ({ professional, ...v, saldo: v.entradas - v.saidas }));
  }, [filtered, isOwner]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      await insert({ type, category, description: description || null, amount: Number(amount), occurred_on: occurredOn, professional: name });
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
          Seu saldo do mês: <strong style={{ color: balance >= 0 ? 'var(--accent-deep)' : '#a13f2c' }}>R${balance.toFixed(2)}</strong>
        </div>
      </div>

      <MonthNav label={label} onPrev={prevMonth} onNext={nextMonth} />

      <form className="mod-form" onSubmit={handleSubmit}>
        <label className="mod-field">
          <span>Tipo</span>
          <select value={type} onChange={(e) => setType(e.target.value as Expense['type'])}>
            <option value="entrada">Entrada (salário, comissão...)</option>
            <option value="saida">Saída (gasto)</option>
          </select>
        </label>
        <label className="mod-field">
          <span>Categoria</span>
          <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Aluguel, cartão, academia..." required />
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
        ) : mine.length === 0 ? (
          <p className="mod-empty">Nenhum lançamento seu neste mês.</p>
        ) : (
          <table className="mod-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Tipo</th>
                <th>Categoria</th>
                <th>Descrição</th>
                <th>Valor</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {mine.map((e) => (
                <tr key={e.id}>
                  <td>{new Date(e.occurred_on).toLocaleDateString('pt-BR')}</td>
                  <td><span className={`mod-tag ${e.type}`}>{e.type}</span></td>
                  <td>{e.category}</td>
                  <td>{e.description ?? '—'}</td>
                  <td>{e.type === 'saida' ? '-' : ''}R${e.amount}</td>
                  <td><button className="mod-table-del" onClick={() => remove(e.id)}>remover</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isOwner && (
        <div className="admin-section">
          <div className="admin-title">Visão Geral da Equipe</div>
          <div className="admin-sub">Gastos pessoais de todas as profissionais em {label.toLowerCase()} — pra ter noção do quanto o studio precisa faturar.</div>
          {teamSummary.length === 0 ? (
            <p className="mod-empty">Ninguém lançou nada neste mês ainda.</p>
          ) : (
            <div className="admin-grid">
              {teamSummary.map((t) => (
                <div className="admin-card" key={t.professional}>
                  <div className="admin-card-name">{t.professional}</div>
                  <div className="admin-card-row"><span>Entradas</span><strong>R${t.entradas.toFixed(2)}</strong></div>
                  <div className="admin-card-row"><span>Saídas</span><strong>R${t.saidas.toFixed(2)}</strong></div>
                  <div className="admin-card-row"><span>Saldo</span><strong style={{ color: t.saldo >= 0 ? 'var(--accent-deep)' : '#a13f2c' }}>R${t.saldo.toFixed(2)}</strong></div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
