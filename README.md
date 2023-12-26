![GitHub tag (latest by date)](https://img.shields.io/github/tag-date/jjcapellan/Phaser3-ScrollingCamera.svg)
![GitHub license](https://img.shields.io/github/license/jjcapellan/Phaser3-ScrollingCamera.svg)
# PHASER3 - SCROLLING CAMERA CLASS
**ScrollingCamera** extends the class **Phaser.Cameras.Scene2D.Camera** of [Phaser 3](https://phaser.io/) framework, adding the capacity of vertical and horizontal scrolling by dragging or using the mouse wheel, with optional snap system.  
The scroll is customizable.  

**Live demo**: https://jjcapellan.github.io/Phaser3-ScrollingCamera/  

## Features
* Vertical or horizontal scroll
* Natural snap effect (customizable)
* Snap event (sends the snap position)
* Interactive, even behind other cameras.
* Accepts dragging and mouse wheel as input (keyboard supported).

## Table of contents
* [Installation](#installation)
  * [Browser](#browser)
  * [From NPM](#from-npm)
* [How to use](#how-to-use)
* [Snap event](#snap-event)
* [Public methods](#public-methods)
  * [setSpeed](#setspeed)
  * [moveToSanap](#moveToSnap)
* [Public properties](#public-properties)
  * [snapIndex](#snapindex)
* [License](#license)
---

## Installation
### Browser
There are two alternatives:
* Download the file [scrollcam.umd.js](https://cdn.jsdelivr.net/gh/jjcapellan/Phaser3-ScrollingCamera@2.1.1/dist/scrollcam.umd.js) to your proyect folder and add a reference in your html:
```html
<script src = "scrollcam.umd.js"></script>
```  
* Point a script tag to the CDN link:
```html
<script src = "https://cdn.jsdelivr.net/gh/jjcapellan/Phaser3-ScrollingCamera@2.1.1/dist/scrollcam.umd.js"></script>
```  
**Important**: the class is exposed as **ScrollingCamera**
### From NPM
```
npm i phaser3-scrolling-camera
```
Then you can acces the class as:
* CommonJS module:
```javascript
const Phaser = require('phaser');
const ScrollingCamera = require('phaser3-scrolling-camera').default;

// In scene.create function
const config = { ... }
const myScrollCam = new ScrollingCamera(this, config);
```
* ES6 module:
```javascript
import Phaser from 'phaser';
import ScrollingCamera from 'phaser3-scrolling-camera';

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
      width: 300,        // Width of the camera (default = game.config.width)
      height: 500,       // Height of the camera (default = game.config.height)
      contentBounds: {   // Determines the limits of the area where the camera is looking. (optional)
        x: 400,          // x position of contents from top-left origin (default = cameraOptions.x)
        y: 10,           // y position of contents from top-left origin (default = cameraOptions.y)
        length: 1200     // Distance measured in pixels along the camera main axis
      },
      wheel: {           // Mouse wheel params (optional)
        enable: true,    // Does this camera use the mouse wheel? (default = false)
        delta: 60        // Variation of scroll in pixels with each wheel change (default = 55)
      },
      drag: 0.90,        // Reduces the scroll speed per game step in 10%. (default = 0.95)      
      snap: {
        enable: false,   // Does this camera use snap effect? (default = false)
        padding: 20,     // Gap in pixels between snaps (default = 20)
        bounces: 3       // Number of bounces on target before the snap (default = 3)
      },
      horizontal: true   // Does this camera use horizontal scroll (default = false)
    };
const myCamera = new ScrollingCamera(this, cameraOptions);
```
In this image the content for the ScrollingCamera camera is positioned out of screen, in this way we haven't to hide it to the main camera of the scene (camera.ignore(...)):  

<p align="center">
<img alt="ScrollingCamera example" src="./imgs/scrollcam-example.jpg"/>
</p>

---
## Snap event
In the code bellow, the event snap returns the last snap position (snapIndex) where the camera was stopped.  
This position is **not in pixels**, is an index representing the first snap, the second snap, ... (0, 1, ...).  
This is usefull to extract a numeric value like in the demo.
```javascript
const myCamera = new ScrollingCamera(this, configObject)

myCamera.on('snap', (snapIndex) => {
  console.log(snapIndex);
});
```
---
## Public methods
Besides the functions inherited from the parent class, ScrollingCamera have these public methods:
### <a id="setspeed"></a>setSpeed(speed: number)
Params:
* **speed** : scroll speed in pixels/second   

This method can be usefull, for example, to implement keyboard control:
```javascript
// In create function ...
let myCamera = new ScrollingCamera(this);
let cursors = this.input.keyboard.createCursorKeys();
cursors.down.on('down', () => myCamera.setSpeed(50));
cursors.up.on('down', () => myCamera.setSpeed(-50));
```
### <a id="moveToSnap"></a>moveToSnap(snapIndex: number)
Params:
* **snapIndex** {number}: Snap position in function of gap beteen snaps (0 ,1 , 2, ...).
Sets the scroll position to snapIndex instantly.
```javascript
// In create function ...
let myCamera = new ScrollingCamera(this);
let cursors = this.input.keyboard.createCursorKeys();
cursors.down.on('down', () => myCamera.moveToSnap(myCamera.snapIndex - 1));
cursors.up.on('down', () => myCamera.moveToSnap(myCamera.snapIndex + 1));
```
---
## Public properties
Besides inherited properties and the properties declared in the constructor, there are only one public property:
* **snapIndex** {number}: Stores the snap position in function of gap beteen snaps (0 ,1 , 2, ...). This property is send with the event **snap** as argument.
## License
**ScrollingCamera** is licensed under the terms of the MIT open source license.

