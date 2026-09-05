import { useMemo, useState } from 'react';

function currentMonthKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

/**
 * Filtra uma lista por mês (campo de data no formato YYYY-MM-DD) e navega entre meses.
 * Sempre abre no mês atual — quando o mês vira, o filtro já mostra o mês novo vazio,
 * do mesmo jeito que a planilha antiga virava uma aba nova a cada mês.
 */
export function useMonthFilter<T>(rows: T[], dateField: keyof T) {
  const [month, setMonth] = useState(currentMonthKey);

  const filtered = useMemo(
    () => rows.filter((r) => String(r[dateField]).slice(0, 7) === month),
    [rows, dateField, month]
  );

  const label = useMemo(() => {
    const [y, m] = month.split('-').map(Number);
    const text = new Date(y, m - 1, 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    return text.charAt(0).toUpperCase() + text.slice(1);
  }, [month]);

  function shift(delta: number) {
    const [y, m] = month.split('-').map(Number);
    const d = new Date(y, m - 1 + delta, 1);
    setMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  }

  // `month` sai junto porque o controle de aluguel precisa da chave YYYY-MM pra
  // montar o reference_month da linha, e nao so da lista ja filtrada.
  return { filtered, label, month, prevMonth: () => shift(-1), nextMonth: () => shift(1) };
}
