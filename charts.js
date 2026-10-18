import React from 'react';
import { View } from 'react-native';
import Svg, { Path, Rect, Line, Text as T, Circle } from 'react-native-svg';
import { K } from './theme';
import { label, MON, mean } from './data';
const P = { l: 50, r: 12, t: 22, b: 28 };
const mkScale = (w, h, n, mn, mx) => ({ X: i => P.l + (i * (w - P.l - P.r)) / Math.max(1, n - 1), Y: v => h - P.b - ((v - mn) / (mx - mn)) * (h - P.b - P.t) });
const rng = (arrs, pad = 0.08) => { const a = arrs.flat(), mn = Math.min(...a), mx = Math.max(...a), p = (mx - mn) * pad; return [mn - p, mx + p]; };
const Grid = ({ w, h, mn, mx, dec, unit, Y }) => <>{[0, 1, 2, 3, 4].map(k => { const v = mn + ((mx - mn) * k) / 4; return <React.Fragment key={k}><Line x1={P.l} x2={w - P.r} y1={Y(v)} y2={Y(v)} stroke={K.ln} strokeWidth={1} /><T x={P.l - 8} y={Y(v) + 3} fontSize={10} fill={K.mu} textAnchor="end">{v.toFixed(dec)}</T></React.Fragment>; })}<T x={P.l - 8} y={11} fontSize={10} fill={K.mu} textAnchor="end">{unit}</T></>;
const Hit = ({ w, h, n, cb, children }) => { const pick = e => cb(Math.max(0, Math.min(n - 1, Math.round(((e.nativeEvent.locationX - P.l) / (w - P.l - P.r)) * (n - 1))))); return <View onStartShouldSetResponder={() => true} onMoveShouldSetResponder={() => true} onResponderTerminationRequest={() => false} onResponderGrant={pick} onResponderMove={pick} style={{ width: w, height: h }}><View pointerEvents="none">{children}</View></View>; };
const path = (a, X, Y, st = 0) => a.map((v, i) => (i < st ? '' : `${i === st ? 'M' : 'L'}${X(i).toFixed(1)} ${Y(v).toFixed(1)}`)).join('');
const Tip = ({ x, w, l1, l2 }) => <><Rect x={Math.min(x + 8, w - 160)} y={P.t - 4} width={150} height={40} rx={4} fill={K.s2} stroke={K.ln} /><T x={Math.min(x + 16, w - 152)} y={P.t + 11} fontSize={10} fill={K.mu}>{l1}</T><T x={Math.min(x + 16, w - 152)} y={P.t + 28} fontSize={12} fontWeight="700" fill={K.tx}>{l2}</T></>;

export function TimeSeries({ w, d, off, unit, dec, sel, setSel, st, others = [] }) {
  const h = 290, ma = d.map((_, i) => (i < 11 ? null : mean(d.slice(i - 11, i + 1))));
  const [mn, mx] = rng([d, ...others.map(o => o.d)]), { X, Y } = mkScale(w, h, d.length, mn, mx), i = sel == null ? null : Math.min(sel, d.length - 1);
  const dashes = ['3 3', '10 4 2 4'];
  return (<Hit w={w} h={h} n={d.length} cb={setSel}><Svg width={w} height={h}>
    <Grid {...{ w, h, mn, mx, dec, unit, Y }} />
    {d.map((_, k) => ((off + k) % 12 === 0 && ((off + k) / 12) % 2 === 0 ? <T key={k} x={X(k)} y={h - 8} fontSize={10} fill={K.mu} textAnchor="middle">{2015 + (off + k) / 12}</T> : null))}
    <Path d={`${path(d, X, Y)}L${X(d.length - 1)} ${Y(mn)}L${X(0)} ${Y(mn)}Z`} fill={K.ac} fillOpacity={0.07} />
    <Path d={path(d, X, Y)} stroke={K.mu} strokeWidth={1} fill="none" />
    {others.map((o, k) => <Path key={k} d={path(o.d, X, Y, 11)} stroke={K.tx} strokeWidth={1.6} strokeDasharray={dashes[k]} fill="none" />)}
    <Path d={path(ma.map(v => v ?? 0), X, Y, 11)} stroke={K.ac} strokeWidth={2.6} strokeDasharray="7 4" fill="none" />
    <Path d={`M${X(0)} ${Y(st.icpt)}L${X(d.length - 1)} ${Y(st.icpt + st.raw * (d.length - 1))}`} stroke={K.am} strokeWidth={2} fill="none" />
    {i != null && <><Line x1={X(i)} x2={X(i)} y1={P.t} y2={h - P.b} stroke={K.tx} /><Circle cx={X(i)} cy={Y(d[i])} r={4} fill={K.bg} stroke={K.tx} strokeWidth={2} /><Tip x={X(i)} w={w} l1={label(off + i)} l2={`${d[i].toFixed(dec)} ${unit}`} /></>}
  </Svg></Hit>);
}

