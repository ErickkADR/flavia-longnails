import { useMemo } from 'react';
import {
  OPEN_HOUR, CLOSE_HOUR, WORK_DAYS,
  availabilityMessage, closingOf, daySlots, freeSlots, openingOf,
} from '../../lib/schedule';
import type { Busy } from '../../lib/schedule';
import './WeekAgenda.css';

/** Altura de uma hora na grade, em px. É o que traduz tempo em espaço na tela. */
const PX_PER_HOUR = 56;

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

function topFor(d: Date) {
  const minutes = (d.getHours() - OPEN_HOUR) * 60 + d.getMinutes();
  return (minutes / 60) * PX_PER_HOUR;
}

export function WeekAgenda({ days, items, durationMin, onPickSlot, onCopyDay, copiedDay }: Props) {
  const hours = useMemo(
    () => Array.from({ length: CLOSE_HOUR - OPEN_HOUR }, (_, i) => OPEN_HOUR + i),
    []
  );
  const today = new Date();

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

  return (
    <div className="wk">
      <div className="wk-grid" style={{ ['--px-hour' as string]: `${PX_PER_HOUR}px` }}>
        <div className="wk-corner" />
        {days.map((d) => {
          const livres = freeSlots(d, busyByDay.get(d.toDateString()) ?? [], durationMin);
          const key = d.toDateString();
          const fechado = !WORK_DAYS.includes(d.getDay());
          return (
            <button
              type="button"
              key={`h-${key}`}
              className={`wk-dayhead${sameDay(d, today) ? ' is-today' : ''}`}
              onClick={() => onCopyDay(d, availabilityMessage(d, livres))}
              title="Copiar a mensagem de horários livres deste dia"
            >
              <span className="wk-dow">{d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')}</span>
              <span className="wk-date">{d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}</span>
              <span className="wk-free">
                {copiedDay === key ? 'copiado!' : fechado ? 'fechado' : `${livres.length} livre${livres.length === 1 ? '' : 's'}`}
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
          return (
            <div className="wk-col" key={`c-${d.toDateString()}`}>
              {daySlots(d).map((slot) => {
                const cabe = encaixaveis.has(slot.getTime());
                const passou = slot.getTime() < Date.now();
                return (
                  <button
                    type="button"
                    key={slot.getTime()}
                    className={`wk-slot${cabe ? ' is-free' : ''}${passou ? ' is-past' : ''}`}
                    style={{ top: topFor(slot) }}
                    disabled={!cabe}
                    onClick={() => onPickSlot(slot)}
                    title={cabe ? `Agendar às ${slot.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}` : 'Não cabe aqui'}
                  />
                );
              })}

              {doDia.map((it) => {
                const fim = new Date(it.start.getTime() + it.durationMin * 60000);
                const clamped = Math.min(fim.getTime(), closingOf(d).getTime());
                const altura = Math.max(
                  18,
                  ((clamped - Math.max(it.start.getTime(), openingOf(d).getTime())) / 3600000) * PX_PER_HOUR
                );
                return (
                  <div
                    key={it.id}
                    className={`wk-item ${it.status}`}
                    style={{ top: topFor(it.start), height: altura }}
                    title={`${it.client_name} — ${it.label}`}
                  >
                    <span className="wk-item-time">
                      {it.start.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="wk-item-name">{it.client_name}</span>
                    <span className="wk-item-svc">{it.label}</span>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      <p className="wk-legend">
        Clique num espaço vazio para jogar o horário no formulário. Clique no cabeçalho do dia
        para copiar a mensagem de horários livres. Os vagos consideram a duração do que você
        já selecionou.
      </p>
    </div>
  );
}
