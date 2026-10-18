// DOUALA EARTH WATCHERS — maquette complète (Expo / React Native, web + mobile). VALEURS FICTIVES.
import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Pressable, useWindowDimensions, SafeAreaView, StatusBar, Linking } from 'react-native';
import Svg, { Path, Line } from 'react-native-svg';
import { K, F } from './theme';
import { IND, ZONES, series, stats, climo, mean, label } from './data';
import { TimeSeries, Climatology, Anomalies } from './charts';
import MapEmbed from './MapEmbed';

const NUM = { fontVariant: ['tabular-nums'] };
const PATH = { ap: 'M4 11l8-7 8 7v9H4z', map: 'M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z', ind: 'M4 4v16h16M8 15l4-5 3 3 5-6', tr: 'M3 17l6-6 4 4 8-9M15 6h6v6', lim: 'M12 3a9 9 0 100 18 9 9 0 000-18zM12 11v6M12 7.5v.01', src: 'M5 4h11a3 3 0 013 3v13H8a3 3 0 01-3-3zM5 17a3 3 0 013-3h11' };
const Icon = ({ n, c }) => <Svg width={20} height={20} viewBox="0 0 24 24"><Path d={PATH[n]} stroke={c} strokeWidth={1.6} fill="none" strokeLinecap="round" strokeLinejoin="round" /></Svg>;
const Eye = ({ children, c }) => <Text style={[s.eye, c && { color: c }]}>{children}</Text>;
const Card = ({ children, style }) => <View style={[s.card, style]}>{children}</View>;
const Chip = ({ on, off, children, onPress }) => <Pressable disabled={off} onPress={onPress} style={[s.chip, on && s.chipOn, off && { opacity: 0.4 }]}><Text style={[s.chipT, on && { color: '#fff' }]}>{children}</Text></Pressable>;
const Note = ({ tone = K.am, t, children }) => <View style={[s.note, { borderLeftColor: tone }]}><Eye c={tone}>{t}</Eye><Text style={s.p}>{children}</Text></View>;
const KV = ({ k, v }) => <View style={s.kv}><Text style={s.kvk}>{k}</Text><Text style={s.kvv}>{v}</Text></View>;
const Stat = ({ l, v, u, w = 130 }) => <View style={{ minWidth: w, marginRight: 18, marginBottom: 10 }}><Eye>{l}</Eye><Text style={[s.num, NUM]}>{v}<Text style={s.unit}> {u}</Text></Text></View>;
const Sw = ({ c = K.ac, dash, w = 2, t }) => <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16 }}><Svg width={30} height={8}><Line x1={0} x2={30} y1={4} y2={4} stroke={c} strokeWidth={w} strokeDasharray={dash} /></Svg><Text style={[s.sm, { marginLeft: 6 }]}>{t}</Text></View>;
const sgn = v => (v >= 0 ? '+' : '') + v;
const verdict = (p, dec) => (p < 0.05 ? (dec > 0 ? 'Hausse détectable' : 'Baisse détectable') : 'Aucune tendance détectable');
const PER = { all: [0, 132, '2015–2025'], a: [0, 60, '2015–2019'], b: [60, 132, '2020–2025'] };
const LEADS = ['Brian', 'Leroy Foko'], TEAM = ['Yann Raïs D.M', 'Foko Jorel', 'Nguela Tchigea Brayane Daryl', 'Kenmatsa Wague Josdrel Duclair'];

