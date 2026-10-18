// DONNÉES DE DÉMONSTRATION (fictives) + statistiques réelles. Remplacer series() par les séries NASA réelles.
export const MON = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
export const label = i => `${MON[i % 12]} ${2015 + Math.floor(i / 12)}`;
export const ZONES = { bona: 'Bonamoussadi', akwa: 'Akwa / Bonanjo', yassa: 'Yassa / mangrove' };
export const IND = {
  pr: { n: 'Précipitations', u: 'mm/mois', dec: 0, src: 'NASA GPM IMERG', res: '≈ 0,1° (≈ 11 km) · mensuel', lim: 'Un quartier ne couvre qu\'un ou deux pixels. La pluie seule n\'explique pas une inondation : drainage, relief et occupation du sol interviennent.' },
  lst: { n: 'Température de surface', u: '°C', dec: 1, src: 'MODIS LST (MOD11)', res: '≈ 1 km · 8 jours, agrégé au mois', lim: 'Température de la surface vue par satellite, pas celle de l\'air ressentie. Les nuages créent des valeurs manquantes.' },
  ndvi: { n: 'Végétation (NDVI)', u: 'indice', dec: 2, src: 'MODIS NDVI (MOD13)', res: '250 m – 1 km · 16 jours, agrégé au mois', lim: 'Indicateur dérivé, sensible aux nuages, à la résolution et aux saisons.' },
};
const CL = { pr: [50, 70, 150, 200, 270, 360, 600, 700, 520, 400, 150, 50], lst: [34, 35, 34, 33, 32, 30, 28.5, 28, 29, 30.5, 32.5, 33.5], ndvi: [.46, .45, .47, .5, .54, .58, .62, .63, .6, .56, .5, .47] };
const ZP = { bona: { pr: [1, 0.12], lst: [0, 0.04], ndvi: [0, -0.004] }, akwa: { pr: [0.99, 0.12], lst: [1.3, 0.03], ndvi: [-0.16, -0.002] }, yassa: { pr: [1.02, 0.05], lst: [-1.4, 0.015], ndvi: [0.2, -0.001] } };
const rnd = i => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const seed = (k, z) => k.length * 101 + z.length * 37;
export const series = (k, z) => Array.from({ length: 132 }, (_, i) => { const m = i % 12, [a, t] = ZP[z][k], n = rnd(i + seed(k, z)); return k === 'pr' ? Math.max(5, CL.pr[m] * (0.72 + 0.56 * n) * a + t * i) : k === 'lst' ? CL.lst[m] + a + t * (i / 12) + (n - 0.5) * 1.5 : CL.ndvi[m] + a + t * (i / 12) + (n - 0.5) * 0.04; });
export const mean = a => a.reduce((s, x) => s + x, 0) / a.length;
export const median = a => { const b = [...a].sort((x, y) => x - y), m = b.length >> 1; return b.length % 2 ? b[m] : (b[m - 1] + b[m]) / 2; };
export const climo = (v, off) => Array.from({ length: 12 }, (_, m) => { const x = v.filter((_, i) => (i + off) % 12 === m); return { m: mean(x), lo: Math.min(...x), hi: Math.max(...x) }; });
export const anomalies = (v, off) => { const c = climo(v, off); return v.map((x, i) => x - c[(i + off) % 12].m); };
const erf = x => { const t = 1 / (1 + 0.3275911 * Math.abs(x)), p = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x); return x >= 0 ? p : -p; };
export function sen(y) { const s = [], n = y.length; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) s.push((y[j] - y[i]) / (j - i)); s.sort((a, b) => a - b); const N = s.length, C = 1.96 * Math.sqrt((n * (n - 1) * (2 * n + 5)) / 18); return { m: median(s), lo: s[Math.max(0, Math.floor((N - C) / 2))], hi: s[Math.min(N - 1, Math.ceil((N + C) / 2))] }; }
export function mk(y) { let S = 0; const n = y.length; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) S += Math.sign(y[j] - y[i]); const z = (S - Math.sign(S)) / Math.sqrt((n * (n - 1) * (2 * n + 5)) / 18); return 2 * (1 - 0.5 * (1 + erf(Math.abs(z) / Math.SQRT2))); }
export function stats(d, off) { const an = anomalies(d, off), s = sen(an), raw = sen(d).m; return { an, dec: s.m * 120, lo: s.lo * 120, hi: s.hi * 120, p: mk(an), raw, icpt: median(d.map((v, i) => v - raw * i)) }; }
