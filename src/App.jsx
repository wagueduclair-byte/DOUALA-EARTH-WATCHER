import { useState, useMemo } from 'react';
import { K } from './theme';
import { IND, ZONES, series, stats, climo, mean, label } from './data';
import { TimeSeries, Climatology, Anomalies, Stripes } from './charts';
import MapEmbed from './MapEmbed';

const PATH = { ap: 'M4 11l8-7 8 7v9H4z', map: 'M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z', ind: 'M4 4v16h16M8 15l4-5 3 3 5-6', tr: 'M3 17l6-6 4 4 8-9M15 6h6v6', lim: 'M12 3a9 9 0 100 18 9 9 0 000-18zM12 11v6M12 7.5v.01', src: 'M5 4h11a3 3 0 013 3v13H8a3 3 0 01-3-3zM5 17a3 3 0 013-3h11' };
const Icon = ({ n }) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d={PATH[n]} /></svg>;
const Card = ({ children, flush, className = '' }) => <section className={`card ${flush ? 'flush' : ''} ${className}`}>{children}</section>;
const Eye = ({ children, style }) => <div className="eye" style={style}>{children}</div>;
const Chip = ({ on, onClick, children }) => <button className={`chip ${on ? 'on' : ''}`} onClick={onClick} aria-pressed={on}>{children}</button>;
const Note = ({ t, tone = K.rd, children }) => <div className="note" style={{ borderLeftColor: tone }}><Eye style={{ color: tone }}>{t}</Eye><p>{children}</p></div>;
const KV = ({ k, v }) => <div className="kv"><span>{k}</span><b>{v}</b></div>;
const Stat = ({ l, v, u }) => <div className="stat"><Eye>{l}</Eye><div className="num">{v}{u && <span className="unit"> {u}</span>}</div></div>;
const Sw = ({ c = K.ac, dash, w = 2, t }) => <span className="sw"><svg width="30" height="8"><line x1="0" x2="30" y1="4" y2="4" stroke={c} strokeWidth={w} strokeDasharray={dash} /></svg>{t}</span>;
const sgn = v => (v >= 0 ? '+' : '') + v;
const verdict = (p, dec) => (p < 0.05 ? (dec > 0 ? 'Hausse détectable' : 'Baisse détectable') : 'Aucune tendance détectable');
const PER = { all: [0, 132, '2015–2025'], a: [0, 60, '2015–2019'], b: [60, 132, '2020–2025'] };
const LEADS = ['Brian', 'Leroy Foko'], TEAM = ['Yann Raïs D.M', 'Foko Jorel', 'Nguela Tchigea Brayane Daryl', 'Kenmatsa Wague Josdrel Duclair'];

function Overview({ go }) {
  const rows = useMemo(() => Object.keys(IND).map(k => { const d = series(k, 'bona'); return { k, st: stats(d, 0), last: mean(d.slice(-12)) }; }), []);
  return (<>
    <div className="hero"><Eye style={{ color: K.sky }}>NASA SPACE APPS CHALLENGE 2026 · DOUALA, CAMEROUN</Eye><h1>Douala Earth Watchers</h1>
      <p className="lead">Explorer, à partir de données satellitaires ouvertes, l'évolution des précipitations, de la température de surface et de la végétation à Douala entre 2015 et 2025, en précisant ce que ces données permettent de conclure, ou non.</p></div>
    <Note t="MAQUETTE · DONNÉES DE DÉMONSTRATION">Les valeurs, courbes et couleurs de cartes sont fictives. Aucune conclusion ne doit en être tirée.</Note>
    <div className="cols3">{rows.map(r => { const I = IND[r.k]; return (
      <Card key={r.k}><Eye>{I.src.toUpperCase()}</Eye><h3>{I.n}</h3>
        <div className="num">{r.last.toFixed(I.dec)}<span className="unit"> {I.u} · moy. 12 derniers mois</span></div>
        <p className="sm">Tendance (Bonamoussadi) : <b>{sgn(r.st.dec.toFixed(I.dec === 0 ? 1 : 2))} {I.u} / décennie</b></p><p className="sm">{verdict(r.st.p, r.st.dec)}</p></Card>); })}</div>
    <Card flush><MapEmbed layer="pr" height={400} /></Card>
    <div className="cols2">
      <Card><Eye>QUESTION CENTRALE</Eye><p>Quelles évolutions les données satellitaires montrent-elles pour la zone d'étude, et quelles limites faut-il garder à l'esprit lorsqu'on les interprète ?</p></Card>
      <Card><Eye>DIRECTION DU PROJET</Eye>{LEADS.map(n => <KV key={n} k="Chef d'équipe" v={n} />)}<p className="sm">Équipe : {TEAM.join(' · ')}</p></Card></div>
    <button className="btn" onClick={() => go('ind')}>Explorer les indicateurs</button>
  </>);
}

