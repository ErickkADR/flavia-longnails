/**
 * Contas fixas do calendário da Flávia: a regra de quando cada uma vence.
 *
 * Nada aqui grava no banco. A conta fixa (`fixed_bills`) só diz quando ela cai; o
 * calendário projeta a ocorrência a partir disso, e ela só vira linha em `bill_entries`
 * quando a Flávia preenche o valor ou marca como paga. É o mesmo modelo do calendário de
 * Finanças do SISTEMA: mudar a regra não deixa lançamento antigo errado pra trás.
 */

export type BillRule = 'mensal' | 'semana_do_mes' | 'diaria' | 'dia_livre';

export interface FixedBill {
  id: string;
  name: string;
  /** Nulo = valor muda todo mês e é preenchido no calendário (fatura de cartão, luz). */
  amount: number | null;
  rule: BillRule;
  day_of_month: number | null;
  weekday: number | null;
  /** Quais ocorrências do `weekday` no mês: [1, 3] = primeira e terceira. */
  weeks: number[] | null;
  active: boolean;
  created_at: string;
}

export interface BillEntry {
  id: string;
  /** Nulo = conta só daquele mês, criada direto no calendário. */
  bill_id: string | null;
  name: string;
  amount: number;
  due_on: string;
  paid: boolean;
  paid_on: string | null;
  created_at: string;
}

export const WEEKDAY_NAMES = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];

const pad = (n: number) => String(n).padStart(2, '0');

/** Data LOCAL em YYYY-MM-DD. O recorte do ISO é UTC e jogaria as 22h do dia 31 pro mês seguinte. */
export const localDay = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export function lastDayOf(month: string): number {
  const [y, m] = month.split('-').map(Number);
  return new Date(y, m, 0).getDate();
}

export const isoOf = (month: string, day: number) => `${month}-${pad(day)}`;

/** Qual ocorrência daquele dia da semana no mês: dia 1 a 7 é a 1ª, 8 a 14 a 2ª... */
export const nthWeekday = (day: number) => Math.ceil(day / 7);

/**
 * Dias do mês em que a conta vence. `diaria` e `dia_livre` não têm data fixa e voltam
 * vazio: a primeira aparece em todo dia selecionado, a segunda fica esperando a Flávia
 * escolher o dia.
 */
export function occurrences(bill: FixedBill, month: string): string[] {
  const last = lastDayOf(month);
  if (bill.rule === 'mensal' && bill.day_of_month) {
    // Dia 31 em mês de 30 cai no último dia, em vez de pular o mês.
    return [isoOf(month, Math.min(bill.day_of_month, last))];
  }
  if (bill.rule === 'semana_do_mes' && bill.weekday != null && bill.weeks?.length) {
    const [y, m] = month.split('-').map(Number);
    const out: string[] = [];
    for (let d = 1; d <= last; d++) {
      if (new Date(y, m - 1, d).getDay() === bill.weekday && bill.weeks.includes(nthWeekday(d))) {
        out.push(isoOf(month, d));
      }
    }
    return out;
  }
  return [];
}

/** A conta fixa não é projetada em mês anterior ao que ela foi criada. */
export const existsIn = (bill: FixedBill, month: string) => bill.created_at.slice(0, 7) <= month;

export function describeRule(bill: Pick<FixedBill, 'rule' | 'day_of_month' | 'weekday' | 'weeks'>): string {
  switch (bill.rule) {
    case 'mensal':
      return `Todo dia ${bill.day_of_month}`;
    case 'semana_do_mes': {
      const weeks = [...(bill.weeks ?? [])].sort().map((w) => `${w}ª`);
      const list = weeks.length > 1 ? `${weeks.slice(0, -1).join(', ')} e ${weeks[weeks.length - 1]}` : weeks[0];
      return `${list} ${WEEKDAY_NAMES[bill.weekday ?? 1]} do mês`;
    }
    case 'diaria':
      return 'Todo dia, lança quando usar';
    case 'dia_livre':
      return 'Uma vez por mês, no dia que escolher';
  }
}
