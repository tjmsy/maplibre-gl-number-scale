// Constants
const EARTH_CIRCUMFERENCE = 40075017;
const TILE_SIZE = 512;
const INCHES_TO_METERS = 0.0254;
const DEFAULT_DPI = 96;

/**
 * Calculates the zoom level from the scale ratio.
 * @param {number} scaleRatio - The scale ratio (e.g., 1:x where x is the ratio).
 * @param {number} latitude - The latitude in degrees.
 * @param {number} [dpi = DEFAULT_DPI] - The screen DPI.
 * @return {number} The zoom level.
 */
export function getZoomLevelFromScaleRatio(scaleRatio, latitude, dpi = DEFAULT_DPI) {
  const latitudeInRadians = (latitude * Math.PI) / 180;
  const latitudeCircumference = EARTH_CIRCUMFERENCE * Math.cos(latitudeInRadians);
  const realMetersPerPixel = scaleRatio * (INCHES_TO_METERS / dpi);
  const earthPixelWidth = latitudeCircumference / realMetersPerPixel;
  return Math.log2(earthPixelWidth / TILE_SIZE);
}

/**
 * Calculates the scale ratio (1:x) based on the zoom level and latitude.
 * @param {number} zoomLevel - The map zoom level.
 * @param {number} latitude - The latitude in degrees.
 * @param {number} [dpi = DEFAULT_DPI] - The screen DPI.
 * @return {number} The scale ratio (e.g., 1:x).
 */
export function getScaleRatio(zoomLevel, latitude, dpi = DEFAULT_DPI) {
  const latitudeInRadians = (latitude * Math.PI) / 180;
  const latitudeCircumference = EARTH_CIRCUMFERENCE * Math.cos(latitudeInRadians);
  const pixelsAtEquator = 2 ** zoomLevel * TILE_SIZE;
  const realMetersPerPixel = latitudeCircumference / pixelsAtEquator;
  return Math.round(realMetersPerPixel / (INCHES_TO_METERS / dpi));
}

/**
 * A custom control for displaying and setting scale ratio on the map.
 */
export class ScaleRatioControl {
  /**
   * Creates a new ScaleRatioControl instance.
   * @param {number} [dpi = DEFAULT_DPI] - The screen DPI.
   */
  constructor(dpi = DEFAULT_DPI) {
    this.dpi = dpi;
    this.updateScaleInput = this.updateScaleInput.bind(this);
  }

  /**
   * Calculates the current scale ratio based on the map's zoom level and center latitude.
   * @return {number} The scale ratio (e.g., 1:x).
   */
  calculateScaleRatio() {
    const zoomLevel = this.map.getZoom();
    const latitude = this.map.getCenter().lat;
    return getScaleRatio(zoomLevel, latitude, this.dpi);
  }

  /**
   * Updates the scale input field with the current scale ratio.
   */
  updateScaleInput() {
    const scaleRatio = this.calculateScaleRatio();
    this.scaleInput.value = scaleRatio;
  }

  /**
   * Updates the map zoom level based on the given scale ratio.
   * @param {number} scaleRatio - The scale ratio (e.g., 1:x).
   */
  updateMapZoom(scaleRatio) {
    const latitude = this.map.getCenter().lat;
    const zoomLevel = getZoomLevelFromScaleRatio(scaleRatio, latitude, this.dpi);
    this.map.setZoom(zoomLevel);
  }

  /**
   * Adds the scale ratio control to the map container.
   */
  addScaleRatioControl() {
    this.container = document.createElement('div');
    this.container.className = 'scale-ratio-control maplibregl-ctrl maplibregl-ctrl-group';
    this.container.innerHTML = `
      <label for="scale-ratio-input" class="scale-ratio-control__label">1: </label>
      <input id="scale-ratio-input" type="text" class="scale-ratio-control__input" />
    `;
    this.map.getContainer().append(this.container);

    this.scaleInput = this.container.querySelector('#scale-ratio-input');
    this.bindEvents();
    this.updateScaleInput();
  }

  /**
   * Binds necessary events to the scale input field and the map.
   */
  bindEvents() {
    this.map.on('zoom', this.updateScaleInput);
    this.map.on('move', this.updateScaleInput);

    this.scaleInput.addEventListener('change', (e) => {
      const scaleRatio = Number(e.target.value);
      if (!Number.isNaN(scaleRatio) && scaleRatio > 0) {
        this.updateMapZoom(scaleRatio);
      }
    });
  }

  /**
   * Adds the control to the map and initializes the DOM elements.
   * @param {object} map - The MapLibre map instance.
   * @return {HTMLElement} The container element of the control.
   */
  onAdd(map) {
    this.map = map;
    this.addScaleRatioControl();
    return this.container;
  }

  /**
   * Removes the control from the map and cleans up event listeners.
   */
  onRemove() {
    this.map.off('zoom', this.updateScaleInput);
    this.map.off('move', this.updateScaleInput);
    this.container.parentNode.removeChild(this.container);
    this.map = null;
  }
}
