import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { useTable } from '../../hooks/useTable';
import { useMonthFilter } from '../../hooks/useMonthFilter';
import { MonthNav } from './MonthNav';
import { StatCards, CategoryBars, groupSum } from './Dashboard';
import './StaffModule.css';

/**
 * Âmbito do lançamento. Cada profissional tem dois bolsos: o que ela gasta na vida dela
 * e o que ela põe no salão (aluguel do posto, produtos, limpeza, comida). São coisas
 * diferentes e precisam somar separado, porque a Flávia acompanha só a segunda pilha.
 */
type Scope = 'pessoal' | 'salao';

const SCOPE_LABEL: Record<Scope, string> = {
  pessoal: 'Vida pessoal',
  salao: 'Salão',
};

interface Expense {
  id: string;
  owner_id: string;
  professional: string;
  type: 'entrada' | 'saida';
  scope: Scope;
  category: string;
  description: string | null;
  amount: number;
  occurred_on: string;
  created_at: string;
}

const money = (n: number) => `R$${n.toFixed(2)}`;

export function GastosPessoais() {
  const { name, isOwner } = useAuth();
  // Com RLS: a Flávia recebe as linhas de todo mundo aqui; as outras, só as próprias.
  const { rows, loading, error, insert, remove } = useTable<Expense>('personal_expenses', 'occurred_on');
  const { filtered, label, prevMonth, nextMonth } = useMonthFilter(rows, 'occurred_on');

  const [type, setType] = useState<Expense['type']>('saida');
  const [scope, setScope] = useState<Scope>('pessoal');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [occurredOn, setOccurredOn] = useState(() => new Date().toISOString().slice(0, 10));
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const mine = useMemo(() => filtered.filter((e) => e.professional === name), [filtered, name]);

  const stats = useMemo(() => {
    const entradas = mine.filter((e) => e.type === 'entrada').reduce((s, e) => s + e.amount, 0);
    const saidas = mine.filter((e) => e.type === 'saida').reduce((s, e) => s + e.amount, 0);
    const noSalao = mine.filter((e) => e.type === 'saida' && e.scope === 'salao').reduce((s, e) => s + e.amount, 0);
    return { entradas, saidas, saldo: entradas - saidas, noSalao };
  }, [mine]);

  const barsVida = useMemo(
    () => groupSum(mine.filter((e) => e.type === 'saida' && e.scope === 'pessoal'), (e) => e.category, (e) => e.amount),
    [mine]
  );
  const barsSalao = useMemo(
    () => groupSum(mine.filter((e) => e.type === 'saida' && e.scope === 'salao'), (e) => e.category, (e) => e.amount),
    [mine]
  );

  /**
   * Item pedido pela Flávia: quanto cada uma gastou COM O SALÃO. Mostra o mês corrente
   * e o acumulado desde sempre, porque "no total" é o acumulado, mas o mês é o número
   * que ela usa pra fechar as contas. `rows` já vem sem filtro de mês.
   */
  const teamSummary = useMemo(() => {
    if (!isOwner) return [];
    const nomes = [...new Set(rows.map((e) => e.professional).filter(Boolean))];
    return nomes
      .map((professional) => {
        const doMes = filtered.filter((e) => e.professional === professional);
        const sempre = rows.filter((e) => e.professional === professional);
        const somaSalao = (list: Expense[]) =>
          list.filter((e) => e.type === 'saida' && e.scope === 'salao').reduce((s, e) => s + e.amount, 0);
        return {
          professional,
          entradas: doMes.filter((e) => e.type === 'entrada').reduce((s, e) => s + e.amount, 0),
          saidasVida: doMes.filter((e) => e.type === 'saida' && e.scope === 'pessoal').reduce((s, e) => s + e.amount, 0),
          salaoMes: somaSalao(doMes),
          salaoTotal: somaSalao(sempre),
        };
      })
      .sort((a, b) => b.salaoTotal - a.salaoTotal);
  }, [rows, filtered, isOwner]);

  const salaoEquipeTotal = useMemo(
    () => teamSummary.reduce((s, t) => s + t.salaoTotal, 0),
    [teamSummary]
  );

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      await insert({
        type,
        scope,
        category,
        description: description || null,
        amount: Number(amount),
        occurred_on: occurredOn,
        professional: name,
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
        <div className="mod-title">Controle de Gastos Pessoais</div>
        <div className="mod-sub">Vida pessoal e o que você põe no salão, separados</div>
      </div>

      <MonthNav label={label} onPrev={prevMonth} onNext={nextMonth} />

      <div className="dash">
        <StatCards
          cards={[
            { label: 'Entradas', value: money(stats.entradas), tone: 'pos' },
            { label: 'Saídas', value: money(stats.saidas), tone: 'neg' },
            { label: 'Saldo do mês', value: money(stats.saldo), tone: stats.saldo >= 0 ? 'pos' : 'neg' },
            {
              label: 'Você gastou no salão',
              value: money(stats.noSalao),
              tone: 'accent',
              note: 'Aluguel, produtos, limpeza, comida',
            },
          ]}
        />
        <div className="admin-grid">
          <CategoryBars title="Saídas da vida pessoal" rows={barsVida} />
          <CategoryBars title="Saídas com o salão" rows={barsSalao} />
        </div>
      </div>

      <form className="mod-form" onSubmit={handleSubmit}>
        <label className="mod-field">
          <span>Tipo</span>
          <select value={type} onChange={(e) => setType(e.target.value as Expense['type'])}>
            <option value="entrada">Entrada (salário, comissão...)</option>
            <option value="saida">Saída (gasto)</option>
          </select>
        </label>
        <label className="mod-field">
          <span>Âmbito</span>
          <select value={scope} onChange={(e) => setScope(e.target.value as Scope)}>
            <option value="pessoal">Vida pessoal</option>
            <option value="salao">Salão</option>
          </select>
        </label>
        <label className="mod-field">
          <span>Categoria</span>
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder={scope === 'salao' ? 'Aluguel, produtos, limpeza...' : 'Cartão, academia, mercado...'}
            required
          />
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
                <th>Âmbito</th>
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
                  <td>{SCOPE_LABEL[e.scope] ?? e.scope}</td>
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
          <div className="admin-sub">
            Quanto cada profissional já pôs no salão, e como está a vida pessoal dela em {label.toLowerCase()}.
            A coluna que importa pro fechamento é a de acumulado.
          </div>

          <StatCards
            cards={[
              {
                label: 'Equipe pôs no salão (acumulado)',
                value: money(salaoEquipeTotal),
                tone: 'accent',
                note: 'Soma de todas as profissionais, desde o começo',
              },
            ]}
          />

          {teamSummary.length === 0 ? (
            <p className="mod-empty">Ninguém lançou nada ainda.</p>
          ) : (
            <div className="admin-grid">
              {teamSummary.map((t) => (
                <div className="admin-card" key={t.professional}>
                  <div className="admin-card-name">{t.professional}</div>
                  <div className="admin-card-row">
                    <span>No salão (acumulado)</span>
                    <strong style={{ color: 'var(--accent-deep)' }}>{money(t.salaoTotal)}</strong>
                  </div>
                  <div className="admin-card-row"><span>No salão ({label.toLowerCase()})</span><strong>{money(t.salaoMes)}</strong></div>
                  <div className="admin-card-row"><span>Vida pessoal (mês)</span><strong>{money(t.saidasVida)}</strong></div>
                  <div className="admin-card-row"><span>Entradas (mês)</span><strong>{money(t.entradas)}</strong></div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
