# Scale Ratio Control  

A custom control for MapLibre that enables users to:  
- Display the scale ratio (e.g., `1:15000`) based on the current zoom level.  
- Set the zoom level by inputting a scale ratio.  

The scale ratio is calculated using the **latitude at the center of the map view** and an **optional DPI value (default: 96)**.  

---

## Features  

- Seamlessly integrates with MapLibre.  
- Customizable DPI settings for screen or print environments.
- Lightweight and easy to use.  

---

## Demo  

Demo coming soon on GitHub Pages.  

---

## Installation  

### via npm  

(to be added)

### via CDN  

(to be added)

---

## Usage  

### 1. Import the control  

```javascript  
import { ScaleRatioControl } from 'scale-ratio-control';  
```  

### 2. Include the CSS file in your HTML  

For projects using a bundler (e.g., Webpack):  
```javascript  
import 'scale-ratio-control/dist/ScaleRatioControl.css';  
```  

For direct use in the browser:  
(to be added)

### 3. Add the control to your map  

```javascript  
const control = new ScaleRatioControl(map);  
map.addControl(control, 'top-left');  
```  

---

## API Reference  

### `ScaleRatioControl`  

A MapLibre control for handling scale ratios.  

#### Constructor  

```javascript  
new ScaleRatioControl(map, dpi = 96);  
```  

**Parameters**:  
- `map` (required): The MapLibre map instance.  
- `dpi` (optional): Dots Per Inch (DPI) value for the environment. This can represent the DPI of a screen (default: 96) or a printer for paper outputs.  


**Example Usage**:  
```javascript  
const control = new ScaleRatioControl(map, 120); // For high-resolution screens  
map.addControl(control, 'top-right');  
```  

---

## License  

This project is licensed under the MIT License.  
