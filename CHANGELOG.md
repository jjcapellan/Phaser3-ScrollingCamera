# v2.0.3
## Fixes
* Fix: rough scroll stops on pointerup events, specially on mobile devices.
---
# v2.0.2
## Minor fixes
* Fix: wrong readme version.
---
# v2.0.1
## Fixes
* Fix: Camera position undefined when no config object.
* Fix: Whell.enable option not active.
---
# v2.0.0
**Important**: This version breaks compatibility with previous versions.
## New features
* Added **horizontal scroll**. 
* Customizable wheel behavior (**delta** property)
* **snap** event: Emits this event when camera is stopped in a snap point.
* **snapIndex** property {number}: Last snap index where the camera was stopped. 
* New snap effect: now the stops on snap points are more "realistic".
* Installable as commonJS module, ES6 module or UMD module.

## Fixes and little improvements
* Fix: with multiple cameras, pointer actions are received by all.
* Fix: control problems when scrolling camera is behind other cameras. 
---
# v1.0.2
## Fixes and little improvements
* Improvement: **setSpeed(speed: number)** allows set the scroll speed.
---
# v1.0.1
## Fixes and little improvements
* Fix: residual movement when up pointer after stop it or change direction.
* Fix: Incorrect scroll direction while dragging after flick scroll ([issue #1](https://github.com/jjcapellan/Phaser3-ScrollingCamera/issues/1)).
---
# v1.0.0
## Features
* Accepts dragging gesture and mouse wheel as input.
* Vertical scroll

