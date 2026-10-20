import { K, F } from './theme';
import { label, MON, mean } from './data';
const P = { l: 52, r: 16, t: 26, b: 30 };
const nice = (mn, mx, n = 4) => { const raw = (mx - mn || 1) / n, p = Math.pow(10, Math.floor(Math.log10(raw))), f = raw / p, s = (f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10) * p; return { lo: Math.floor(mn / s) * s, hi: Math.ceil(mx / s) * s, s }; };
const mkS = (w, h, n, lo, hi) => ({ X: i => P.l + (i * (w - P.l - P.r)) / Math.max(1, n - 1), Y: v => h - P.b - ((v - lo) / (hi - lo)) * (h - P.b - P.t) });
const path = (a, X, Y, st = 0) => a.map((v, i) => (i < st ? '' : `${i === st ? 'M' : 'L'}${X(i).toFixed(1)} ${Y(v).toFixed(1)}`)).join('');
const hex = c => [1, 3, 5].map(i => parseInt(c.substr(i, 2), 16));
const mix = (a, b, t) => 'rgb(' + hex(a).map((x, k) => Math.round(x + (hex(b)[k] - x) * t)).join(',') + ')';
const Txt = ({ children, ...p }) => <text fontFamily={F} fontSize={11} fill={K.mu} {...p}>{children}</text>;
function Grid({ w, lo, hi, s, unit, Y }) {
  const td = s >= 1 ? 0 : s >= 0.1 ? 1 : 2, t = [];
  for (let v = lo; v <= hi + 1e-9; v += s) t.push(v);
  return <>{t.map(v => <g key={v}><line x1={P.l} x2={w - P.r} y1={Y(v)} y2={Y(v)} stroke={K.ln} /><Txt x={P.l - 8} y={Y(v) + 4} textAnchor="end">{v.toFixed(td)}</Txt></g>)}<Txt x={P.l} y={12} fontWeight={600}>{unit}</Txt></>;
}
const Svg = ({ w, h, n, cb, children }) => {
  const pick = e => { const r = e.currentTarget.getBoundingClientRect(), x = ((e.clientX - r.left) / r.width) * w; cb(Math.max(0, Math.min(n - 1, Math.round(((x - P.l) / (w - P.l - P.r)) * (n - 1))))); };
  return <svg viewBox={`0 0 ${w} ${h}`} width="100%" style={{ display: 'block', cursor: 'crosshair', touchAction: 'pan-y' }} onPointerMove={pick} onPointerDown={pick} onPointerLeave={e => e.pointerType === 'mouse' && cb(null)} role="img">{children}</svg>;
};
const Tip = ({ x, w, l1, l2 }) => <g><rect x={Math.min(x + 8, w - 166)} y={P.t - 6} width={156} height={42} rx={3} fill={K.deep} /><text x={Math.min(x + 16, w - 158)} y={P.t + 9} fontSize={10} fontFamily={F} fill={K.onDeep}>{l1}</text><text x={Math.min(x + 16, w - 158)} y={P.t + 28} fontSize={13} fontWeight={600} fontFamily={F} fill="#fff">{l2}</text></g>;

export function TimeSeries({ d, off, unit, dec, sel, setSel, st, others = [], zero }) {
  const w = 900, h = 320, ma = d.map((_, i) => (i < 11 ? 0 : mean(d.slice(i - 11, i + 1)))), all = [d, ...others.map(o => o.d)].flat();
  const { lo, hi, s } = nice(zero ? 0 : Math.min(...all), Math.max(...all)), { X, Y } = mkS(w, h, d.length, lo, hi);
  const i = sel == null ? null : Math.min(sel, d.length - 1), mi = d.indexOf(Math.max(...d)), dashes = ['3 3', '10 4 2 4'];
  return (<Svg w={w} h={h} n={d.length} cb={setSel}>
    <Grid {...{ w, lo, hi, s, unit, Y }} />
    {d.map((_, k) => ((off + k) % 24 === 0 ? <Txt key={k} x={X(k)} y={h - 9} textAnchor="middle">{2015 + (off + k) / 12}</Txt> : null))}
    <path d={`${path(d, X, Y)}L${X(d.length - 1)} ${Y(lo)}L${X(0)} ${Y(lo)}Z`} fill={K.sky} fillOpacity={0.1} />
    <path d={path(d, X, Y)} stroke="#8FA2C4" strokeWidth={1.2} fill="none" />
    {others.map((o, k) => <path key={k} d={path(o.d, X, Y, 11)} stroke={K.deep} strokeWidth={1.6} strokeDasharray={dashes[k]} fill="none" />)}
    <path d={path(ma, X, Y, 11)} stroke={K.ac} strokeWidth={2.8} strokeDasharray="8 4" fill="none" />
    <path d={`M${X(0)} ${Y(st.icpt)}L${X(d.length - 1)} ${Y(st.icpt + st.raw * (d.length - 1))}`} stroke={K.rd} strokeWidth={2.4} fill="none" />
    <circle cx={X(mi)} cy={Y(d[mi])} r={4} fill={K.rd} /><Txt x={Math.min(X(mi) + 8, w - 130)} y={Y(d[mi]) - 6} fill={K.deep} fontWeight={600}>{`pic · ${label(off + mi)}`}</Txt>
    {i != null && <g><line x1={X(i)} x2={X(i)} y1={P.t} y2={h - P.b} stroke={K.deep} /><circle cx={X(i)} cy={Y(d[i])} r={4.5} fill="#fff" stroke={K.deep} strokeWidth={2} /><Tip x={X(i)} w={w} l1={label(off + i)} l2={`${d[i].toFixed(dec)} ${unit}`} /></g>}
  </Svg>);
}