function MapScreen() {
  const [ly, setLy] = useState('pr');
  return (<>
    <Eye>ZONE D'ÉTUDE</Eye><h2>Carte interactive</h2>
    <div className="row">{[['pr', 'Précipitations'], ['lst', 'Température'], ['ndvi', 'Végétation']].map(([k, l]) => <Chip key={k} on={ly === k} onClick={() => setLy(k)}>{l}</Chip>)}</div>
    <Card flush><MapEmbed key={ly} layer={ly} height={580} /></Card>
    <Note tone={K.ac} t="LIRE LA CARTE">Chaque carré est une cellule du produit satellite : environ 11 km pour la pluie (IMERG), 1 km pour la température et 250 m pour le NDVI. Bonamoussadi (contour rouge) tient dans un seul pixel de pluie : la valeur est une moyenne régionale, pas une mesure de quartier.</Note>
    <Note t="À FAIRE AVANT LA VERSION FINALE">Remplacer les valeurs fictives par les cellules réelles, appliquer un masque terre/eau (estuaire du Wouri) et délimiter précisément les zones. Vérifier les conditions d'usage des fonds de carte.</Note>
  </>);
}

function Indicators() {
  const [k, setK] = useState('pr'), [zone, setZone] = useState('bona'), [per, setPer] = useState('all'), [cmpP, setCmpP] = useState(false), [cmpZ, setCmpZ] = useState(false), [sel, setSel] = useState(null);
  const I = IND[k], [a, b, pl] = PER[per], full = useMemo(() => series(k, zone), [k, zone]), d = full.slice(a, b), st = useMemo(() => stats(d, a), [k, zone, per]);
  const others = cmpZ ? Object.keys(ZONES).filter(z => z !== zone).map(z => ({ d: series(k, z).slice(a, b), z })) : [];
  const band = useMemo(() => climo(full, 0), [k, zone]), cA = climo(full.slice(0, 60), 0).map(x => x.m), cB = climo(full.slice(60), 0).map(x => x.m);
  const f = I.dec === 0 ? 1 : 2, sig = st.p < 0.05, fa = useMemo(() => stats(full, 0).an, [k, zone]), yr = Array.from({ length: 11 }, (_, y) => mean(fa.slice(y * 12, y * 12 + 12)));
  const headline = sig ? `${I.n} ${st.dec > 0 ? 'en hausse' : 'en baisse'} à ${ZONES[zone]} : ${sgn(st.dec.toFixed(f))} ${I.u} par décennie` : `Aucune tendance détectable pour « ${I.n.toLowerCase()} » à ${ZONES[zone]}`;
  return (<>
    <Eye>INDICATEURS · DONNÉES DE DÉMONSTRATION</Eye><h2>{headline}</h2>
    <div className="row">{Object.keys(IND).map(x => <Chip key={x} on={k === x} onClick={() => { setK(x); setSel(null); }}>{IND[x].n}</Chip>)}</div>
    <div className="row">{Object.keys(ZONES).map(z => <Chip key={z} on={zone === z} onClick={() => { setZone(z); setSel(null); }}>{ZONES[z]}</Chip>)}</div>
    <div className="row">{Object.entries(PER).map(([x, v]) => <Chip key={x} on={per === x} onClick={() => { setPer(x); setSel(null); }}>{v[2]}</Chip>)}<Chip on={cmpZ} onClick={() => setCmpZ(!cmpZ)}>Comparer les zones</Chip><Chip on={cmpP} onClick={() => setCmpP(!cmpP)}>Comparer 2015–19 / 2020–25</Chip></div>
    <Card>
      <Eye>{I.n.toUpperCase()} · MENSUEL · {pl} · {ZONES[zone].toUpperCase()}</Eye>
      <TimeSeries d={d} off={a} unit={I.u} dec={I.dec} sel={sel} setSel={setSel} st={st} others={others} zero={k === 'pr'} />
      <div className="row legend"><Sw c="#8FA2C4" w={1} t="Valeur mensuelle" /><Sw dash="8 4" w={2.8} t="Moyenne glissante 12 mois" /><Sw c={K.rd} w={2.4} t="Tendance (Theil-Sen)" />{others.map((o, i) => <Sw key={o.z} c={K.deep} w={1.6} dash={['3 3', '10 4 2 4'][i]} t={ZONES[o.z]} />)}</div>
      <div className="meta"><KV k="Unité" v={I.u} /><KV k="Source" v={I.src + ' — données de démonstration'} /><KV k="Résolution" v={I.res} /><KV k="Fréquence" v="mensuelle" /></div>
    </Card>
    <div className="cols2">
      <Card><Eye>CYCLE SAISONNIER MOYEN</Eye><p className="sm">Bande : minimum–maximum observés par mois, 2015–2025</p><Climatology A={cmpP ? cA : band.map(x => x.m)} B={cmpP ? cB : null} band={band} unit={I.u} />
        <div className="row legend"><Sw dash={cmpP ? '8 4' : undefined} w={2.6} t={cmpP ? '2015–2019' : 'Moyenne 2015–2025'} />{cmpP && <Sw c={K.deep} w={2.6} t="2020–2025" />}</div></Card>
      <Card><Eye>ANOMALIES MENSUELLES</Eye><p className="sm">Écart à la moyenne du même mois : le cycle saisonnier est retiré</p><Anomalies an={st.an} off={a} unit={I.u} dec={I.dec} sel={sel} setSel={setSel} pos={I.pos} neg={I.neg} lp={I.lp} ln={I.ln} /></Card>
    </div>
    <Card><Eye>BANDES ANNUELLES D'ANOMALIE · UNE BANDE = UNE ANNÉE</Eye><p className="sm">Plus la bande est foncée, plus l'année s'écarte de la normale 2015–2025. Démonstration.</p><Stripes vals={yr} pos={I.pos} neg={I.neg} />
      <div className="row"><b style={{ color: I.neg }}>■ {I.ln}</b><b style={{ color: I.pos }}>■ {I.lp}</b></div></Card>
    <Card><Eye>RÉSULTATS STATISTIQUES · {pl}</Eye>
      <div className="stats"><Stat l="MOYENNE" v={mean(d).toFixed(I.dec)} u={I.u} /><Stat l="MAXIMUM" v={Math.max(...d).toFixed(I.dec)} u={label(a + d.indexOf(Math.max(...d)))} /><Stat l="TENDANCE / DÉCENNIE" v={sgn(st.dec.toFixed(f))} u={I.u} /><Stat l="IC 95 % (SEN)" v={`[${st.lo.toFixed(f)} ; ${st.hi.toFixed(f)}]`} /><Stat l="MANN-KENDALL" v={st.p < 0.001 ? '< 0,001' : st.p.toFixed(3)} u="p-value" /></div>
      <Note tone={sig ? K.ac : K.mu} t={verdict(st.p, st.dec).toUpperCase() + ' (DÉMO)'}>{sig ? 'Sur les anomalies mensuelles, une tendance monotone est statistiquement détectable au seuil de 5 %.' : "Sur les anomalies mensuelles, aucune tendance monotone n'est détectable au seuil de 5 %. Cela ne prouve pas l'absence de changement."} Ce résultat décrit la série ; il n'en identifie pas la cause. Limite propre à cet indicateur : {I.lim}</Note></Card>
  </>);
}

