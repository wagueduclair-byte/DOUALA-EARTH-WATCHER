import React from 'react';
import { mapHtml } from './mapHtml';
export default function MapEmbed({ layer = 'pr', height = 420 }) {
  return React.createElement('iframe', { srcDoc: mapHtml(layer), title: 'Carte', style: { width: '100%', height, border: 0, borderRadius: 8, display: 'block' } });
}
