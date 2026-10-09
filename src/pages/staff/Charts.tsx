import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import './Charts.css';

/**
 * Gráficos da Contas do Salão, portados de `public/ui/charts.js` do ERP Módulo Técnico
 * (tela Suporte Remoto): faixa de KPIs que comanda uma linha, barras por dia da semana com
 * média, rosca com legenda e lista ranqueada. SVG na mão, sem biblioteca de gráfico.
 */

export const SERIES = ['#534D45', '#B08A5B', '#DCC29C', '#8C9A7E', '#C9B8A6'];

const nf0 = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 });
const nf1 = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
export const fmtInt = (n: number) => nf0.format(n);
export const fmtDec = (n: number) => nf1.format(n);
export const fmtMoney = (n: number) =>
  n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
export const fmtMoneyShort = (n: number) =>
  n >= 1000 ? `R$${fmtDec(n / 1000)} mil` : `R$${fmtInt(n)}`;

const r2 = (n: number) => Math.round(n * 100) / 100;

function niceMax(v: number, faixas = 4, inteiro = true) {
  if (!(v > 0)) return faixas;
  const bruto = v / faixas;
  const mag = Math.pow(10, Math.floor(Math.log10(bruto)));
  let passo = 10 * mag;
  for (const p of [1, 2, 2.5, 5, 10]) {
    if (p * mag >= bruto) { passo = p * mag; break; }
  }
  if (inteiro && passo < 1) passo = 1;
  return passo * faixas;
}

// Interpolação monotônica (Fritsch-Carlson): curva suave sem "barriga" abaixo de zero.
function caminhoSuave(pts: [number, number][]) {
  const n = pts.length;
  if (!n) return '';
  if (n === 1) return `M${pts[0][0]},${pts[0][1]}`;
  const dx: number[] = [], dl: number[] = [], m: number[] = new Array(n);
  for (let i = 0; i < n - 1; i++) {
    dx[i] = pts[i + 1][0] - pts[i][0];
    dl[i] = (pts[i + 1][1] - pts[i][1]) / (dx[i] || 1);
  }
  m[0] = dl[0]; m[n - 1] = dl[n - 2];
  for (let i = 1; i < n - 1; i++) m[i] = dl[i - 1] * dl[i] <= 0 ? 0 : (dl[i - 1] + dl[i]) / 2;
  for (let i = 0; i < n - 1; i++) {
    if (dl[i] === 0) { m[i] = 0; m[i + 1] = 0; continue; }
    const a = m[i] / dl[i], b = m[i + 1] / dl[i], s = a * a + b * b;
    if (s > 9) { const t = 3 / Math.sqrt(s); m[i] = t * a * dl[i]; m[i + 1] = t * b * dl[i]; }
  }
  let d = `M${r2(pts[0][0])},${r2(pts[0][1])}`;
  for (let i = 0; i < n - 1; i++) {
    const h = dx[i] / 3;
    d += `C${r2(pts[i][0] + h)},${r2(pts[i][1] + m[i] * h)} ${r2(pts[i + 1][0] - h)},${r2(pts[i + 1][1] - m[i + 1] * h)} ${r2(pts[i + 1][0])},${r2(pts[i + 1][1])}`;
  }
  return d;
}

function useWidth<T extends HTMLElement>(fallback: number) {
  const ref = useRef<T>(null);
  const [w, setW] = useState(fallback);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setW(el.clientWidth || fallback);
    if (!window.ResizeObserver) return;
    const ro = new ResizeObserver(() => setW(el.clientWidth || fallback));
    ro.observe(el);
    return () => ro.disconnect();
  }, [fallback]);
  return [ref, w] as const;
}

export interface Delta { text: string; tone: 'pos' | 'neg' | 'neutral'; arrow: string }

/** Variação percentual contra o mês anterior; null quando não há base pra comparar. */
export function delta(atual: number, anterior: number): Delta | null {
  if (!(anterior > 0)) return null;
  const pct = ((atual - anterior) / anterior) * 100;
  if (Math.abs(pct) < 0.05) return { text: '0%', tone: 'neutral', arrow: '' };
  return { text: `${fmtDec(Math.abs(pct))}%`, tone: pct > 0 ? 'pos' : 'neg', arrow: pct > 0 ? '↑' : '↓' };
}

