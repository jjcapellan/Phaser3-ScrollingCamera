![GitHub tag (latest by date)](https://img.shields.io/github/tag-date/jjcapellan/Phaser3-ScrollingCamera.svg)
![GitHub license](https://img.shields.io/github/license/jjcapellan/Phaser3-ScrollingCamera.svg)
# PHASER3 - SCROLLING CAMERA CLASS
**ScrollingCamera** extends the class **Phaser.Cameras.Scene2D.Camera** of [Phaser 3](https://phaser.io/) framework, adding the capacity of vertical and horizontal scrolling by dragging or using the mouse wheel.  
The scroll is customizable.
Live demo: https://jjcapellan.github.io/Phaser3-ScrollingCamera/  

## Features
* Vertical or horizontal scroll
* Natural snap effect (customizable)
* Snap event (sends the snap position)
* Interactive, even behind other cameras.
* Accepts dragging and mouse wheel as input (keyboard supported via setSpeed()).

## Table of contents
* [Installation](#installation)
  * [Browser](#browser)
  * [From NPM](#from-npm)
* [How to use](#how-to-use)
* [Snap event](#snap-event)
* [License](#license)
---

## Installation
### Browser
There are two alternatives:
* Download the file [scrollcam.min.js](https://cdn.jsdelivr.net/gh/jjcapellan/Phaser3-ScrollingCamera@2.0.0/dist/scrollcam.min.js) to your proyect folder and add a reference in your html:
```html
<script src = "scrollcam.min.js"></script>
```  
* Point a script tag to the CDN link:
```html
<script src = "https://cdn.jsdelivr.net/gh/jjcapellan/Phaser3-ScrollingCamera@2.0.0/dist/scrollcam.min.js"></script>
```  
**Important**: the class is exposed as **ScrollingCamera**
### From NPM
```
npm i phaser-scrolling-camera
```
Then you can acces the class as:
* CommonJS module:
```javascript
const ScrollingCamera = require('phaser-scrolling-camera');

// In scene.create function
const config = { ... }
const myScrollCam = new ScrollingCamera(this, config);
```
* ES6 module:
```javascript
import ScrollingCamera from 'phaser-scrolling-camera';

// In scene.create function
const config = { ... }
const myScrollCam = new ScrollingCamera(this, config);
```
---
## How to use
This is the simplest case (uses the default parameters):
```javascript
// In create function ...
let myCamera = new ScrollingCamera(this);
```
The constructor of ScrollingCamera only needs as argument a scene object. All the other arguments are optionals.  
And this is the opposite case with all possible customizations:
```javascript
// In create function ...
let cameraOptions = {
      x: 50,             // x position of the camera (default = 0)
      y: 50,             // y position of the camera (default = 0)
      width: 300,        // width of the camera (default = game.config.width)
      height: 500,       // height of the camera (default = game.config.height)
      contentBounds: {   // rectangle which determines the limits of the area where the camera is looking
        x: 50,           // x position of contents (default = cameraOptions.x)
        y: 50,           // y position of contents (default = cameraOptions.y)
        width: 1200      // width of the contents (default = 5000). Vertical camera uses "height" instead "width".
      }
      wheel: true,       // Does this camera use mouse wheel? (default = false)
      drag: 0.90,        // Reduces the scroll speed per game step in 10%. (default = 0.95)      
      snap: {
        enable: false,   // Does this camera use snap effect? (default = false)
        padding: 20,     // Gap in pixels between snaps (default = 20)
        bounces: 3       // Number of bounces on target before the snap (default = 3)
      }
      horizontal: true   // Does this camera use horizontal scroll (default = false)
    };
const myCamera = new ScrollingCamera(this, cameraOptions);
```
You can control scroll binding any button or key:
```javascript
// In create function ...
let myCamera = new ScrollingCamera(this);
let cursors = this.input.keyboard.createCursorKeys();
cursors.down.on('down', () => myCamera.setSpeed(50));
cursors.up.on('down', () => myCamera.setSpeed(-50));
```
---
## Snap event
```javascript
const myCamera = new ScrollingCamera(this, configObject)

myCamera.on('snap', (snapIndex) => {
  console.log(snapIndex);
})
```
## License
**ScrollingCamera** is licensed under the terms of the MIT open source license.