export function Climatology({ w, A, B, ca, cb, dec, unit, band, nameA, nameB }) {
  const h = 250, [mn, mx] = rng([band.map(b => b.lo), band.map(b => b.hi), A, B || A]), { X, Y } = mkScale(w, h, 12, mn, mx);
  const poly = band.map((b, i) => `${i ? 'L' : 'M'}${X(i)} ${Y(b.hi)}`).join('') + band.map((b, i) => `L${X(11 - i)} ${Y(band[11 - i].lo)}`).join('') + 'Z';
  return (<Svg width={w} height={h}><Grid {...{ w, h, mn, mx, dec, unit, Y }} />
    {MON.map((m, i) => <T key={i} x={X(i)} y={h - 8} fontSize={10} fill={K.mu} textAnchor="middle">{m.replace('.', '')}</T>)}
    <Path d={poly} fill={K.ac} fillOpacity={0.12} />
    <Path d={path(A, X, Y)} stroke={K.ac} strokeWidth={2.4} strokeDasharray={B ? '7 4' : undefined} fill="none" />
    {B && <Path d={path(B, X, Y)} stroke={K.tx} strokeWidth={2.4} fill="none" />}
    {A.map((v, i) => <Circle key={i} cx={X(i)} cy={Y(v)} r={2.6} fill={K.ac} />)}
  </Svg>);
}

export function Anomalies({ w, an, off, unit, dec, sel, setSel }) {
  const h = 190, m = Math.max(...an.map(Math.abs)) * 1.1, { X, Y } = mkScale(w, h, an.length, -m, m), bw = Math.max(1.5, (w - P.l - P.r) / an.length - 0.8), i = sel == null ? null : Math.min(sel, an.length - 1);
  return (<Hit w={w} h={h} n={an.length} cb={setSel}><Svg width={w} height={h}><Grid {...{ w, h, mn: -m, mx: m, dec, unit, Y }} />
    {an.map((v, k) => <Rect key={k} x={X(k) - bw / 2} y={v >= 0 ? Y(v) : Y(0)} width={bw} height={Math.abs(Y(v) - Y(0))} fill={v >= 0 ? K.rd : K.ac} opacity={i === k ? 1 : 0.85} />)}
    <Line x1={P.l} x2={w - P.r} y1={Y(0)} y2={Y(0)} stroke={K.mu} /><T x={w - P.r} y={Y(m) + 12} fontSize={10} fill={K.mu} textAnchor="end">▲ au-dessus de la normale</T><T x={w - P.r} y={h - 10} fontSize={10} fill={K.mu} textAnchor="end">▼ en dessous</T>
    {i != null && <Tip x={X(i)} w={w} l1={label(off + i)} l2={`${an[i] >= 0 ? '+' : ''}${an[i].toFixed(dec)} ${unit}`} />}
  </Svg></Hit>);
}