function Overview({ go, wide, W }) {
  const rows = useMemo(() => Object.keys(IND).map(k => { const d = series(k, 'bona'); return { k, st: stats(d, 0), last: mean(d.slice(-12)) }; }), []);
  return (<>
    <Eye>NASA SPACE APPS CHALLENGE 2026 · DOUALA, CAMEROUN</Eye>
    <Text style={s.h1}>Douala Earth Watchers</Text>
    <Text style={[s.lead, { maxWidth: 740 }]}>Explorer, à partir de données satellitaires ouvertes, l'évolution des précipitations, de la température de surface et de la végétation à Douala entre 2015 et 2025, en précisant ce que ces données permettent de conclure, ou non.</Text>
    <Note t="MAQUETTE · DONNÉES DE DÉMONSTRATION">Les valeurs, courbes et couleurs de cartes sont fictives. Aucune conclusion ne doit en être tirée.</Note>
    <View style={{ flexDirection: wide ? 'row' : 'column', gap: 14 }}>{rows.map(r => { const I = IND[r.k]; return (
      <Card key={r.k} style={{ flex: 1 }}><Eye>{I.src.toUpperCase()}</Eye><Text style={s.h3}>{I.n}</Text>
        <Text style={[s.num, NUM]}>{r.last.toFixed(I.dec)}<Text style={s.unit}> {I.u} · moy. 12 derniers mois</Text></Text>
        <Text style={[s.sm, { marginTop: 6 }]}>Tendance (Bonamoussadi) : <Text style={{ color: K.tx, fontWeight: '700' }}>{sgn(r.st.dec.toFixed(I.dec === 0 ? 1 : 2))} {I.u} / décennie</Text></Text>
        <Text style={s.sm}>{verdict(r.st.p, r.st.dec)}</Text></Card>); })}</View>
    <Card style={{ padding: 0, overflow: 'hidden' }}><MapEmbed layer="pr" height={wide ? 380 : 300} /></Card>
    <View style={{ flexDirection: wide ? 'row' : 'column', gap: 14 }}>
      <Card style={{ flex: 1 }}><Eye>QUESTION CENTRALE</Eye><Text style={s.p}>Quelles évolutions les données satellitaires montrent-elles pour la zone d'étude, et quelles limites faut-il garder à l'esprit lorsqu'on les interprète ?</Text></Card>
      <Card style={{ flex: 1 }}><Eye>DIRECTION DU PROJET</Eye>{LEADS.map(n => <KV key={n} k="Chef d'équipe" v={n} />)}<Text style={[s.sm, { marginTop: 8 }]}>Équipe : {TEAM.join(' · ')}</Text></Card></View>
    <Pressable style={s.btn} onPress={() => go('ind')}><Text style={s.btnT}>Explorer les indicateurs</Text></Pressable>
  </>);
}

function MapScreen({ wide }) {
  const [ly, setLy] = useState('pr');
  return (<>
    <Eye>F2 · ZONE D'ÉTUDE</Eye><Text style={s.h2}>Carte interactive</Text>
    <View style={s.rowW}>{[['pr', 'Précipitations'], ['lst', 'Température'], ['ndvi', 'Végétation']].map(([k, l]) => <Chip key={k} on={ly === k} onPress={() => setLy(k)}>{l}</Chip>)}</View>
    <Card style={{ padding: 0, overflow: 'hidden' }}><MapEmbed key={ly} layer={ly} height={wide ? 560 : 440} /></Card>
    <Note tone={K.ac} t="LIRE LA CARTE">Chaque carré est une cellule du produit satellite : environ 11 km pour la pluie (IMERG), 1 km pour la température et 250 m pour le NDVI. Bonamoussadi (contour rouge) tient dans un seul pixel de pluie : la valeur est une moyenne régionale, pas une mesure de quartier.</Note>
    <Note t="À FAIRE AVANT LA VERSION FINALE">Remplacer les valeurs fictives par les cellules réelles, appliquer un masque terre/eau (estuaire du Wouri) et délimiter précisément les zones. Vérifier les conditions d'usage du fond de carte OpenStreetMap.</Note>
  </>);
}

