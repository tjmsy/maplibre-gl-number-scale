export function getZoomLevelFromScaleRatio(scaleRatio, latitude, dpi = 96) {
  const EARTH_CIRCUMFERENCE = 40075017;
  const TILE_SIZE = 512;
  const INCHES_TO_METERS = 0.0254;

  const latitudeInRadians = (latitude * Math.PI) / 180;
  const latitudeCircumference = EARTH_CIRCUMFERENCE * Math.cos(latitudeInRadians);
  const realMetersPerPixel = scaleRatio * (INCHES_TO_METERS / dpi);
  const earthPixelWidth = latitudeCircumference / realMetersPerPixel;
  return Math.log2(earthPixelWidth / TILE_SIZE);
}

export function getScaleRatio(zoomLevel, latitude, dpi = 96) {
  const EARTH_CIRCUMFERENCE = 40075017;
  const TILE_SIZE = 512;
  const INCHES_TO_METERS = 0.0254;

  const latitudeInRadians = (latitude * Math.PI) / 180;
  const latitudeCircumference = EARTH_CIRCUMFERENCE * Math.cos(latitudeInRadians);
  const pixelsAtEquator = Math.pow(2, zoomLevel) * TILE_SIZE;
  const realMetersPerPixel = latitudeCircumference / pixelsAtEquator;
  const scaleRatio = realMetersPerPixel / (INCHES_TO_METERS / dpi);
  return Math.round(scaleRatio);
}

export class ScaleInputControl {
  constructor(map, dpi = 96) {
    this.dpi = dpi;
  }

  updateScaleInput() {
    const zoomLevel = this.map.getZoom();
    const latitude = this.map.getCenter().lat;
    const scaleRatio = getScaleRatio(zoomLevel, latitude, this.dpi);
    this.scaleInput.value = scaleRatio;
  }

  updateMapZoom(scaleRatio) {
    const latitude = this.map.getCenter().lat;
    const zoomLevel = getZoomLevelFromScaleRatio(scaleRatio, latitude, this.dpi);
    this.map.setZoom(zoomLevel);
  }

  addScaleInputControl() {
    this.container = document.createElement('div');
    this.container.className = 'maplibre-ctrl maplibregl-ctrl-group';
    this.container.id = 'scale-input-container';
    this.container.innerHTML = `
      <label for="scale-input" class="scale-label">1: </label>
      <input id="scale-input" type="text" class="scale-input" />
    `;
    this.map.getContainer().appendChild(this.container);

    this.scaleInput = document.getElementById('scale-input');

    this.map.on('zoom', () => this.updateScaleInput());
    this.map.on('move', () => this.updateScaleInput());

    this.scaleInput.addEventListener('change', (e) => {
      const scaleRatio = parseFloat(e.target.value);
      if (!isNaN(scaleRatio) && scaleRatio > 0) {
        this.updateMapZoom(scaleRatio);
      }
    });

    this.updateScaleInput();
  }

  onAdd(map) {
    this.map = map;
    this.addScaleInputControl();
    return this.container;
  }

  onRemove() {
    this.container.parentNode.removeChild(this.container);
    this.map = null;
  }
}
