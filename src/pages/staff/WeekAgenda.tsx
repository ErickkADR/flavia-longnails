import { useEffect, useMemo, useState } from 'react';
import {
  OPEN_HOUR, CLOSE_HOUR, WORK_DAYS,
  availabilityMessage, closingOf, daySlots, freeSlots, openingOf,
} from '../../lib/schedule';
import type { Busy } from '../../lib/schedule';
import './WeekAgenda.css';

/** Altura de uma hora na grade, em px. É o que traduz tempo em espaço na tela. */
const PX_PER_HOUR = 48;

export interface AgendaItem {
  id: string;
  client_name: string;
  label: string;
  start: Date;
  durationMin: number;
  status: 'agendado' | 'concluido' | 'cancelado';
}

interface Props {
  days: Date[];
  items: AgendaItem[];
  /** Duração do atendimento sendo montado no formulário, pra saber onde ele cabe. */
  durationMin: number;
  onPickSlot: (start: Date) => void;
  onCopyDay: (day: Date, text: string) => void;
  copiedDay: string | null;
}

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function minutesFromOpening(d: Date) {
  return (d.getHours() - OPEN_HOUR) * 60 + d.getMinutes();
}

function topFor(d: Date) {
  return (minutesFromOpening(d) / 60) * PX_PER_HOUR;
}

export function WeekAgenda({ days, items, durationMin, onPickSlot, onCopyDay, copiedDay }: Props) {
  const hours = useMemo(
    () => Array.from({ length: CLOSE_HOUR - OPEN_HOUR }, (_, i) => OPEN_HOUR + i),
    []
  );

  // A linha de "agora" precisa andar sozinha, senão congela no horário em que a tela
  // abriu e passa a mentir depois de alguns minutos com a aba aberta.
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  /** Ocupação por dia. Cancelado não bloqueia horário: a vaga voltou a existir. */
  const busyByDay = useMemo(() => {
    const map = new Map<string, Busy[]>();
    for (const it of items) {
      if (it.status === 'cancelado') continue;
      const key = it.start.toDateString();
      const start = it.start.getTime();
      const list = map.get(key) ?? [];
      list.push({ start, end: start + it.durationMin * 60000 });
      map.set(key, list);
    }
    return map;
  }, [items]);

  const semanaVazia = useMemo(
    () => !items.some((it) => days.some((d) => sameDay(it.start, d))),
    [items, days]
  );

  const nowMin = minutesFromOpening(now);
  const nowVisivel = nowMin >= 0 && nowMin <= (CLOSE_HOUR - OPEN_HOUR) * 60;

  return (
    <div className="wk">
      <div className="wk-grid" style={{ ['--px-hour' as string]: `${PX_PER_HOUR}px` }}>
        <div className="wk-corner">
          <span>{OPEN_HOUR}h às {CLOSE_HOUR}h</span>
        </div>

        {days.map((d) => {
          const livres = freeSlots(d, busyByDay.get(d.toDateString()) ?? [], durationMin);
          const key = d.toDateString();
          const fechado = !WORK_DAYS.includes(d.getDay());
          const hoje = sameDay(d, now);
          const copiado = copiedDay === key;
          return (
            <button
              type="button"
              key={`h-${key}`}
              className={`wk-dayhead${hoje ? ' is-today' : ''}${copiado ? ' is-copied' : ''}`}
              onClick={() => onCopyDay(d, availabilityMessage(d, livres))}
              title="Copiar a mensagem de horários livres deste dia"
            >
              <span className="wk-dow">{d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')}</span>
              <span className="wk-date">{d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}</span>
              <span className={`wk-pill${livres.length === 0 ? ' is-full' : ''}`}>
                {copiado ? '✓ copiado' : fechado ? 'fechado' : `${livres.length} ${livres.length === 1 ? 'vaga' : 'vagas'}`}
              </span>
            </button>
          );
        })}

        <div className="wk-hours">
          {hours.map((h) => (
            <div className="wk-hour" key={h}><span>{String(h).padStart(2, '0')}:00</span></div>
          ))}
        </div>

        {days.map((d) => {
          const doDia = items.filter((it) => sameDay(it.start, d));
          const ocupado = busyByDay.get(d.toDateString()) ?? [];
          const encaixaveis = new Set(freeSlots(d, ocupado, durationMin).map((s) => s.getTime()));
          const hoje = sameDay(d, now);
          return (
            <div className={`wk-col${hoje ? ' is-today' : ''}`} key={`c-${d.toDateString()}`}>
              {daySlots(d).map((slot) => {
                const cabe = encaixaveis.has(slot.getTime());
                const passou = slot.getTime() < now.getTime();
                const hora = slot.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                return (
                  <button
                    type="button"
                    key={slot.getTime()}
                    className={`wk-slot${cabe ? ' is-free' : ''}${passou ? ' is-past' : ''}`}
                    style={{ top: topFor(slot) }}
                    disabled={!cabe}
                    onClick={() => onPickSlot(slot)}
                    title={cabe ? `Agendar às ${hora}` : 'Não cabe aqui'}
                  >
                    <span className="wk-slot-hint">{hora}</span>
                  </button>
                );
              })}

              {hoje && nowVisivel && (
                <div className="wk-now" style={{ top: (nowMin / 60) * PX_PER_HOUR }} aria-hidden="true">
                  <span className="wk-now-dot" />
                </div>
              )}

              {doDia.map((it) => {
                const fim = new Date(it.start.getTime() + it.durationMin * 60000);
                const clamped = Math.min(fim.getTime(), closingOf(d).getTime());
                const altura = Math.max(
                  20,
                  ((clamped - Math.max(it.start.getTime(), openingOf(d).getTime())) / 3600000) * PX_PER_HOUR
                );
                const curto = altura < 42;
                return (
                  <div
                    key={it.id}
                    className={`wk-item ${it.status}${curto ? ' is-short' : ''}`}
                    style={{ top: topFor(it.start), height: altura }}
                    title={`${it.start.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} · ${it.client_name} · ${it.label}`}
                  >
                    <span className="wk-item-name">{it.client_name}</span>
                    {!curto && <span className="wk-item-svc">{it.label}</span>}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {semanaVazia && (
        <p className="wk-empty">
          Nenhum atendimento nesta semana. Clique num horário livre da grade para começar
          um agendamento, ou no cabeçalho de um dia para copiar a lista de vagas.
        </p>
      )}
    </div>
  );
}