function Indicators({ W }) {
  const [k, setK] = useState('pr'), [zone, setZone] = useState('bona'), [per, setPer] = useState('all'), [cmpP, setCmpP] = useState(false), [cmpZ, setCmpZ] = useState(false), [sel, setSel] = useState(null);
  const I = IND[k], [a, b, pl] = PER[per], full = useMemo(() => series(k, zone), [k, zone]), d = full.slice(a, b), st = useMemo(() => stats(d, a), [k, zone, per]);
  const others = cmpZ ? Object.keys(ZONES).filter(z => z !== zone).map(z => ({ d: series(k, z).slice(a, b), z })) : [];
  const band = useMemo(() => climo(full, 0), [k, zone]), cA = climo(full.slice(0, 60), 0).map(x => x.m), cB = climo(full.slice(60), 0).map(x => x.m);
  const cw = Math.min(W, 1000) - 34, sig = st.p < 0.05, f = I.dec === 0 ? 1 : 2;
  return (<>
    <Eye>F3 · F4 · INDICATEURS</Eye><Text style={s.h2}>{I.n}</Text>
    <View style={s.rowW}>{Object.keys(IND).map(x => <Chip key={x} on={k === x} onPress={() => { setK(x); setSel(null); }}>{IND[x].n}</Chip>)}</View>
    <View style={s.rowW}>{Object.keys(ZONES).map(z => <Chip key={z} on={zone === z} onPress={() => { setZone(z); setSel(null); }}>{ZONES[z]}</Chip>)}</View>
    <View style={s.rowW}>{Object.entries(PER).map(([x, v]) => <Chip key={x} on={per === x} onPress={() => { setPer(x); setSel(null); }}>{v[2]}</Chip>)}<Chip on={cmpZ} onPress={() => setCmpZ(!cmpZ)}>Comparer les zones</Chip><Chip on={cmpP} onPress={() => setCmpP(!cmpP)}>Comparer 2015–19 / 2020–25</Chip></View>
    <Card>
      <Eye>{I.n.toUpperCase()} · MENSUEL · {pl} · {ZONES[zone].toUpperCase()}</Eye><View style={{ height: 6 }} />
      <TimeSeries w={cw} d={d} off={a} unit={I.u} dec={I.dec} sel={sel} setSel={setSel} st={st} others={others} />
      <View style={[s.rowW, { marginTop: 8 }]}><Sw c={K.mu} w={1} t="Valeur mensuelle" /><Sw dash="7 4" w={2.6} t="Moyenne glissante 12 mois" /><Sw c={K.am} t="Tendance (Theil-Sen)" />{others.map((o, i) => <Sw key={o.z} c={K.tx} w={1.6} dash={['3 3', '10 4 2 4'][i]} t={ZONES[o.z]} />)}</View>
      <View style={{ marginTop: 10 }}><KV k="Unité" v={I.u} /><KV k="Source" v={I.src + ' — données de démonstration'} /><KV k="Résolution" v={I.res} /><KV k="Fréquence" v="mensuelle" /></View>
    </Card>
    <View style={{ flexDirection: cw > 760 ? 'row' : 'column', gap: 14 }}>
      <Card style={{ flex: 1 }}><Eye>CYCLE SAISONNIER MOYEN</Eye><Text style={[s.sm, { marginBottom: 6 }]}>Bande : minimum–maximum observés par mois, 2015–2025</Text><Climatology w={cw > 760 ? cw / 2 - 26 : cw} A={cmpP ? cA : band.map(x => x.m)} B={cmpP ? cB : null} band={band} dec={I.dec} unit={I.u} />
        <View style={s.rowW}><Sw dash={cmpP ? '7 4' : undefined} w={2.4} t={cmpP ? '2015–2019' : 'Moyenne 2015–2025'} />{cmpP && <Sw c={K.tx} w={2.4} t="2020–2025" />}</View></Card>
      <Card style={{ flex: 1 }}><Eye>ANOMALIES MENSUELLES</Eye><Text style={[s.sm, { marginBottom: 6 }]}>Écart à la moyenne du même mois : le cycle saisonnier est retiré</Text><Anomalies w={cw > 760 ? cw / 2 - 26 : cw} an={st.an} off={a} unit={I.u} dec={I.dec} sel={sel} setSel={setSel} /></Card>
    </View>
    <Card><Eye>RÉSULTATS STATISTIQUES · {pl}</Eye><View style={[s.rowW, { marginTop: 6 }]}>
      <Stat l="MOYENNE" v={mean(d).toFixed(I.dec)} u={I.u} /><Stat l="MAXIMUM" v={Math.max(...d).toFixed(I.dec)} u={label(a + d.indexOf(Math.max(...d)))} w={170} /><Stat l="TENDANCE / DÉCENNIE" v={sgn(st.dec.toFixed(f))} u={I.u} w={170} /><Stat l="IC 95 % (SEN)" v={`[${st.lo.toFixed(f)} ; ${st.hi.toFixed(f)}]`} u="" w={190} /><Stat l="MANN-KENDALL" v={st.p < 0.001 ? '< 0,001' : st.p.toFixed(3)} u="p-value" /></View>
      <Note tone={sig ? K.ac : K.mu} t={verdict(st.p, st.dec).toUpperCase() + ' (DÉMO)'}>{sig ? 'Sur les anomalies mensuelles, une tendance monotone est statistiquement détectable au seuil de 5 %.' : 'Sur les anomalies mensuelles, aucune tendance monotone n\'est détectable au seuil de 5 %. Cela ne prouve pas l\'absence de changement.'} Ce résultat décrit la série ; il n'en identifie pas la cause. Limite propre à cet indicateur : {I.lim}</Note></Card>
  </>);
}

