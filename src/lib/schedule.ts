/**
 * Regras de horário do studio, num lugar só.
 *
 * Estes quatro valores são a fonte de tudo que a agenda semanal desenha e de todo
 * cálculo de horário livre. Mudou o funcionamento do salão, muda aqui e o resto
 * acompanha: a grade, os blocos, os horários vagos e a mensagem que vai pro WhatsApp.
 */
export const OPEN_HOUR = 9;
export const CLOSE_HOUR = 19;
/** Granularidade de encaixe. Um atendimento pode começar a cada 30 minutos. */
export const SLOT_MIN = 30;
/** Dias em que o studio abre, no índice de `Date#getDay` (0 = domingo). Terça a domingo. */
export const WORK_DAYS = [2, 3, 4, 5, 6, 0];

/** Teto de horários listados na mensagem. Acima disso vira "e mais N". */
const MSG_MAX_SLOTS = 10;

/**
 * A terça-feira que abre o bloco da semana da data informada.
 * A semana do studio vai de terça a domingo, então ela não casa com a semana do
 * calendário (que o JS começa no domingo). Segunda é dia fechado: cai no bloco que
 * começa no dia seguinte, que é o que a profissional quer ver numa segunda.
 */
export function weekStart(ref: Date): Date {
  const d = new Date(ref);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const back = day === 0 ? 5 : day === 1 ? -1 : day - 2;
  d.setDate(d.getDate() - back);
  return d;
}

/** Os 6 dias abertos do bloco: terça a domingo. */
export function weekDays(ref: Date): Date[] {
  const start = weekStart(ref);
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

export function addDays(d: Date, n: number): Date {
  const out = new Date(d);
  out.setDate(out.getDate() + n);
  return out;
}

export function openingOf(day: Date): Date {
  const d = new Date(day);
  d.setHours(OPEN_HOUR, 0, 0, 0);
  return d;
}

export function closingOf(day: Date): Date {
  const d = new Date(day);
  d.setHours(CLOSE_HOUR, 0, 0, 0);
  return d;
}

/** Todos os encaixes possíveis do dia, de SLOT_MIN em SLOT_MIN, sem olhar ocupação. */
export function daySlots(day: Date): Date[] {
  const out: Date[] = [];
  const total = (CLOSE_HOUR - OPEN_HOUR) * 60;
  for (let m = 0; m < total; m += SLOT_MIN) {
    const d = openingOf(day);
    d.setMinutes(d.getMinutes() + m);
    out.push(d);
  }
  return out;
}

/** Intervalo ocupado, em epoch ms. */
export interface Busy {
  start: number;
  end: number;
}

/**
 * Encaixes em que cabe um atendimento de `durationMin` sem esbarrar em nada já marcado
 * e sem passar do horário de fechar. Note que o teste é de sobreposição de intervalo,
 * não de slot: um atendimento de 2h ocupa 4 encaixes, e nenhum deles sobra.
 */
export function freeSlots(day: Date, busy: Busy[], durationMin: number): Date[] {
  const closing = closingOf(day).getTime();
  return daySlots(day).filter((slot) => {
    const start = slot.getTime();
    const end = start + durationMin * 60000;
    if (end > closing) return false;
    return !busy.some((b) => start < b.end && end > b.start);
  });
}

function hhmm(d: Date): string {
  return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

/** "09:00, 10:30 e 14:00" */
function listaNatural(itens: string[]): string {
  if (itens.length <= 1) return itens[0] ?? '';
  return `${itens.slice(0, -1).join(', ')} e ${itens[itens.length - 1]}`;
}

/**
 * A mensagem que vai pra área de transferência quando a profissional clica no dia.
 * É texto pronto pra colar no WhatsApp da cliente, por isso o tom direto e a pergunta
 * no fim: o objetivo é a cliente responder com um horário, não ler um relatório.
 */
export function availabilityMessage(day: Date, slots: Date[]): string {
  const diaSemana = day.toLocaleDateString('pt-BR', { weekday: 'long' });
  const data = day.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });

  if (slots.length === 0) {
    return `Para ${diaSemana} (${data}) não tenho mais horário disponível. Quer que eu veja outro dia?`;
  }

  const mostrados = slots.slice(0, MSG_MAX_SLOTS).map(hhmm);
  const sobra = slots.length - mostrados.length;
  const lista = listaNatural(mostrados) + (sobra > 0 ? `, e mais ${sobra}` : '');
  const plural = slots.length === 1 ? 'horário disponível' : 'horários disponíveis';

  return `Para ${diaSemana} (${data}) temos ${slots.length} ${plural}: ${lista}.\n\nQual fica melhor pra você?`;
}
