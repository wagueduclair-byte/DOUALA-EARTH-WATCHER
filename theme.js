// CHARTE GRAPHIQUE — UN SEUL FICHIER À MODIFIER.
// ⚠ Valeurs provisoires : je n'ai pas le document de charte NASA autorisé par votre équipe.
// Remplacez ces valeurs (couleurs, police, logo) par celles du document officiel.
import { Platform } from 'react-native';
export const K = {
  bg: '#0A0D12', s1: '#10151C', s2: '#161D27', ln: '#232D3A', tx: '#E8ECF2', mu: '#8E9AAB',
  ac: '#5B9DFF',          // accent de données (bleu clair lisible sur fond sombre)
  nb: '#0B3D91',          // « NASA Blue » (valeur publique connue — à confirmer avec la charte)
  rd: '#FC3D21',          // « NASA Red » (idem)
  am: '#F2B84B',
};
export const F = Platform.select({ ios: 'Helvetica Neue', android: 'sans-serif', default: 'Helvetica Neue, Helvetica, Arial, sans-serif' });
export const LOGO = null; // ex. require('./assets/nasa-logo.png') — uniquement le fichier fourni par la NASA / Space Apps