function Trends() {
  const R = useMemo(() => Object.keys(ZONES).flatMap(z => Object.keys(IND).map(k => ({ z, k, st: stats(series(k, z), 0) }))), []);
  return (<>
    <Eye>ANALYSE DES TENDANCES</Eye><Text style={s.h2}>Comparaison zones × indicateurs</Text>
    {Object.keys(ZONES).map(z => <Card key={z}><Text style={s.h3}>{ZONES[z]}</Text>{R.filter(r => r.z === z).map(r => { const I = IND[r.k], f = I.dec === 0 ? 1 : 2, sig = r.st.p < 0.05; return (
      <View key={r.k} style={s.kv}><View style={{ flex: 1.2 }}><Text style={s.kvv2}>{I.n}</Text><Text style={s.sm}>{verdict(r.st.p, r.st.dec)}</Text></View><Text style={[s.kvv, NUM, { flex: 1.3 }]}>{sgn(r.st.dec.toFixed(f))} {I.u}/déc.{'\n'}<Text style={s.sm}>IC [{r.st.lo.toFixed(f)} ; {r.st.hi.toFixed(f)}] · p = {r.st.p < 0.001 ? '< 0,001' : r.st.p.toFixed(3)}</Text></Text></View>); })}</Card>)}
    <Note t="PRUDENCE">Neuf tests à 5 % : quelques résultats « significatifs » peuvent apparaître par hasard. En outre, à la résolution IMERG, ces trois zones partagent presque le même pixel de pluie : une différence de pluie entre elles n'aurait pas de sens physique.</Note>
  </>);
}

function Limits() {
  return (<>
    <Eye>F5 · LECTURE PRUDENTE</Eye><Text style={s.h2}>Limites et interprétation</Text>
    {Object.keys(IND).map(k => <Card key={k}><Text style={s.h3}>{IND[k].n} · {IND[k].src}</Text><Text style={s.p}>{IND[k].lim}</Text></Card>)}
    <Card><Eye>NIVEAU D'ATTENTION ENVIRONNEMENTAL</Eye><Text style={[s.h3, { color: K.mu }]}>Non calculé</Text><Text style={s.p}>Aucun niveau faible / modéré / élevé n'est affiché : il exigerait une méthode validée (pluie, drainage, relief, occupation du sol) hors périmètre de cette version.</Text></Card>
    <Note tone={K.rd} t="CE QUE CES DONNÉES NE PERMETTENT PAS D'AFFIRMER">Qu'un quartier sera inondé. Que l'urbanisation est la cause d'une évolution observée. Que des valeurs satellitaires remplacent des mesures de terrain.</Note>
  </>);
}