function Trends() {
  const R = useMemo(() => Object.keys(ZONES).flatMap(z => Object.keys(IND).map(k => ({ z, k, st: stats(series(k, z), 0) }))), []);
  return (<>
    <Eye>ANALYSE DES TENDANCES</Eye><h2>Comparaison zones × indicateurs</h2>
    <div className="cols3">{Object.keys(ZONES).map(z => <Card key={z}><h3>{ZONES[z]}</h3>{R.filter(r => r.z === z).map(r => { const I = IND[r.k], f = I.dec === 0 ? 1 : 2; return (
      <div key={r.k} className="kv"><span><b>{I.n}</b><br /><small>{verdict(r.st.p, r.st.dec)}</small></span><b className="r">{sgn(r.st.dec.toFixed(f))} {I.u}/déc.<br /><small>IC [{r.st.lo.toFixed(f)} ; {r.st.hi.toFixed(f)}] · p = {r.st.p < 0.001 ? '< 0,001' : r.st.p.toFixed(3)}</small></b></div>); })}</Card>)}</div>
    <Note t="PRUDENCE">Neuf tests à 5 % : quelques résultats « significatifs » peuvent apparaître par hasard. En outre, à la résolution IMERG, ces trois zones partagent presque le même pixel de pluie : une différence de pluie entre elles n'aurait pas de sens physique.</Note>
  </>);
}

