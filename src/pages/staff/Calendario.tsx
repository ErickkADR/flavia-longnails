import { useMemo, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { useTable } from '../../hooks/useTable';
import {
  WEEKDAY_NAMES, describeRule, existsIn, isoOf, lastDayOf, localDay, nthWeekday, occurrences,
} from '../../lib/bills';
import type { BillEntry, BillRule, FixedBill } from '../../lib/bills';
import { Icon } from '../../components/Icon';
import { MonthNav } from './MonthNav';
import { StatCards } from './Dashboard';
import './StaffModule.css';
import './Calendario.css';

interface Appointment {
  id: string;
  client_name: string;
  professional: string;
  service: string;
  services: { name: string; price: number }[] | null;
  price: number | null;
  scheduled_at: string;
  status: 'agendado' | 'concluido' | 'cancelado';
}

/** Uma conta no calendário: já lançada (`entry`) ou só projetada a partir da conta fixa. */
interface CalItem {
  key: string;
  name: string;
  date: string;
  /** Nulo = conta fixa de valor variável que ainda não foi preenchida. */
  amount: number | null;
  paid: boolean;
  entry: BillEntry | null;
  bill: FixedBill | null;
}

const DOW = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const brl = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
/** Versão curta pra célula do calendário, que no celular tem uns 50px de largura. */
const curto = (n: number) => n.toLocaleString('pt-BR', { maximumFractionDigits: n % 1 ? 2 : 0 });
const valueOf = (a: Appointment) => a.price ?? (a.services ?? []).reduce((s, e) => s + e.price, 0);
const num = (v: string) => Number(v.replace(',', '.'));

function shiftMonth(key: string, delta: number) {
  const [y, m] = key.split('-').map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function monthLabel(key: string) {
  const [y, m] = key.split('-').map(Number);
  const t = new Date(y, m - 1, 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  return t.charAt(0).toUpperCase() + t.slice(1);
}

const dateBR = (iso: string) => `${iso.slice(8, 10)}/${iso.slice(5, 7)}/${iso.slice(0, 4)}`;

type FormMode = null | 'fixa' | 'mes';

export function Calendario() {
  const { name, isOwner } = useAuth();
  const { rows: bills, error: billsError, insert: insertBill, update: updateBill } =
    useTable<FixedBill>('fixed_bills', 'created_at', true);
  const { rows: entries, loading, insert: insertEntry, update: updateEntry, remove: removeEntry } =
    useTable<BillEntry>('bill_entries', 'due_on', true);
  const { rows: appointments } = useTable<Appointment>('appointments', 'scheduled_at');

  const today = localDay(new Date());
  const [month, setMonth] = useState(() => today.slice(0, 7));
  const [selected, setSelected] = useState<string | null>(today);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [formMode, setFormMode] = useState<FormMode>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const panelRef = useRef<HTMLElement>(null);

  const ativas = useMemo(() => bills.filter((b) => b.active), [bills]);
  const billById = useMemo(() => new Map(bills.map((b) => [b.id, b])), [bills]);
  const doMes = useMemo(() => entries.filter((e) => e.due_on.slice(0, 7) === month), [entries, month]);

  /** Contas com data no mês: o que já foi lançado mais a projeção do que ainda não foi. */
  const items = useMemo(() => {
    const out: CalItem[] = doMes.map((e) => ({
      key: e.id, name: e.name, date: e.due_on, amount: e.amount, paid: e.paid, entry: e,
      bill: e.bill_id ? billById.get(e.bill_id) ?? null : null,
    }));
    const lancada = new Set(doMes.map((e) => `${e.bill_id}:${e.due_on}`));
    for (const b of ativas) {
      if (!existsIn(b, month)) continue;
      for (const date of occurrences(b, month)) {
        if (lancada.has(`${b.id}:${date}`)) continue;
        out.push({ key: `rec:${b.id}:${date}`, name: b.name, date, amount: b.amount, paid: false, entry: null, bill: b });
      }
    }
    return out;
  }, [doMes, ativas, billById, month]);

  const diarias = useMemo(() => ativas.filter((b) => b.rule === 'diaria'), [ativas]);
  // "Dia a escolher" ainda sem lançamento neste mês: fica esperando no painel de qualquer dia.
  const semDia = useMemo(
    () => ativas.filter((b) => b.rule === 'dia_livre' && existsIn(b, month) && !doMes.some((e) => e.bill_id === b.id)),
    [ativas, doMes, month]
  );

  // Faturamento vem da agenda DELA (a RLS deixa a Flávia ler a das outras também).
  const atendimentos = useMemo(
    () =>
      appointments
        .filter((a) => a.professional === name && a.status !== 'cancelado')
        .map((a) => ({ ...a, dia: localDay(new Date(a.scheduled_at)) }))
        .filter((a) => a.dia.slice(0, 7) === month),
    [appointments, name, month]
  );

  const late = (it: CalItem) => !it.paid && it.date < today && it.bill?.rule !== 'diaria';

  const totais = useMemo(() => {
    const conhecidas = items.filter((i) => i.amount != null);
    const aPagar = conhecidas.filter((i) => !i.paid).reduce((s, i) => s + (i.amount ?? 0), 0);
    const pago = conhecidas.filter((i) => i.paid).reduce((s, i) => s + (i.amount ?? 0), 0);
    const semValor = items.filter((i) => i.amount == null).length + semDia.length;
    const agora = Date.now();
    const faturamento = atendimentos.reduce((s, a) => s + valueOf(a), 0);
    const realizado = atendimentos
      .filter((a) => new Date(a.scheduled_at).getTime() <= agora)
      .reduce((s, a) => s + valueOf(a), 0);
    return { aPagar, pago, semValor, faturamento, realizado, lucro: faturamento - aPagar - pago };
  }, [items, semDia, atendimentos]);

  const porDia = useMemo(() => {
    const map = new Map<string, { contas: CalItem[]; ganho: number; atend: typeof atendimentos }>();
    const dia = (d: string) => {
      if (!map.has(d)) map.set(d, { contas: [], ganho: 0, atend: [] });
      return map.get(d)!;
    };
    for (const it of items) dia(it.date).contas.push(it);
    for (const a of atendimentos) {
      const d = dia(a.dia);
      d.ganho += valueOf(a);
      d.atend.push(a);
    }
    return map;
  }, [items, atendimentos]);

  if (!isOwner) return <Navigate to="/area-colaboradora/agendamento" replace />;

  const [y, m] = month.split('-').map(Number);
  const first = new Date(y, m - 1, 1).getDay();
  const last = lastDayOf(month);
  const cells: (number | null)[] = [...Array(first).fill(null), ...Array.from({ length: last }, (_, i) => i + 1)];
  while (cells.length % 7) cells.push(null);

  function goMonth(delta: number) {
    const next = shiftMonth(month, delta);
    setMonth(next);
    setSelected(next === today.slice(0, 7) ? today : null);
    setFormMode(null);
  }

  function pick(date: string) {
    const off = selected === date;
    setSelected(off ? null : date);
    setFormMode(null);
    // No celular o painel fica abaixo da dobra: sem isso o toque no dia parece não fazer nada.
    if (!off) requestAnimationFrame(() => panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }));
  }

  async function run(fn: () => Promise<void>) {
    setActionError(null);
    try {
      await fn();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Não consegui salvar.');
    }
  }

  const draft = (k: string) => drafts[k] ?? '';
  const setDraft = (k: string, v: string) => setDrafts((d) => ({ ...d, [k]: v }));
  const clearDraft = (k: string) => setDrafts((d) => { const n = { ...d }; delete n[k]; return n; });

  /** Marca/desmarca paga. Projeção com valor conhecido vira lançamento já pago. */
  const togglePaid = (it: CalItem) =>
    run(async () => {
      if (it.entry) {
        await updateEntry(it.entry.id, { paid: !it.paid, paid_on: it.paid ? null : today });
      } else if (it.bill && it.amount != null) {
        await insertEntry({ bill_id: it.bill.id, name: it.name, amount: it.amount, due_on: it.date, paid: true, paid_on: today });
      }
    });

  /** Lança o valor de uma conta: `paid` já vem true pra gasto do dia (comida, transporte). */
  const launch = (k: string, bill: FixedBill, date: string, paid: boolean) =>
    run(async () => {
      const amount = num(draft(k));
      if (!(amount >= 0) || draft(k) === '') throw new Error('Informe o valor.');
      await insertEntry({ bill_id: bill.id, name: bill.name, amount, due_on: date, paid, paid_on: paid ? today : null });
      clearDraft(k);
    });

  const sel = selected ? porDia.get(selected) : undefined;
  const contasDoDia = (sel?.contas ?? []).slice().sort((a, b) => Number(a.paid) - Number(b.paid) || a.name.localeCompare(b.name, 'pt-BR'));
  const diariasAbertas = selected ? diarias.filter((b) => !doMes.some((e) => e.bill_id === b.id && e.due_on === selected)) : [];
  const saldoDia = (sel?.ganho ?? 0) - contasDoDia.reduce((s, i) => s + (i.amount ?? 0), 0);

  return (
    <div>
      <div className="mod-header">
        <div className="mod-title">Calendário de Contas</div>
        <div className="mod-sub">Contas fixas por dia e o que a sua agenda faturou em cada um</div>
      </div>

      <div className="cal-top">
        <MonthNav label={monthLabel(month)} onPrev={() => goMonth(-1)} onNext={() => goMonth(1)} />
        {month !== today.slice(0, 7) && (
          <button type="button" className="cal-today-btn" onClick={() => { setMonth(today.slice(0, 7)); setSelected(today); }}>
            Hoje
          </button>
        )}
      </div>

      <StatCards
        cards={[
          {
            label: 'A pagar',
            value: brl(totais.aPagar),
            tone: 'neg',
            note: [totais.pago > 0 && `${brl(totais.pago)} já pago`, totais.semValor > 0 && `${totais.semValor} sem valor ainda`]
              .filter(Boolean).join(' · ') || 'nada pendente',
          },
          { label: 'Faturamento do mês', value: brl(totais.faturamento), tone: 'pos', note: `${brl(totais.realizado)} já realizado` },
          {
            label: 'Lucro do mês',
            value: brl(totais.lucro),
            tone: totais.lucro >= 0 ? 'pos' : 'neg',
            note: 'Faturamento menos todas as contas do mês',
          },
        ]}
      />

      {(billsError || actionError) && (
        <p className="mod-error">
          {billsError ? 'As tabelas do calendário ainda não existem no banco. Rode o supabase/migration.sql no SQL Editor do Supabase.' : actionError}
        </p>
      )}

      <div className="cal-card">
        <div className="cal-dow">{DOW.map((d) => <div key={d}>{d}</div>)}</div>
        <div className="cal-grid">
          {cells.map((d, i) => {
            if (!d) return <div key={i} className="cal-cell is-blank" />;
            const date = isoOf(month, d);
            const info = porDia.get(date);
            const contas = info?.contas ?? [];
            const saida = contas.reduce((s, c) => s + (c.amount ?? 0), 0);
            const aPreencher = contas.filter((c) => c.amount == null).length;
            const atrasada = contas.some(late);
            const ganho = info?.ganho ?? 0;
            return (
              <button
                key={i}
                type="button"
                className={`cal-cell${date === selected ? ' is-sel' : ''}${date === today ? ' is-today' : ''}`}
                onClick={() => pick(date)}
                aria-pressed={date === selected}
                aria-label={`Dia ${d}`}
              >
                <span className="cal-num">
                  <span>{d}</span>
                  {atrasada && <span className="cal-late" title="Conta atrasada" />}
                </span>
                {ganho > 0 && <span className="cal-in">+{curto(ganho)}</span>}
                {saida > 0 && <span className={`cal-out${atrasada ? ' is-late' : ''}`}>−{curto(saida)}</span>}
                {aPreencher > 0 && <span className="cal-fill">{aPreencher} a preencher</span>}
                {(ganho > 0 || saida > 0) && (
                  <span className="cal-bal">dia {ganho - saida < 0 ? '−' : ''}{curto(Math.abs(ganho - saida))}</span>
                )}
              </button>
            );
          })}
        </div>
        <p className="cal-foot">
          Contas fixas aparecem sozinhas no dia certo e só são lançadas quando você preenche o valor ou marca como paga.
          Comida e transporte ficam no painel do dia e só contam depois de lançados.
        </p>
      </div>

      <section className="cal-panel" ref={panelRef}>
        {!selected ? (
          <p className="mod-empty">Toque num dia para ver as contas e os atendimentos dele.</p>
        ) : (
          <>
            <div className="cal-panel-head">
              <h2>{dateBR(selected)}</h2>
              <span className={saldoDia >= 0 ? 'is-pos' : 'is-neg'}>Saldo do dia {brl(saldoDia)}</span>
            </div>

            <div className="cal-actions">
              <button type="button" className={`cal-add${formMode === 'fixa' ? ' is-on' : ''}`} onClick={() => setFormMode(formMode === 'fixa' ? null : 'fixa')}>
                + Conta fixa
              </button>
              <button type="button" className={`cal-add${formMode === 'mes' ? ' is-on' : ''}`} onClick={() => setFormMode(formMode === 'mes' ? null : 'mes')}>
                + Conta só deste mês
              </button>
            </div>

            {formMode === 'mes' && (
              <MonthBillForm
                date={selected}
                onCancel={() => setFormMode(null)}
                onSave={(nome, valor) => run(async () => {
                  await insertEntry({ bill_id: null, name: nome, amount: valor, due_on: selected, paid: false });
                  setFormMode(null);
                })}
              />
            )}
            {formMode === 'fixa' && (
              <FixedBillForm
                date={selected}
                onCancel={() => setFormMode(null)}
                onSave={(bill) => run(async () => {
                  await insertBill(bill);
                  setFormMode(null);
                })}
              />
            )}

            {(sel?.atend.length ?? 0) > 0 && (
              <div className="cal-block">
                <div className="cal-block-title">Atendimentos <b className="is-pos">+{brl(sel!.ganho)}</b></div>
                <ul className="cal-list">
                  {sel!.atend
                    .slice()
                    .sort((a, b) => a.scheduled_at.localeCompare(b.scheduled_at))
                    .map((a) => (
                      <li key={a.id}>
                        <span className="cal-time">{new Date(a.scheduled_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                        <div className="cal-li-main">
                          <p>{a.client_name}</p>
                          <small>{a.services?.length ? a.services.map((s) => s.name).join(' + ') : a.service}</small>
                        </div>
                        <span className="cal-amt is-pos">{brl(valueOf(a))}</span>
                      </li>
                    ))}
                </ul>
              </div>
            )}

            <div className="cal-block">
              <div className="cal-block-title">Contas</div>
              {contasDoDia.length === 0 && diariasAbertas.length === 0 && semDia.length === 0 ? (
                <p className="mod-empty">Nenhuma conta neste dia.</p>
              ) : (
                <ul className="cal-list">
                  {contasDoDia.map((it) => {
                    const atras = late(it);
                    const status = atras ? 'Atrasada' : it.paid ? 'Paga' : 'A pagar';
                    const origem = it.bill ? 'conta fixa' : 'só deste mês';
                    if (it.amount == null) {
                      return (
                        <li key={it.key} className={atras ? 'is-late' : ''}>
                          <span className="cal-check is-empty" aria-hidden="true" />
                          <div className="cal-li-main">
                            <p>{it.name}</p>
                            <small><span className={atras ? 'is-neg' : ''}>{atras ? 'Atrasada' : 'Valor a preencher'}</span> · {origem}</small>
                          </div>
                          <form className="cal-inline" onSubmit={(e) => { e.preventDefault(); if (it.bill) launch(it.key, it.bill, it.date, false); }}>
                            <input type="number" step="0.01" min="0" inputMode="decimal" placeholder="R$" value={draft(it.key)} onChange={(e) => setDraft(it.key, e.target.value)} required />
                            <button type="submit">Salvar</button>
                          </form>
                        </li>
                      );
                    }
                    return (
                      <li key={it.key} className={it.paid ? 'is-paid' : atras ? 'is-late' : ''}>
                        <button
                          type="button"
                          className={`cal-check${it.paid ? ' is-on' : ''}`}
                          onClick={() => togglePaid(it)}
                          title={it.paid ? 'Desmarcar paga' : 'Marcar como paga'}
                        >
                          <Icon name="check" strokeWidth={3} />
                        </button>
                        <div className="cal-li-main">
                          <p>{it.name}</p>
                          <small><span className={atras ? 'is-neg' : ''}>{status}</span> · {origem}</small>
                        </div>
                        <span className="cal-amt">−{brl(it.amount)}</span>
                        {it.entry && (
                          <button
                            type="button"
                            className="mod-table-del"
                            onClick={() => run(() => removeEntry(it.entry!.id))}
                            title={it.bill ? 'Volta a ser só a conta fixa projetada' : 'Apaga a conta'}
                          >
                            {it.bill ? 'desfazer' : 'remover'}
                          </button>
                        )}
                      </li>
                    );
                  })}

                  {diariasAbertas.map((b) => {
                    const k = `dia:${b.id}:${selected}`;
                    return (
                      <li key={k} className="is-idle">
                        <span className="cal-check is-empty" aria-hidden="true" />
                        <div className="cal-li-main">
                          <p>{b.name}</p>
                          <small>Gasto do dia · só conta depois de lançar</small>
                        </div>
                        <form className="cal-inline" onSubmit={(e) => { e.preventDefault(); launch(k, b, selected, true); }}>
                          <input type="number" step="0.01" min="0" inputMode="decimal" placeholder="R$" value={draft(k)} onChange={(e) => setDraft(k, e.target.value)} required />
                          <button type="submit">Lançar</button>
                        </form>
                      </li>
                    );
                  })}

                  {semDia.map((b) => {
                    const k = `livre:${b.id}`;
                    return (
                      <li key={k} className="is-idle">
                        <span className="cal-check is-empty" aria-hidden="true" />
                        <div className="cal-li-main">
                          <p>{b.name}</p>
                          <small>Ainda sem dia neste mês · lançar aqui marca para {dateBR(selected).slice(0, 5)}</small>
                        </div>
                        <form className="cal-inline" onSubmit={(e) => { e.preventDefault(); launch(k, b, selected, false); }}>
                          <input type="number" step="0.01" min="0" inputMode="decimal" placeholder="R$" value={draft(k)} onChange={(e) => setDraft(k, e.target.value)} required />
                          <button type="submit">Neste dia</button>
                        </form>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </>
        )}
      </section>

      <FixedBillsList bills={ativas} loading={loading} onUpdate={(id, patch) => run(() => updateBill(id, patch))} />
    </div>
  );
}

function MonthBillForm({ date, onSave, onCancel }: { date: string; onSave: (nome: string, valor: number) => void; onCancel: () => void }) {
  const [nome, setNome] = useState('');
  const [valor, setValor] = useState('');
  function submit(e: FormEvent) {
    e.preventDefault();
    onSave(nome.trim(), num(valor));
  }
  return (
    <form className="mod-form cal-form" onSubmit={submit}>
      <div className="cal-form-title mod-field-wide">Conta só deste mês, vence em {dateBR(date)}</div>
      <label className="mod-field"><span>Nome</span><input value={nome} onChange={(e) => setNome(e.target.value)} required /></label>
      <label className="mod-field"><span>Valor (R$)</span><input type="number" step="0.01" min="0" inputMode="decimal" value={valor} onChange={(e) => setValor(e.target.value)} required /></label>
      <div className="cal-form-btns">
        <button type="button" className="cal-cancel" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="btn-primary">Criar conta</button>
      </div>
    </form>
  );
}

function FixedBillForm({ date, onSave, onCancel }: { date: string; onSave: (b: Partial<FixedBill>) => void; onCancel: () => void }) {
  const dia = Number(date.slice(8, 10));
  const [y, m] = date.split('-').map(Number);
  const weekday = new Date(y, m - 1, dia).getDay();
  const [nome, setNome] = useState('');
  const [valor, setValor] = useState('');
  const [rule, setRule] = useState<BillRule>('mensal');
  const [weeks, setWeeks] = useState<number[]>([nthWeekday(dia)]);

  function submit(e: FormEvent) {
    e.preventDefault();
    onSave({
      name: nome.trim(),
      amount: valor === '' ? null : num(valor),
      rule,
      day_of_month: rule === 'mensal' ? dia : null,
      weekday: rule === 'semana_do_mes' ? weekday : null,
      weeks: rule === 'semana_do_mes' ? weeks : null,
    });
  }

  return (
    <form className="mod-form cal-form" onSubmit={submit}>
      <div className="cal-form-title mod-field-wide">Nova conta fixa</div>
      <label className="mod-field"><span>Nome</span><input value={nome} onChange={(e) => setNome(e.target.value)} required /></label>
      <label className="mod-field">
        <span>Valor (R$)</span>
        <input type="number" step="0.01" min="0" inputMode="decimal" value={valor} onChange={(e) => setValor(e.target.value)} placeholder="vazio = muda todo mês" />
      </label>
      <label className="mod-field mod-field-wide">
        <span>Repete</span>
        <select value={rule} onChange={(e) => setRule(e.target.value as BillRule)}>
          <option value="mensal">Todo mês no dia {dia}</option>
          <option value="semana_do_mes">Em algumas {WEEKDAY_NAMES[weekday]}s do mês</option>
          <option value="diaria">Todo dia, lanço quando usar</option>
          <option value="dia_livre">Uma vez por mês, escolho o dia</option>
        </select>
      </label>
      {rule === 'semana_do_mes' && (
        <div className="cal-weeks mod-field-wide">
          {[1, 2, 3, 4, 5].map((w) => (
            <label key={w} className="mod-checkbox">
              <input
                type="checkbox"
                checked={weeks.includes(w)}
                onChange={(e) => setWeeks((cur) => (e.target.checked ? [...cur, w].sort() : cur.filter((x) => x !== w)))}
              />
              {w}ª {WEEKDAY_NAMES[weekday]}
            </label>
          ))}
        </div>
      )}
      <div className="cal-form-btns">
        <button type="button" className="cal-cancel" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="btn-primary" disabled={rule === 'semana_do_mes' && weeks.length === 0}>Criar conta fixa</button>
      </div>
    </form>
  );
}

function FixedBillsList({ bills, loading, onUpdate }: {
  bills: FixedBill[]; loading: boolean; onUpdate: (id: string, patch: Partial<FixedBill>) => void;
}) {
  const [editing, setEditing] = useState<string | null>(null);
  const [nome, setNome] = useState('');
  const [valor, setValor] = useState('');
  const [dia, setDia] = useState('');

  function start(b: FixedBill) {
    setEditing(b.id);
    setNome(b.name);
    setValor(b.amount == null ? '' : String(b.amount));
    setDia(b.day_of_month ? String(b.day_of_month) : '');
  }

  function save(b: FixedBill) {
    onUpdate(b.id, {
      name: nome.trim() || b.name,
      amount: valor === '' ? null : num(valor),
      ...(b.rule === 'mensal' && dia ? { day_of_month: Math.min(31, Math.max(1, Number(dia))) } : {}),
    });
    setEditing(null);
  }

  const ordenadas = [...bills].sort((a, b) => (a.day_of_month ?? 99) - (b.day_of_month ?? 99) || a.name.localeCompare(b.name, 'pt-BR'));

  return (
    <div className="admin-section">
      <div className="admin-title">Contas fixas</div>
      <div className="admin-sub">
        Mudar o valor ou o dia vale daqui pra frente: o que já foi lançado continua como estava.
        Remover tira a conta do calendário, sem apagar os pagamentos dela.
      </div>
      {loading ? (
        <p className="mod-empty">Carregando...</p>
      ) : ordenadas.length === 0 ? (
        <p className="mod-empty">Nenhuma conta fixa ainda. Toque num dia do calendário para criar.</p>
      ) : (
        <ul className="cal-fixed">
          {ordenadas.map((b) =>
            editing === b.id ? (
              <li key={b.id} className="is-editing">
                <input value={nome} onChange={(e) => setNome(e.target.value)} aria-label="Nome" />
                {b.rule === 'mensal' && (
                  <input type="number" min="1" max="31" value={dia} onChange={(e) => setDia(e.target.value)} aria-label="Dia" className="cal-fixed-day" />
                )}
                <input type="number" step="0.01" min="0" value={valor} onChange={(e) => setValor(e.target.value)} placeholder="variável" aria-label="Valor" />
                <button type="button" className="cal-inline-btn" onClick={() => save(b)}>Salvar</button>
                <button type="button" className="mod-table-del" onClick={() => setEditing(null)}>cancelar</button>
              </li>
            ) : (
              <li key={b.id}>
                <div className="cal-li-main">
                  <p>{b.name}</p>
                  <small>{describeRule(b)}</small>
                </div>
                <span className="cal-amt">{b.amount == null ? 'valor variável' : brl(b.amount)}</span>
                <button type="button" className="mod-table-del" onClick={() => start(b)}>editar</button>
                <button type="button" className="mod-table-del" onClick={() => onUpdate(b.id, { active: false })}>remover</button>
              </li>
            )
          )}
        </ul>
      )}
    </div>
  );
}