function Sources() {
  const St = ['Définir limites géographiques et période', 'Télécharger via les services autorisés, noter la source exacte', 'Contrôler valeurs manquantes, unités, cohérence temporelle', 'Agréger de façon documentée et reproductible', 'Anomalies mensuelles, pente de Theil-Sen, test de Mann-Kendall', 'Graphiques avec axes, unités, période et légendes', 'Relecture des interprétations et consignation des limites'];
  return (<>
    <Eye>F6 · TRANSPARENCE</Eye><Text style={s.h2}>Sources et méthode</Text>
    {Object.keys(IND).map(k => <Card key={k}><Text style={s.h3}>{IND[k].src}</Text><KV k="Variable" v={IND[k].n} /><KV k="Unité" v={IND[k].u} /><KV k="Résolution (à confirmer dans la documentation)" v={IND[k].res} /><KV k="Date d'accès" v="à renseigner" /></Card>)}
    <Card><Eye>MÉTHODE</Eye>{St.map((x, i) => <View key={i} style={s.kv}><Text style={[s.kvk, NUM, { flex: 0, width: 24 }]}>{i + 1}</Text><Text style={[s.p, { flex: 1, marginTop: 0 }]}>{x}</Text></View>)}</Card>
    <Card><Eye>RÉFÉRENCES</Eye>{[['Dépôt GitHub du projet', 'à renseigner'], ['NASA Space Apps 2026', 'https://www.spaceappschallenge.org/2026/'], ['Conditions de participation', 'https://www.spaceappschallenge.org/legal/']].map(r => <Pressable key={r[0]} disabled={!r[1].startsWith('http')} onPress={() => Linking.openURL(r[1])}><KV k={r[0]} v={r[1]} /></Pressable>)}</Card>
    <Card><Eye>ÉQUIPE</Eye>{LEADS.map(n => <KV key={n} k="Chef d'équipe" v={n} />)}{TEAM.map(n => <KV key={n} k="Membre" v={n} />)}</Card>
  </>);
}

const TABS = [['ap', 'Aperçu'], ['map', 'Carte'], ['ind', 'Indicateurs'], ['tr', 'Tendances'], ['lim', 'Limites'], ['src', 'Sources']];
export default function App() {
  const { width } = useWindowDimensions(), wide = width >= 900, [tab, setTab] = useState('ap'), W = wide ? Math.min(width - 232 - 56, 1000) : width - 32;
  const body = { ap: <Overview go={setTab} wide={wide} W={W} />, map: <MapScreen wide={wide} />, ind: <Indicators W={W} />, tr: <Trends />, lim: <Limits />, src: <Sources /> }[tab];
  const Nav = ({ t: [k, l], row }) => <Pressable onPress={() => setTab(k)} style={row ? s.sideI(tab === k) : s.tabI}><Icon n={k} c={tab === k ? '#fff' : K.mu} /><Text style={[s.navT, tab === k && { color: '#fff' }, !row && { fontSize: 10 }]}>{l}</Text></Pressable>;
  return (
    <SafeAreaView style={s.root}><StatusBar barStyle="light-content" />
      <View style={{ flex: 1, flexDirection: wide ? 'row' : 'column' }}>
        {wide && <View style={s.side}><Text style={s.brand}>DOUALA{'\n'}EARTH WATCHERS</Text><Text style={[s.sm, { marginBottom: 22 }]}>NASA Space Apps 2026</Text>{TABS.map(t => <Nav key={t[0]} t={t} row />)}</View>}
        <View style={{ flex: 1 }}>
          <View style={s.bar}><Text style={s.sm}>MAQUETTE · valeurs fictives</Text><Text style={s.sm}>2015–2025</Text></View>
          <ScrollView contentContainerStyle={{ padding: wide ? 28 : 16, paddingBottom: 110 }}><View style={{ width: W, gap: 14 }}>{body}</View></ScrollView>
        </View>
      </View>
      {!wide && <View style={s.tabs}>{TABS.map(t => <Nav key={t[0]} t={t} />)}</View>}
    </SafeAreaView>);
}

