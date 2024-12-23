import { ScaleRatioControl } from 'https://cdn.jsdelivr.net/gh/tjmsy/maplibre-gl-scale-ratio@main/src/maplibre-gl-scale-ratio.js';

const map = new maplibregl.Map({
  container: 'map',
  style: 'https://tiles.openfreemap.org/styles/liberty',
  center: [0, 0],
  zoom: 1,
  hash: true,
});
map.addControl(
  new MaplibreExportControl.MaplibreExportControl({
    Crosshair: true,
    PrintableArea: true,
  }),
  'top-right',
);
map.addControl(new ScaleRatioControl(), 'top-left');
map.addControl(new maplibregl.NavigationControl(), 'bottom-right');
map.addControl(new maplibregl.ScaleControl({ unit: 'metric' }), 'bottom-left');