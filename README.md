![GitHub tag (latest by date)](https://img.shields.io/github/tag-date/jjcapellan/Phaser3-ScrollingCamera.svg)
![GitHub license](https://img.shields.io/github/license/jjcapellan/Phaser3-ScrollingCamera.svg)
# PHASER3 - SCROLLING CAMERA CLASS
**ScrollingCamera** extends the class **Phaser.Cameras.Scene2D.Camera** of Phaser 3 framework, adding the capacity of vertical scrolling by dragging or using the mouse wheel.  
The scroll is customizable.  
Live demo: https://jjcapellan.github.io/Phaser3-ScrollingCamera/  
## Installation
There are two alternatives:
* Download the file [scrollcam.min.js](https://cdn.jsdelivr.net/gh/jjcapellan/Phaser3-ScrollingCamera@1.0.2/dist/scrollcam.min.js) to your proyect folder and add a reference in your html:
```html
<script src = "scrollcam.min.js"></script>
```  
Or you can download the commented version: [scrollcam.js](https://cdn.jsdelivr.net/gh/jjcapellan/Phaser3-ScrollingCamera@1.0.2/dist/scrollcam.js) 
* Point a script tag to the CDN link:
```html
<script src = "https://cdn.jsdelivr.net/gh/jjcapellan/Phaser3-ScrollingCamera@1.0.2/dist/scrollcam.min.js"></script>
```  
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
      top: 600,          // Top bound of scroll (default = 0)
      bottom: 3175,      // Bottom bound of scroll (default = 5000)
      wheel: true,       // Does this camera use mouse wheel? (default = false)
      drag: 0.90,        // Reduces the scroll speed per game step in 10%. (default = 0.95)
      minSpeed: 9,       // Bellow this speed value (pixels/second), the scroll is stopped. (default = 4)
      snap: true,        // Does this camera use snap points? (default = false)
      snapConfig: {      // Defines snap points
        topMargin: 50,   // y position of first snap point (default = 0)
        padding: 50,     // Space in pixels between snap points (default = 20)
        deadZone: 0      // % of space between points not influenced by snap effect (0 - 1) (default = 0)
      }
    };
let myCamera = new ScrollingCamera(this, cameraOptions);
```
You can control scroll binding any button or key:
```javascript
// In create function ...
let myCamera = new ScrollingCamera(this);
let cursors = this.input.keyboard.createCursorKeys();
cursors.down.on('down', () => myCamera.setSpeed(50));
cursors.up.on('down', () => myCamera.setSpeed(-50));
```
## Dependencies
Phaser 3: https://phaser.io/
## License
**ScrollingCamera** is licensed under the terms of the MIT open source license.

