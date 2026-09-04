export function MonthNav({ label, onPrev, onNext }: { label: string; onPrev: () => void; onNext: () => void }) {
  return (
    <div className="month-nav">
      <button type="button" onClick={onPrev} aria-label="Mês anterior">‹</button>
      <span>{label}</span>
      <button type="button" onClick={onNext} aria-label="Próximo mês">›</button>
    </div>
  );
}
