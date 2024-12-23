import {
  getZoomLevelFromScaleRatio,
  getScaleRatio,
  getMetersPerPixelOnEarth,
  ScaleRatioControl,
} from './maplibre-gl-scale-ratio';

describe('getMetersPerPixelOnEarth', () => {
  const testValues = [
    [0, 0, 78271.484],
    [5, 20, 2298.473],
    [10, 40, 58.554],
    [15, 60, 1.194],
    [20, 80, 0.013],
  ];

  testValues.forEach(([zoomLevel, latitude, expectedResult]) => {
    it(`should return correct value for zoom level ${zoomLevel} and latitude ${latitude}`, () => {
      const result = getMetersPerPixelOnEarth(zoomLevel, latitude);
      expect(result).toBeCloseTo(expectedResult, 3);
    });
  });
});

describe('getZoomLevelFromScaleRatio', () => {
  const testValues = [
    [1000, 0, 18.17],
    [5000, 20, 15.76],
    [10000, 40, 14.46],
    [100000, 60, 10.53],
    [10000000, 80, 2.36],
  ];

  testValues.forEach(([scaleRatio, latitude, expectedZoomLevel]) => {
    it(`should return correct zoom level for scale ratio ${scaleRatio} and latitude ${latitude}`, () => {
      const result = getZoomLevelFromScaleRatio(scaleRatio, latitude);
      expect(result).toBeCloseTo(expectedZoomLevel, 2);
    });
  });
});

describe('getScaleRatio', () => {
  const testValues = [
    [0, 0, 295829232],
    [5, 20, 8687142],
    [10, 40, 221307],
    [15, 60, 4514],
    [20, 80, 49],
  ];

  testValues.forEach(([zoomLevel, latitude, expectedScaleRatio]) => {
    it(`should return correct scale ratio for zoom level ${zoomLevel} and latitude ${latitude}`, () => {
      const result = getScaleRatio(zoomLevel, latitude);
      expect(result).toBeCloseTo(expectedScaleRatio, 0);
    });
  });
});

describe('Scale and Zoom Level Consistency', () => {
  const testValues = [
    [0, 0],
    [5, 20],
    [10, 40],
    [15, 60],
    [20, 80],
  ];

  testValues.forEach(([zoomLevel, latitude]) => {
    it(`should maintain consistency between scale ratio and zoom level for zoom level ${zoomLevel} and latitude ${latitude}`, () => {
      const scaleRatio = getScaleRatio(zoomLevel, latitude);
      const recalculatedZoomLevel = getZoomLevelFromScaleRatio(scaleRatio, latitude);
      expect(recalculatedZoomLevel).toBeCloseTo(zoomLevel, 2);
    });
  });
});

describe('ScaleRatioControl', () => {
  let mapMock;
  let scaleRatioControl;

  beforeEach(() => {
    mapMock = {
      getZoom: jest.fn().mockReturnValue(15),
      getCenter: jest.fn().mockReturnValue({ lat: 35 }),
      setZoom: jest.fn(),
      getContainer: jest.fn().mockReturnValue(document.createElement('div')),
      on: jest.fn(),
      off: jest.fn(),
    };

    scaleRatioControl = new ScaleRatioControl();
    scaleRatioControl.onAdd(mapMock);
  });

  afterEach(() => {
    scaleRatioControl.onRemove();
  });

  it('should calculate and update the scale input field on zoom or move', () => {
    scaleRatioControl.updateScaleInput();
    const scaleInput = scaleRatioControl.container.querySelector('#scale-ratio-input');
    expect(scaleInput.value).toBe(String(getScaleRatio(15, 35)));
  });

  it('should update the map zoom level when the scale input changes', () => {
    const scaleInput = scaleRatioControl.container.querySelector('#scale-ratio-input');
    scaleInput.value = '10000';
    scaleInput.dispatchEvent(new Event('change'));

    expect(mapMock.setZoom).toHaveBeenCalledWith(getZoomLevelFromScaleRatio(10000, 35));
  });
});
