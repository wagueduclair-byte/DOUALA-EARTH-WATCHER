import React from 'react';
import { WebView } from 'react-native-webview';
import { mapHtml } from './mapHtml';
export default function MapEmbed({ layer = 'pr', height = 420 }) {
  return <WebView originWhitelist={['*']} source={{ html: mapHtml(layer) }} style={{ height, backgroundColor: '#0A0D12' }} nestedScrollEnabled />;
}
