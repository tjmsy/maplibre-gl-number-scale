# maplibre-gl-scale-ratio

A custom control for [MapLibre GL JS](https://github.com/maplibre/maplibre-gl-js/)  that enables users to:  
- Display the scale ratio (e.g. 1:15000) based on the current zoom level, map center latitude, and DPI value (default: 96).
- Set the zoom level by inputting a scale ratio.  

---

## Demo  

[Demo](https://tjmsy.github.io/maplibre-gl-scale-ratio/)

![screenshot](https://tjmsy.github.io/maplibre-gl-scale-ratio/assets/images/screenshot.png)

---

## Usage  

Include CSS from CDN.

```
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/tjmsy/maplibre-gl-scale-ratio@v0.1.0/src/maplibre-gl-scale-ratio.css" />
```

Import JavaScript from CDN 


```javascript
import { ScaleRatioControl } from 'https://cdn.jsdelivr.net/gh/tjmsy/maplibre-gl-scale-ratio@v0.1.0/src/maplibre-gl-scale-ratio.js';
```

Add Control.

```javascript
const scaleRatioControl = new ScaleRatioControl();  
map.addControl(scaleRatioControl);
```

Optionally, you can specify the DPI value if needed:

```javascript
const scaleRatioControl = new ScaleRatioControl({
  dpi: 144  // Optional DPI value (default is 96)
});
map.addControl(scaleRatioControl);
```

---

## Utility Functions  

It also provides standalone utility functions.

These functions can calculate:  

- The `scale ratio` from the zoom level and latitude.
- The `zoom level` from a scale ratio and latitude.
- The `meters per pixel` at a given zoom level and latitude.  

Here are the available functions:

### getScaleRatio

Calculates the scale ratio (1:x) based on the zoom level, latitude, and DPI.

**Parameters:**

`zoomLevel` (number, required): The zoom level of the map.

`latitude` (number, required): The latitude in degrees.

`dpi` (number, optional): Screen DPI (default: 96).

**Returns:**

The `scale ratio` as a number.

**Example:**

```javascript
import { getScaleRatio } from 'https://cdn.jsdelivr.net/gh/tjmsy/maplibre-gl-scale-ratio@v0.1.0/src/maplibre-gl-scale-ratio.js';

const scaleRatio = getScaleRatio(15, 35.6895); // Zoom level 15, latitude 35.6895 (e.g., Tokyo)

console.log("1:", scaleRatio); // e.g. 1: 7332
```

### getZoomLevelFromScaleRatio

Calculates the zoom level based on a given scale ratio, latitude, and DPI.

**Parameters:**

`scaleRatio` (number, required): The scale ratio (e.g., 1:x, where x is the ratio).

`latitude` (number, required): The latitude in degrees.

`dpi` (number, optional): Screen DPI` (default: 96).

**Returns:**

The `zoom level` as a number.

**Example:**

```javascript
import { getZoomLevelFromScaleRatio } from 'https://cdn.jsdelivr.net/gh/tjmsy/maplibre-gl-scale-ratio@v0.1.0/src/maplibre-gl-scale-ratio.js';

const zoomLevel = getZoomLevelFromScaleRatio(15000, 35.6895); // Scale ratio 1:15000, latitude 35.6895 (eg. Tokyo)

console.log(zoomLevel); // e.g. 13.96
```

### getMetersOnEarthPerPixel

Calculates the meters per pixel at a given zoom level and latitude.

**Parameters:**

`zoomLevel` (number, required): The zoom level of the map.

`latitude` (number, required): The latitude in degrees.

**Returns:**

The `meters per pixel` at the given zoom level and latitude as a number.

**Example:**

```javascript
import { getMetersOnEarthPerPixel } from  'https://cdn.jsdelivr.net/gh/tjmsy/maplibre-gl-scale-ratio@v0.1.0/src/maplibre-gl-scale-ratio.js';

const metersPerPixel = getMetersOnEarthPerPixel(15, 35.6895); // Zoom level 15, latitude 35.6895 (e.g., Tokyo)

console.log(metersPerPixel); // e.g. 1.940
```

---

## Feedback & Contributions  

Feel free to open an issue, start a discussion, or reach out with any feedback or suggestions!

Contributions are always welcome!