export function Climatology({ A, B, band, unit }) {
  const w = 560, h = 270, all = [band.map(b => b.lo), band.map(b => b.hi), A, B || A].flat(), { lo, hi, s } = nice(Math.min(...all), Math.max(...all)), { X, Y } = mkS(w, h, 12, lo, hi);
  const poly = band.map((b, i) => `${i ? 'L' : 'M'}${X(i)} ${Y(b.hi)}`).join('') + band.map((_, i) => `L${X(11 - i)} ${Y(band[11 - i].lo)}`).join('') + 'Z';
  return (<svg viewBox={`0 0 ${w} ${h}`} width="100%" style={{ display: 'block' }} role="img"><Grid {...{ w, lo, hi, s, unit, Y }} />
    {MON.map((m, i) => <Txt key={i} x={X(i)} y={h - 9} textAnchor="middle">{m.replace('.', '')}</Txt>)}
    <path d={poly} fill={K.sky} fillOpacity={0.18} />
    <path d={path(A, X, Y)} stroke={K.ac} strokeWidth={2.6} strokeDasharray={B ? '8 4' : undefined} fill="none" />
    {B && <path d={path(B, X, Y)} stroke={K.deep} strokeWidth={2.6} fill="none" />}
    {A.map((v, i) => <circle key={i} cx={X(i)} cy={Y(v)} r={3} fill={K.ac} />)}
  </svg>);
}

export function Anomalies({ an, off, unit, dec, sel, setSel, pos, neg, lp, ln }) {
  const w = 560, h = 270, m = nice(0, Math.max(...an.map(Math.abs)) * 1.05, 2).hi, { X, Y } = mkS(w, h, an.length, -m, m), bw = Math.max(1.5, (w - P.l - P.r) / an.length - 0.8), i = sel == null ? null : Math.min(sel, an.length - 1);
  return (<Svg w={w} h={h} n={an.length} cb={setSel}><Grid {...{ w, lo: -m, hi: m, s: m, unit, Y }} />
    {an.map((v, k) => <rect key={k} x={X(k) - bw / 2} y={v >= 0 ? Y(v) : Y(0)} width={bw} height={Math.abs(Y(v) - Y(0))} fill={v >= 0 ? pos : neg} opacity={i === k ? 1 : 0.9} />)}
    <line x1={P.l} x2={w - P.r} y1={Y(0)} y2={Y(0)} stroke={K.deep} />
    <Txt x={w - P.r} y={P.t - 2} fill={pos} fontWeight={600} textAnchor="end">{'▲ ' + lp}</Txt><Txt x={w - P.r} y={h - 9} fill={neg} fontWeight={600} textAnchor="end">{'▼ ' + ln}</Txt>
    {i != null && <Tip x={X(i)} w={w} l1={label(off + i)} l2={`${an[i] >= 0 ? '+' : ''}${an[i].toFixed(dec)} ${unit}`} />}
  </Svg>);
}

export function Stripes({ vals, pos, neg }) {
  const w = 900, h = 90, m = Math.max(...vals.map(Math.abs)) || 1, bw = w / vals.length;
  return (<svg viewBox={`0 0 ${w} ${h + 24}`} width="100%" style={{ display: 'block' }} role="img">
    {vals.map((v, i) => <rect key={i} x={i * bw} y={0} width={bw + 0.5} height={h} fill={mix('#F4F6FA', v >= 0 ? pos : neg, Math.min(1, Math.abs(v) / m))} />)}
    {vals.map((_, i) => <Txt key={i} x={i * bw + bw / 2} y={h + 17} textAnchor="middle">{2015 + i}</Txt>)}
  </svg>);
}