const Limits = () => (<>
  <Eye>LECTURE PRUDENTE</Eye><h2>Limites et interprétation</h2>
  <div className="cols3">{Object.keys(IND).map(k => <Card key={k}><h3>{IND[k].n}</h3><Eye>{IND[k].src.toUpperCase()}</Eye><p>{IND[k].lim}</p></Card>)}</div>
  <Card><Eye>NIVEAU D'ATTENTION ENVIRONNEMENTAL</Eye><h3 style={{ color: K.mu }}>Non calculé</h3><p>Aucun niveau faible / modéré / élevé n'est affiché : il exigerait une méthode validée (pluie, drainage, relief, occupation du sol) hors périmètre de cette version.</p></Card>
  <Note t="CE QUE CES DONNÉES NE PERMETTENT PAS D'AFFIRMER">Qu'un quartier sera inondé. Que l'urbanisation est la cause d'une évolution observée. Que des valeurs satellitaires remplacent des mesures de terrain.</Note>
</>);

function Sources() {
  const St = ['Définir limites géographiques et période', 'Télécharger via les services autorisés, noter la source exacte', 'Contrôler valeurs manquantes, unités, cohérence temporelle', 'Agréger de façon documentée et reproductible', 'Anomalies mensuelles, pente de Theil-Sen, test de Mann-Kendall', 'Graphiques avec axes, unités, période et légendes', 'Relecture des interprétations et consignation des limites'];
  const L = [['Dépôt GitHub du projet', 'https://github.com/wagueduclair-byte/DOUALA-EARTH-WATCHER'], ['NASA Space Apps 2026', 'https://www.spaceappschallenge.org/2026/'], ['Conditions de participation', 'https://www.spaceappschallenge.org/legal/'], ['Charte graphique Space Apps', 'https://www.spaceappschallenge.org/brand/']];
  return (<>
    <Eye>TRANSPARENCE</Eye><h2>Sources et méthode</h2>
    <div className="cols3">{Object.keys(IND).map(k => <Card key={k}><h3>{IND[k].src}</h3><KV k="Variable" v={IND[k].n} /><KV k="Unité" v={IND[k].u} /><KV k="Résolution (à confirmer)" v={IND[k].res} /><KV k="Date d'accès" v="à renseigner" /></Card>)}</div>
    <div className="cols2">
      <Card><Eye>MÉTHODE</Eye><ol>{St.map((x, i) => <li key={i}>{x}</li>)}</ol></Card>
      <Card><Eye>RÉFÉRENCES</Eye>{L.map(r => <div className="kv" key={r[0]}><span>{r[0]}</span><a href={r[1]} target="_blank" rel="noreferrer">{r[1].replace('https://', '')}</a></div>)}<Eye style={{ marginTop: 18 }}>ÉQUIPE</Eye>{LEADS.map(n => <KV key={n} k="Chef d'équipe" v={n} />)}{TEAM.map(n => <KV key={n} k="Membre" v={n} />)}</Card></div>
  </>);
}

const TABS = [['ap', 'Aperçu'], ['map', 'Carte'], ['ind', 'Indicateurs'], ['tr', 'Tendances'], ['lim', 'Limites'], ['src', 'Sources']];
export default function App() {
  const [tab, setTab] = useState('ap');
  const go = t => { setTab(t); window.scrollTo(0, 0); };
  const body = { ap: <Overview go={go} />, map: <MapScreen />, ind: <Indicators />, tr: <Trends />, lim: <Limits />, src: <Sources /> }[tab];
  return (
    <div className="app">
      <nav className="side" aria-label="Navigation principale"><div className="brand">DOUALA<br />EARTH WATCHERS</div><small>NASA Space Apps 2026</small>
        {TABS.map(([k, l]) => <button key={k} className={`nav ${tab === k ? 'on' : ''}`} onClick={() => go(k)}><Icon n={k} />{l}</button>)}</nav>
      <div className="col"><div className="bar"><span>MAQUETTE · VALEURS FICTIVES</span><span>2015–2025</span></div><main>{body}</main></div>
    </div>
  );
}