const s = {
  root: { flex: 1, backgroundColor: K.bg },
  side: { width: 232, borderRightWidth: 1, borderRightColor: K.ln, padding: 22, backgroundColor: K.s1 },
  sideI: on => ({ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 6, backgroundColor: on ? K.nb : 'transparent', marginBottom: 2 }),
  tabs: { position: 'absolute', left: 0, right: 0, bottom: 0, flexDirection: 'row', backgroundColor: K.s1, borderTopWidth: 1, borderTopColor: K.ln, paddingBottom: 18, paddingTop: 8 },
  tabI: { flex: 1, alignItems: 'center', gap: 3 }, navT: { color: K.mu, fontFamily: F, fontSize: 13.5, fontWeight: '600' },
  bar: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: K.ln, backgroundColor: K.s1 },
  brand: { color: K.tx, fontFamily: F, fontSize: 15, fontWeight: '800', letterSpacing: 2, lineHeight: 20, marginBottom: 6 },
  card: { backgroundColor: K.s1, borderColor: K.ln, borderWidth: 1, borderRadius: 8, padding: 17 },
  eye: { color: K.mu, fontFamily: F, fontSize: 10.5, fontWeight: '700', letterSpacing: 1.5 },
  h1: { color: K.tx, fontFamily: F, fontSize: 36, fontWeight: '700', letterSpacing: -0.8 }, h2: { color: K.tx, fontFamily: F, fontSize: 24, fontWeight: '700', letterSpacing: -0.4 }, h3: { color: K.tx, fontFamily: F, fontSize: 16, fontWeight: '700', marginTop: 4, marginBottom: 4 },
  lead: { color: '#C3CCD9', fontFamily: F, fontSize: 16, lineHeight: 24 }, p: { color: '#B4BFCE', fontFamily: F, fontSize: 14, lineHeight: 21, marginTop: 4 }, sm: { color: K.mu, fontFamily: F, fontSize: 12, lineHeight: 17 },
  num: { color: K.tx, fontFamily: F, fontSize: 26, fontWeight: '700', letterSpacing: -0.5, marginTop: 4 }, unit: { fontSize: 12, color: K.mu, fontWeight: '500', letterSpacing: 0 },
  note: { backgroundColor: K.s1, borderWidth: 1, borderColor: K.ln, borderLeftWidth: 3, borderRadius: 6, padding: 14, marginTop: 10 },
  chip: { borderWidth: 1, borderColor: K.ln, backgroundColor: K.s1, paddingHorizontal: 13, paddingVertical: 8, borderRadius: 6 }, chipOn: { backgroundColor: K.nb, borderColor: K.ac }, chipT: { color: K.mu, fontFamily: F, fontSize: 13, fontWeight: '600' },
  rowW: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, alignItems: 'center' },
  kv: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, paddingVertical: 8, borderTopWidth: 1, borderTopColor: K.ln }, kvk: { color: K.mu, fontFamily: F, fontSize: 12.5, flex: 1 }, kvv: { color: K.tx, fontFamily: F, fontSize: 13, flex: 1, textAlign: 'right' }, kvv2: { color: K.tx, fontFamily: F, fontSize: 14, fontWeight: '600' },
  btn: { alignSelf: 'flex-start', backgroundColor: K.nb, borderWidth: 1, borderColor: K.ac, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 6 }, btnT: { color: '#fff', fontFamily: F, fontWeight: '700', fontSize: 14 },
};