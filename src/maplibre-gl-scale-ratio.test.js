import {
  getZoomLevelFromScaleRatio,
  getScaleRatio,
  ScaleRatioControl,
} from './maplibre-gl-scale-ratio';

describe('getZoomLevelFromScaleRatio', () => {
  it('should calculate the correct zoom level for given scale ratio and latitude', () => {
    const scaleRatio = 100000; // 1:100000
    const latitude = 45; // 45 degrees
    const dpi = 96; // Default DPI
    const zoomLevel = getZoomLevelFromScaleRatio(scaleRatio, latitude, dpi);
    expect(zoomLevel).toBeCloseTo(8.19, 2); // Example expected zoom level
  });
});

describe('getScaleRatio', () => {
  it('should calculate the correct scale ratio for given zoom level and latitude', () => {
    const zoomLevel = 8; // Zoom level 8
    const latitude = 45; // 45 degrees
    const dpi = 96; // Default DPI
    const scaleRatio = getScaleRatio(zoomLevel, latitude, dpi);
    expect(scaleRatio).toBeCloseTo(591657, -1); // Example expected scale ratio
  });
});

describe('ScaleRatioControl', () => {
  let mapMock;
  let scaleRatioControl;

  beforeEach(() => {
    // Mapのモック
    mapMock = {
      getZoom: jest.fn().mockReturnValue(8),
      getCenter: jest.fn().mockReturnValue({ lat: 45 }),
      setZoom: jest.fn(),
      getContainer: jest.fn().mockReturnValue(document.createElement('div')),
      on: jest.fn(),
      off: jest.fn(),
    };

    scaleRatioControl = new ScaleRatioControl();
    scaleRatioControl.onAdd(mapMock); // Mapに追加
  });

  afterEach(() => {
    scaleRatioControl.onRemove(); // クリーンアップ
  });

  it('should calculate and update the scale input field on zoom or move', () => {
    scaleRatioControl.updateScaleInput();
    const scaleInput = scaleRatioControl.container.querySelector('#scale-ratio-input');
    expect(scaleInput.value).toBe(String(getScaleRatio(8, 45))); // 期待値
  });

  it('should update the map zoom level when the scale input changes', () => {
    const scaleInput = scaleRatioControl.container.querySelector('#scale-ratio-input');
    scaleInput.value = '100000'; // 1:100000
    scaleInput.dispatchEvent(new Event('change'));

    expect(mapMock.setZoom).toHaveBeenCalledWith(getZoomLevelFromScaleRatio(100000, 45));
  });

  it('should bind events on add and remove them on removal', () => {
    expect(mapMock.on).toHaveBeenCalledWith('zoom', scaleRatioControl.updateScaleInput);
    expect(mapMock.on).toHaveBeenCalledWith('move', scaleRatioControl.updateScaleInput);

    scaleRatioControl.onRemove();

    expect(mapMock.off).toHaveBeenCalledWith('zoom', scaleRatioControl.updateScaleInput);
    expect(mapMock.off).toHaveBeenCalledWith('move', scaleRatioControl.updateScaleInput);
  });
});
