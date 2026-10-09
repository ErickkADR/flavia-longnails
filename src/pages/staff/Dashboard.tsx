import './StaffModule.css';

/**
 * Peças de dashboard compartilhadas por Contas do Salão e Gastos Pessoais.
 *
 * Não existe nenhuma configuração aqui: os dois módulos derivam tudo dos lançamentos
 * que já estão na tabela e passam pronto. Lançou uma categoria nova, ela aparece; parou
 * de lançar, ela some. É de propósito, pra ninguém precisar cadastrar categoria antes
 * de usar o sistema.
 */

export interface StatCard {
  label: string;
  value: string;
  tone?: 'pos' | 'neg' | 'accent';
  note?: string;
}

export function StatCards({ cards }: { cards: StatCard[] }) {
  return (
    <div className="dash-cards">
      {cards.map((c) => (
        <div className="dash-card" key={c.label}>
          <div className="dash-card-lbl">{c.label}</div>
          <div className={`dash-card-val${c.tone ? ` ${c.tone}` : ''}`}>{c.value}</div>
          {c.note && <div className="dash-card-note">{c.note}</div>}
        </div>
      ))}
    </div>
  );
}

export interface BarRow {
  label: string;
  value: number;
  kind?: 'entrada' | 'saida';
}

export function CategoryBars({ title, rows }: { title: string; rows: BarRow[] }) {
  if (rows.length === 0) return null;
  // Escala relativa ao maior item da lista, não a um teto fixo: o objetivo é comparar
  // categorias entre si, e um teto fixo deixaria tudo rente ao chão em mês fraco.
  const max = Math.max(...rows.map((r) => r.value)) || 1;

  return (
    <div className="dash-bars">
      <div className="dash-bars-title">{title}</div>
      {rows.map((r) => (
        <div className="dash-bar" key={r.label}>
          <div className="dash-bar-top">
            <span className="dash-bar-cat">{r.label}</span>
            <span className="dash-bar-val">R${r.value.toFixed(2)}</span>
          </div>
          <div className="dash-bar-track">
            <div
              className={`dash-bar-fill${r.kind ? ` ${r.kind}` : ''}`}
              style={{ ['--w' as string]: `${Math.round((r.value / max) * 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Soma agrupada por chave, já ordenada do maior pro menor. Base das barras. */
export function groupSum<T>(items: T[], keyOf: (i: T) => string, valueOf: (i: T) => number): BarRow[] {
  const map = new Map<string, number>();
  for (const i of items) {
    const k = keyOf(i) || 'Sem categoria';
    map.set(k, (map.get(k) ?? 0) + valueOf(i));
  }
  return [...map.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}