function DeltaTag({ d, sufixo }: { d: Delta | null; sufixo?: string }) {
  if (!d) return null;
  return (
    <span className={`ch-delta ch-delta--${d.tone}`}>
      {d.arrow && <span aria-hidden="true">{d.arrow} </span>}
      {d.text}
      {sufixo && <span className="ch-delta__ref"> {sufixo}</span>}
    </span>
  );
}

// ───────────────────────── card ─────────────────────────
export function ChartCard({ title, sub, children, className = '' }: { title?: string; sub?: string; children: ReactNode; className?: string }) {
  return (
    <section className={`ch-card ${className}`}>
      {title && (
        <div className="ch-head">
          <h3 className="ch-title">{title}</h3>
          {sub && <p className="ch-sub">{sub}</p>}
        </div>
      )}
      {children}
    </section>
  );
}

// ───────────────────────── faixa de KPIs ─────────────────────────
export interface Kpi { id: string; label: string; value: string; delta?: Delta | null; hint?: string }

export function KpiStrip({ items, selected, onSelect }: { items: Kpi[]; selected: string; onSelect: (id: string) => void }) {
  return (
    <div className="ch-kpis" role="tablist" aria-label="Indicadores do mês">
      {items.map((k) => {
        const on = k.id === selected;
        return (
          <button
            key={k.id}
            type="button"
            role="tab"
            aria-selected={on}
            className={`ch-kpi${on ? ' is-on' : ''}`}
            onClick={() => onSelect(k.id)}
          >
            <span className="ch-kpi__label">{k.label}</span>
            <span className="ch-kpi__value">{k.value}</span>
            <span className="ch-kpi__foot">
              <DeltaTag d={k.delta ?? null} />
              {k.hint && <span className="ch-kpi__hint">{k.hint}</span>}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ───────────────────────── linha ─────────────────────────
export interface LinePoint { x: string; y: number | null }

export function LineChart({
  title, sub, totalLabel, total, delta: d, deltaRef, cur, prev, format, formatX, tipTitle, names, emptyMessage,
}: {
  title: string; sub?: string; totalLabel: string; total: string; delta?: Delta | null; deltaRef?: string;
  cur: LinePoint[]; prev?: LinePoint[]; format: (v: number) => string; formatX: (x: string) => string;
  tipTitle: (x: string) => string; names: [string, string]; emptyMessage?: string;
}) {
  const [ref, W0] = useWidth<HTMLDivElement>(600);
  const [scrub, setScrub] = useState(-1);
  const W = Math.max(240, W0);
  const H = W < 480 ? 190 : 230;
  const L = 6, R = 52, T = 12, B = 28;
  const pw = W - L - R, ph = H - T - B;
  const n = cur.length;
  const vals = cur.map((p) => p.y);
  const pv = prev ? prev.map((p) => p.y) : null;
  const max = niceMax(Math.max(0, ...vals.filter((v): v is number => v != null), ...(pv ?? []).filter((v): v is number => v != null)));
  const X = (i: number) => L + (n <= 1 ? pw / 2 : (i * pw) / (n - 1));
  const Y = (v: number) => T + ph - (max > 0 ? (v / max) * ph : 0);

  const maxRot = Math.max(2, Math.min(7, Math.floor(pw / 76)));
  const passo = n > 1 ? Math.max(1, Math.ceil((n - 1) / (maxRot - 1))) : 1;
  const idxs: number[] = [];
  for (let i = 0; i < n; i += passo) idxs.push(i);
  if (n > 1 && idxs[idxs.length - 1] !== n - 1) {
    if (n - 1 - idxs[idxs.length - 1] < passo * 0.6) idxs[idxs.length - 1] = n - 1;
    else idxs.push(n - 1);
  }

  const cp: [number, number][] = [];
  vals.forEach((v, i) => { if (v != null) cp.push([X(i), Y(v)]); });
  const pp: [number, number][] = [];
  pv?.forEach((v, i) => { if (v != null && i < n) pp.push([X(i), Y(v)]); });
  const linha = cp.length > 1 ? caminhoSuave(cp) : '';

  function idxDe(clientX: number, el: SVGSVGElement) {
    const r = el.getBoundingClientRect();
    const i = n <= 1 ? 0 : Math.round(((clientX - r.left - L) / pw) * (n - 1));
    return Math.max(0, Math.min(n - 1, i));
  }

  const tipLeft = scrub >= 0 ? X(scrub) + 14 : 0;

  return (
    <div className="ch-chart">
      <div className="ch-head">
        <h3 className="ch-title">{title}</h3>
        {sub && <p className="ch-sub">{sub}</p>}
      </div>
      <div className="ch-stat">
        <span className="ch-stat__label">{totalLabel}</span>
        <span className="ch-big">{total}</span>
        <DeltaTag d={d ?? null} sufixo={deltaRef} />
      </div>
      {prev && !emptyMessage && (
        <div className="ch-legend" aria-hidden="true">
          <span><svg width="22" height="8"><line x1="1" x2="21" y1="4" y2="4" className="ch-key-cur" /></svg>{names[0]}</span>
          <span><svg width="22" height="8"><line x1="1" x2="21" y1="4" y2="4" className="ch-key-prev" /></svg>{names[1]}</span>
        </div>
      )}
      {emptyMessage ? (
        <div className="ch-empty">{emptyMessage}</div>
      ) : (
        <div
          className="ch-plot"
          ref={ref}
          tabIndex={0}
          role="group"
          aria-label={`${title}. ${totalLabel} ${total}. Use as setas para percorrer os dias.`}
          onKeyDown={(e) => {
            if (!n) return;
            let i = scrub;
            if (e.key === 'ArrowRight') i = i < 0 ? 0 : Math.min(n - 1, i + 1);
            else if (e.key === 'ArrowLeft') i = i < 0 ? n - 1 : Math.max(0, i - 1);
            else if (e.key === 'Escape') i = -1;
            else return;
            e.preventDefault();
            setScrub(i);
          }}
          onBlur={() => setScrub(-1)}
        >
          <svg
            className="ch-svg"
            viewBox={`0 0 ${W} ${H}`}
            width={W}
            height={H}
            onPointerMove={(e) => setScrub(idxDe(e.clientX, e.currentTarget))}
            onPointerDown={(e) => setScrub(idxDe(e.clientX, e.currentTarget))}
            onPointerLeave={() => setScrub(-1)}
          >
            {[0, 1, 2, 3, 4].map((k) => {
              const v = (max / 4) * k, y = Y(v);
              return (
                <g key={k}>
                  <line className={`ch-grid${k === 0 ? ' is-base' : ''}`} x1={L} x2={W - R} y1={r2(y)} y2={r2(y)} />
                  <text className="ch-axis" x={W - R + 8} y={r2(y + 4)}>{fmtMoneyShortOrInt(v, format)}</text>
                </g>
              );
            })}
            {idxs.map((ix, pos) => {
              const anc = pos === 0 && n > 1 ? 'start' : ix === n - 1 && n > 1 ? 'end' : 'middle';
              const xx = anc === 'start' ? X(ix) - 2 : anc === 'end' ? X(ix) + 2 : X(ix);
              return <text key={ix} className="ch-axis" textAnchor={anc} x={r2(xx)} y={H - 8}>{formatX(cur[ix].x)}</text>;
            })}
            {pp.length > 1 && <path className="ch-line-prev" d={caminhoSuave(pp)} />}
            {linha && (
              <>
                <path className="ch-line-area" d={`${linha}L${r2(cp[cp.length - 1][0])},${r2(Y(0))}L${r2(cp[0][0])},${r2(Y(0))}Z`} />
                <path className="ch-line-cur" d={linha} />
              </>
            )}
            {cp.length === 1 && <circle className="ch-line-dot" cx={r2(cp[0][0])} cy={r2(cp[0][1])} r={4} />}
            {scrub >= 0 && scrub < n && (
              <>
                <line className="ch-scrub" x1={r2(X(scrub))} x2={r2(X(scrub))} y1={T} y2={T + ph} />
                {pv && pv[scrub] != null && <circle className="ch-dot-prev" cx={r2(X(scrub))} cy={r2(Y(pv[scrub] as number))} r={3.5} />}
                {vals[scrub] != null && <circle className="ch-dot-cur" cx={r2(X(scrub))} cy={r2(Y(vals[scrub] as number))} r={4.5} />}
              </>
            )}
          </svg>
          {scrub >= 0 && scrub < n && (
            <div
              className="ch-tip"
              style={tipLeft + 190 > W ? { right: Math.max(4, W - X(scrub) + 14), top: T + 4 } : { left: tipLeft, top: T + 4 }}
              aria-hidden="true"
            >
              <div className="ch-tip__date">{tipTitle(cur[scrub].x)}</div>
              <div className="ch-tip__row">
                <svg width="14" height="6"><line x1="0" x2="14" y1="3" y2="3" className="ch-key-cur" /></svg>
                <span>{names[0]}</span>
                <b>{vals[scrub] == null ? 'sem dado' : format(vals[scrub] as number)}</b>
              </div>
              {prev && prev[scrub] && (
                <div className="ch-tip__row ch-tip__row--prev">
                  <svg width="14" height="6"><line x1="0" x2="14" y1="3" y2="3" className="ch-key-prev" /></svg>
                  <span>{names[1]}</span>
                  <b>{prev[scrub].y == null ? 'sem dado' : format(prev[scrub].y as number)}</b>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Eixo Y curto: dinheiro vira "R$1,2 mil", contagem fica inteira.
function fmtMoneyShortOrInt(v: number, format: (v: number) => string) {
  return format(1).startsWith('R$') ? fmtMoneyShort(v) : fmtInt(v);
}

// ───────────────────────── barras ─────────────────────────
export interface Bar { label: string; full: string; value: number }

export function BarChart({
  title, sub, statLabel, stat, unit, range, bars, avg, avgText, format,
}: {
  title: string; sub?: string; statLabel: string; stat: string; unit?: string; range?: string;
  bars: Bar[]; avg: number | null; avgText?: string; format: (v: number) => string;
}) {
  const [ref, W0] = useWidth<HTMLDivElement>(500);
  const [ativo, setAtivo] = useState(-1);
  const W = Math.max(240, W0);
  const H = W < 480 ? 200 : 240;
  const L = 6, R = 96, T = 12, B = 28;
  const pw = W - L - R, ph = H - T - B;
  const max = niceMax(Math.max(0, avg ?? 0, ...bars.map((b) => b.value)));
  const Y = (v: number) => T + ph - (max > 0 ? (v / max) * ph : 0);
  const slot = pw / (bars.length || 1);
  const bw = Math.min(44, slot * 0.58);
  const yMedia = avg != null ? Y(avg) : null;
  const rot = avgText ?? `Média ${format(avg ?? 0)}`;
  const tw = rot.length * 6.4 + 14;
  const b = ativo >= 0 ? bars[ativo] : null;

  return (
    <div className="ch-chart">
      <div className="ch-head">
        <h3 className="ch-title">{title}</h3>
        {sub && <p className="ch-sub">{sub}</p>}
      </div>
      <div className="ch-stat">
        <span className="ch-stat__label">{b ? b.full : statLabel}</span>
        <span className="ch-bigrow">
          <span className="ch-big">{b ? format(b.value) : stat}</span>
          {unit && <span className="ch-unit">{unit}</span>}
        </span>
        {range && <span className="ch-range">{range}</span>}
      </div>
      <div className="ch-plot" ref={ref}>
        <svg
          className={`ch-svg${ativo >= 0 ? ' has-active' : ''}`}
          viewBox={`0 0 ${W} ${H}`}
          width={W}
          height={H}
          onPointerLeave={() => setAtivo(-1)}
        >
          {[0, 1, 2, 3, 4].map((k) => {
            const v = (max / 4) * k, y = Y(v);
            return (
              <g key={k}>
                <line className={`ch-grid${k === 0 ? ' is-base' : ''}`} x1={L} x2={W - R} y1={r2(y)} y2={r2(y)} />
                <text className="ch-axis" x={W - R + 10} y={r2(y + 4)}>{fmtInt(v)}</text>
              </g>
            );
          })}
          {bars.map((bar, i) => {
            const cx = L + slot * i + slot / 2, x = cx - bw / 2;
            const yTop = Y(bar.value), alt = Math.max(0, Y(0) - yTop);
            const rr = Math.min(7, bw / 2, alt);
            const d = alt <= 0 ? '' :
              `M${r2(x)},${r2(Y(0))}V${r2(yTop + rr)}Q${r2(x)},${r2(yTop)} ${r2(x + rr)},${r2(yTop)}H${r2(x + bw - rr)}Q${r2(x + bw)},${r2(yTop)} ${r2(x + bw)},${r2(yTop + rr)}V${r2(Y(0))}Z`;
            return (
              <g key={bar.label}>
                <g
                  className={`ch-bar${ativo === i ? ' is-active' : ''}`}
                  tabIndex={0}
                  role="img"
                  aria-label={`${bar.full}: ${format(bar.value)}`}
                  onPointerEnter={() => setAtivo(i)}
                  onFocus={() => setAtivo(i)}
                  onBlur={() => setAtivo(-1)}
                >
                  <rect className="ch-bar__hit" x={r2(cx - slot / 2)} y={T} width={r2(slot)} height={ph} />
                  {d && <path className="ch-bar__shape" style={{ animationDelay: `${i * 45}ms`, transformOrigin: `${r2(cx)}px ${r2(Y(0))}px` }} d={d} />}
                </g>
                <text className="ch-axis" textAnchor="middle" x={r2(cx)} y={H - 8}>{bar.label}</text>
              </g>
            );
          })}
          {yMedia != null && (
            <>
              <line className="ch-avg" x1={L} x2={W - R + 34} y1={r2(yMedia)} y2={r2(yMedia)} />
              <g className="ch-avg-chip">
                <rect x={W - R + 36} y={r2(yMedia - 10)} width={r2(tw)} height={20} rx={10} />
                <text x={r2(W - R + 36 + tw / 2)} y={r2(yMedia + 4)} textAnchor="middle">{rot}</text>
              </g>
            </>
          )}
        </svg>
      </div>
    </div>
  );
}

// ───────────────────────── rosca ─────────────────────────
export interface Segment { id: string; label: string; value: number; color: string; sub?: string }

export function DonutChart({
  title, sub, segments, centerLabel, centerValue, centerSub, format, footnote, emptyMessage,
}: {
  title: string; sub?: string; segments: Segment[]; centerLabel: string; centerValue: string; centerSub?: string;
  format: (v: number) => string; footnote?: string; emptyMessage: string;
}) {
  const [ativo, setAtivo] = useState(-1);
  const TAM = 184, SW = 18, RAIO = (TAM - SW) / 2 - 2, CX = TAM / 2;
  const ss = segments.filter((s) => s.value > 0);
  const t = ss.reduce((a, s) => a + s.value, 0);
  const ponto = (ang: number) => [CX + RAIO * Math.cos(ang), CX + RAIO * Math.sin(ang)];
  const arco = (a0: number, a1: number) => {
    const p0 = ponto(a0), p1 = ponto(a1);
    return `M${r2(p0[0])},${r2(p0[1])}A${RAIO},${RAIO} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${r2(p1[0])},${r2(p1[1])}`;
  };
  const cap = SW / 2 / RAIO;
  const vao = ss.length > 1 ? 0.075 : 0;
  let a = -Math.PI / 2;
  const arcos = ss.map((s) => {
    const span = (s.value / t) * Math.PI * 2;
    let ini = a + (ss.length > 1 ? cap + vao / 2 : 0);
    let fim = a + span - (ss.length > 1 ? cap + vao / 2 : 0);
    if (ss.length === 1) { ini = a; fim = a + Math.PI * 2 - 0.0001; }
    if (fim - ini < 0.001) { const mid = a + span / 2; ini = mid - 0.0005; fim = mid + 0.0005; }
    a += span;
    return arco(ini, fim);
  });
  const sel = ativo >= 0 ? ss[ativo] : null;

  return (
    <div className="ch-chart">
      <div className="ch-head">
        <h3 className="ch-title">{title}</h3>
        {sub && <p className="ch-sub">{sub}</p>}
      </div>
      {ss.length === 0 ? (
        <div className="ch-empty">{emptyMessage}</div>
      ) : (
        <div className="ch-donut">
          <div className={`ch-donut__ring${ativo >= 0 ? ' has-active' : ''}`}>
            <svg viewBox={`0 0 ${TAM} ${TAM}`} width={TAM} height={TAM} role="img"
              aria-label={`${title}: ${ss.map((s) => `${s.label} ${format(s.value)}`).join(', ')}`}>
              <circle className="ch-donut__track" cx={CX} cy={CX} r={RAIO} strokeWidth={SW} />
              {ss.map((s, i) => (
                <path
                  key={s.id}
                  className={`ch-arc${ativo === i ? ' is-active' : ''}`}
                  pathLength={1}
                  style={{ stroke: s.color, animationDelay: `${i * 120}ms` }}
                  strokeWidth={SW}
                  strokeLinecap={ss.length === 1 ? 'butt' : 'round'}
                  d={arcos[i]}
                  tabIndex={0}
                  onPointerEnter={() => setAtivo(i)}
                  onPointerLeave={() => setAtivo(-1)}
                  onFocus={() => setAtivo(i)}
                  onBlur={() => setAtivo(-1)}
                />
              ))}
            </svg>
            <div className="ch-donut__center">
              {sel ? (
                <>
                  <span className="ch-donut__clabel">{sel.label}</span>
                  <span className="ch-donut__cvalue">{format(sel.value)}</span>
                  <span className="ch-donut__csub">{fmtDec((sel.value / t) * 100)}%</span>
                </>
              ) : (
                <>
                  <span className="ch-donut__clabel">{centerLabel}</span>
                  <span className="ch-donut__cvalue">{centerValue}</span>
                  {centerSub && <span className="ch-donut__csub">{centerSub}</span>}
                </>
              )}
            </div>
          </div>
          <ul className={`ch-donut__legend${ativo >= 0 ? ' has-active' : ''}`}>
            {ss.map((s, i) => (
              <li
                key={s.id}
                className={`ch-donut__row${ativo === i ? ' is-active' : ''}`}
                tabIndex={0}
                onPointerEnter={() => setAtivo(i)}
                onPointerLeave={() => setAtivo(-1)}
                onFocus={() => setAtivo(i)}
                onBlur={() => setAtivo(-1)}
              >
                <span className="ch-donut__dot" style={{ background: s.color }} />
                <span className="ch-donut__name">{s.label}{s.sub && <small>{s.sub}</small>}</span>
                <span className="ch-donut__val">{format(s.value)}</span>
                <span className="ch-donut__pct">{fmtDec((s.value / t) * 100)}%</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {footnote && ss.length > 0 && <p className="ch-foot">{footnote}</p>}
    </div>
  );
}

// ───────────────────────── lista ranqueada ─────────────────────────
export interface RankCol { text: string; sub?: string; muted?: boolean }
export interface RankItem {
  id: string; pos: string; title: string; sub?: string; highlight?: boolean;
  avatar?: { text: string; color: string | null }; bar: number; cols: RankCol[];
}

export function RankedList({ items, emptyText }: { items: RankItem[]; emptyText: string }) {
  if (!items.length) return <div className="ch-empty">{emptyText}</div>;
  return (
    <div className="ch-rank" role="list">
      {items.map((it) => (
        <div key={it.id} className={`ch-rank__row${it.highlight ? ' is-top' : ''}`} role="listitem">
          <span className="ch-rank__main">
            <span className="ch-rank__pos">{it.pos}</span>
            {it.avatar && (
              <span className="ch-rank__avatar" style={it.avatar.color ? { background: it.avatar.color } : undefined}>
                {it.avatar.text}
              </span>
            )}
            <span className="ch-rank__name">
              <span className="ch-rank__title">{it.title}</span>
              {it.sub && <small>{it.sub}</small>}
              <span className="ch-rank__track" aria-hidden="true">
                <span className="ch-rank__fill" style={{ width: `${Math.max(0, Math.min(100, it.bar * 100))}%` }} />
              </span>
            </span>
          </span>
          <span className="ch-rank__cols">
            {it.cols.map((c, i) => (
              <span key={i} className={`ch-rank__col${c.muted ? ' is-muted' : ''}`}>
                <b>{c.text}</b>
                {c.sub && <small>{c.sub}</small>}
              </span>
            ))}
          </span>
        </div>
      ))}
    </div>
  );
}
