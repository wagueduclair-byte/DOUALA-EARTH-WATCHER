import { mapHtml } from './mapHtml';
export default function MapEmbed({ layer = 'pr', height = 420 }) {
  return <iframe title="Carte de Douala" srcDoc={mapHtml(layer)} style={{ width: '100%', height, border: 0, display: 'block' }} />;
}
