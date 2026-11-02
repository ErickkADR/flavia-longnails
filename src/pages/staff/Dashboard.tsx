import './StaffModule.css';

/**
 * Cartões de total, compartilhados por Contas do Salão e o Calendário de Contas. As
 * barras por categoria moravam aqui também e saíram junto com Gastos Pessoais.
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
