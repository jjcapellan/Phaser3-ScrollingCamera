/// <reference path="../node_modules/phaser/types/phaser.d.ts" />


/**
 * This type of Phaser camera can be useful to build user interfaces that require scrolling,
 * but without needing scroll bars.
 * The scroll is done by dragging the pointer or using the mouse wheel.
 * @class
 * @extends Phaser.Cameras.Scene2D.Camera
 */
export default class ScrollingCamera extends Phaser.Cameras.Scene2D.Camera {

    //// Public properties

    /**
     * Determines the limits of the area where the camera is looking. 
     */
    contentBounds: {
        /**
         * x position of the top left origin
         */
        x: number,
        /**
         * y position of the top left origin
         */
        y: number,
        /**
         * Distance measured in pixels along the camera main axis
         */
        length?: number
    }
    /**
     * Number between 0 and 1. (default = 0.95)
     * Reduces the scroll speed per game step.
     * Example: 0.5 reduces 50% scroll speed per game step.
     */
    drag: number = 0.95;
    /**
     * The height of this camera (default = game.height)
     */
    height: number;
    /**
     * Should this camera use horizontal orientation?
     */
    horizontal: boolean;
    /**
     * snap config
     */
    snap: {
        /**
        * Will this camera use snap? (default = false)
        */
        enable: boolean,
        /**
        * Distance in pixels between snap points. (default = 20)
        */
        padding?: number,
        /**
        * Number of bounces before snapping (default = 3)
        */
        bounces?: number
    };
    /**
     * Stores the snap position in function of gap beteen snaps (0 ,1 , 2, ...)
     */
    snapIndex: number = 0;
    /**
     * wheel config
     */
    wheel: {
        /*
        * Does this camera use the mouse wheel? (default = 0)
        */
        enable: boolean,
        /**
         * Variation of scroll in pixels with each wheel change (default = 55)
         */
        delta?: number
    };
    /**
     * The width of this camera (default = game.width)
     */
    width: number;
    /**
     * The x position of this camera (default = 0)
     */
    x: number = 0;
    /**
     * The y position of this camera (default = 0)
     */
    y: number = 0;











    //// Private properties

    /**
     * Scroll value when drag action ends
     */
    private _end: number = 0;
    /**
     * End bound of the scroll (bottom for vertical orientation, right for horizontal orientation)
     */
    private _endBound: number;
    /**
     * TimeStamp when drag action ends
     */
    private _endTime: number = 0;
    /**
     * Used for debug tasks
     */
    private _debug: boolean;
    /**
     * Snap state
     */
    private isOnSnap: boolean = true;
    /**
     * Determines if draging is active. Avoids residual movement after stop the scroll with the pointer.
     */
    private _moving: boolean = false;
    /**
     * Stores 'scrollX' or 'scrollY'. This allows assign this value to a constant and change property by this[prop]
     */
    private _scrollProp: string;
    /**
     * Snap bounces counter
     */
    private _snapBounces: number = 0;
    /** 
     * Scroll speed in pixels per second
     * */
    private _speed: number = 0;
    /**
     * Scroll value when drag action begins
     */
    private _start: number = 0;
    /**
     * Start bound of the scroll (top for vertical orientation, left for horizontal orientation)
     */
    private _startBound: number;
    /**
     * TimeStamp when drag action begins
     */
    private _startTime: number = 0;
    /**
     * Used only for debug purposes (needs this._debug = true in init())
     */
    private _txtDebug: Phaser.GameObjects.Text;
    /**
     * Receives input. Allows this camera be interactive even behind the main camera
     */
    private _zone: Phaser.GameObjects.Zone;
    private _upTriggered: boolean = false;
    /**
     * Number of frames which should be rendered before set _moving to 0. This avoids rough stops on pointer up,
     * especially on touch devices.
     */
    private _inertia_frames: number = 0;






    //// Properties inherited from parent class (Camera)

    private _customViewport: boolean;
    _bounds: Phaser.Geom.Rectangle;
    matrix: Phaser.GameObjects.Components.TransformMatrix;
    culledObjects: Phaser.GameObjects.GameObject[];






    //// Constructor

    constructor(scene: Phaser.Scene, config: ScrollConfig) {

        super(0, 0, 0, 0);

        config = config || {};

        const { x, y, width, height, contentBounds, wheel, drag, snap, horizontal }: ScrollConfig = config;

        this.scene = scene;
        this.x = x !== undefined ? x : 0;
        this.y = y !== undefined ? y : 0;
        this.width = width || Number(this.scene.game.config.width);
        this.height = height || Number(this.scene.game.config.height);
        this.drag = drag !== undefined ? drag : this.drag;
        this.horizontal = horizontal;

        this.initContentBounds(contentBounds);
        this.initWheel(wheel);
        this.initSnap(snap);
        this.initScroll();
        this.initInputZone();
        this.setEvents();

        // For use with debug function
        this._debug = false;
        if (this._debug) {
            this._txtDebug = this.scene.add.text(this.x, this.y, 'debug');
        }

        this.scene.cameras.addExisting(this);

        this.setOrigin(0);

    } // End constructor



    //// PUBLIC METHODS /////////////////////////

    /**
     * Sets scroll speed in pixels/second. Use it to control scroll with any key or button.
     * @param { numer } [speed] 
     */
    setSpeed(speed?: number) {
        let t = this;
        if (speed) {
            this._speed = speed;
        } else {
            let distance = t._end - t._start; // pixels
            let duration = (t._endTime - t._startTime) / 1000; //seconds
            this._speed = distance / duration; // pixels/second
        }
    } // End setSpeed()



    update(_time, delta) {
        const prop = this._scrollProp;
        this[prop] += this._speed * (delta / 1000);
        this._speed *= this.drag;

        if(this._inertia_frames > 0){
            this._inertia_frames--;
        }

        if (!this.isOnSnap) {
            this.checkBounds();
        }

        if (Math.abs(this._speed) < 1 && !this.snap.enable && this._moving && !this._inertia_frames) {

            this._speed = 0;
            this._moving = false;

        }
        else if (this.snap.enable && !this.isOnSnap && (!this.scene.input.activePointer.isDown || !this.pointerIsOver())) {

            let prevSpeed = this._speed;
            let nearest = this.getNearest(this[prop]);
            let d = this[prop] - nearest;
            let sign = Math.sign(d);

            // Newton's law of universal gravitation with some changes to avoid NaN
            this._speed += -sign * 16 * (1 / ((d * d) + 1)) - sign * 8;

            if ((prevSpeed > 0 && this._speed < 0) || (prevSpeed < 0 && this._speed > 0)) {
                this._snapBounces++;
            }

            if (this._snapBounces > this.snap.bounces) {
                this.makeSnap(nearest);
            }

        }

        this.clampScroll();
    } // End update()



    destroy() {
        this.emit(Phaser.Cameras.Scene2D.Events.DESTROY, this);
        this._zone.removeAllListeners();
        this._zone.destroy();
        this.removeAllListeners();
        this.matrix.destroy();
        this.culledObjects = [];
        if (this._customViewport) {
            this.sceneManager.customViewports--;
        }
        this._bounds = null;
        this.scene = null;
        this.scaleManager = null;
        this.sceneManager = null;

    }



    //// PRIVATE METHODS ////////////////////////


    // INIT METHODS ////

    private initContentBounds(contentBounds?: Cbounds) {

        let cb = contentBounds || { x: this.x, y: this.y };
        cb.x = 'x' in cb ? cb.x : this.x;
        cb.y = 'y' in cb ? cb.y : this.y;
        cb.length = 'length' in cb ? cb.length : 5000;

        if (this.horizontal) {
            this._startBound = cb.x;
            this._endBound = cb.x + cb.length - this.width;
        } else {
            this._startBound = cb.y;
            this._endBound = cb.y + cb.length - this.height;
        }

        this.contentBounds = cb;
    }



    private initInputZone() {
        this._zone = this.scene.add.zone(this.x, this.y, this.width, this.height)
            .setOrigin(0)
            .setInteractive();
    }



    private initScroll() {
        this.scrollX = this.horizontal ? this._startBound : this.contentBounds.x;
        this.scrollY = this.horizontal ? this.contentBounds.y : this._startBound;
        this._scrollProp = this.horizontal ? 'scrollX' : 'scrollY';
    }



    private initWheel(wheel?: WheelConfig) {
        let w = wheel || { enable: false };
        w.delta = 'delta' in w ? w.delta : 55;

        this.wheel = w;
    }



    private initSnap(snap?: SnapConfig) {
        let s = snap || { enable: false };
        s.bounces = s.bounces || 3;
        s.padding = s.padding || 20;

        this.snap = s;
    }



    // EVENT METHODS ////

    private setEvents() {
        this._zone.on('pointermove', this.dragHandler, this);
        this._zone.on('pointerup', this.upHandler, this);
        this._zone.on('pointerout', this.upHandler, this);
        this._zone.on('pointerdown', this.downHandler, this);
        if (this.wheel.enable) {
            this._zone.on('wheel', this.wheelHandler, this);
        }
    }



    private downHandler() {
        const prop = this._scrollProp;
        this._upTriggered = false;
        this._speed = 0;
        this._snapBounces = 0;
        this._start = this[prop];
        this._startTime = performance.now();
    }



    private dragHandler(pointer) {
        if (pointer.isDown) {            
            if (this.horizontal) {
                this.scrollX -= (pointer.position.x - pointer.prevPosition.x);
            } else {
                this.scrollY -= (pointer.position.y - pointer.prevPosition.y);
            }
            this._inertia_frames = 2;
            this._moving = true;
        }
    }



    private upHandler() {
        if(this._upTriggered)return;
        this._upTriggered = true;
        this._end = this.horizontal ? this.scrollX : this.scrollY;
        this._endTime = performance.now();
        this.isOnSnap = false;
        if (this._moving) {
            this._moving = false;
            this.setSpeed();
        }
    }



    private wheelHandler(event) {
        const prop = this._scrollProp;
        let sign = Math.sign(event.deltaY)
        this[prop] += sign * this.wheel.delta;//event.deltaY;
        this._snapBounces = 0;
        this.isOnSnap = false;
    }



    // HELPERS ////

    private getNearest(currentPos: number): number {
        const start = this._startBound;
        const padding = this.snap.padding;
        return start + Math.round((currentPos - this._startBound) / padding) * padding;
    }



    private getSnapIndex(scrollPos: number, snapTop: number, gap: number) {
        let snapIndex = Math.round((scrollPos - snapTop) / gap);
        return snapIndex;
    }



    private debug(variables: number[]) {
        let str: string = "";
        variables.forEach((v) => {
            str += v.toString() + "\n";
        })
        this._txtDebug.setText(str);
    }



    private pointerIsOver() {
        let isOver = true;
        let p = this.scene.input.activePointer;
        if (p.x < this.x || p.x > this.x + this.width) {
            isOver = false;
        } else if (p.y < this.y || p.y > this.y + this.height) {
            isOver = false;
        }
        return isOver;
    }



    // OTHER PRIVATE METHODS

    private checkBounds() {
        const prop = this._scrollProp;

        if (this[prop] <= this._startBound) {
            this[prop] = this._startBound;
            this.makeSnap(this.getNearest(this[prop]));
        } else if (this[prop] >= this._endBound) {
            this[prop] = this._endBound;
            this.makeSnap(this.getNearest(this[prop]));
        }
    }



    private clampScroll() {
        const prop = this._scrollProp;
        this[prop] = Phaser.Math.Clamp(this[prop], this._startBound, this._endBound);
        this._end = this[prop];
    }



    private makeSnap(nearest: number) {
        const prop = this._scrollProp;
        this[prop] = nearest;
        this.snapIndex = this.getSnapIndex(this[prop], this._startBound, this.snap.padding);
        this._snapBounces = 0;
        this.isOnSnap = true;
        this._speed = 0;
        if (this.snap.enable) {
            this.emit('snap', this.snapIndex);
        }
    }


} // End class







//// TYPESCRIPT INTERFACES //////////////////////

interface SnapConfig {
    /**
     * Will this camera use snap?
     */
    enable: boolean,
    /**
     * Distance in pixels between snap points.
     */
    padding?: number,
    /**
     * Number of bounces before snapping
     */
    bounces?: number
}



interface WheelConfig {
    enable: boolean,
    delta?: number
}



/**
     * Determines the limits of the area where the camera is looking. 
     */
interface Cbounds {
    /**
     * x position of the top left origin
     */
    x: number,
    /**
     * y position of the top left origin
     */
    y: number,
    /**
     * Distance measured in pixels along the camera main axis
     */
    length?: number
}



interface ScrollConfig {
    /**
     * The x position of this camera
     */
    x?: number,
    /**
     * The y position of this camera
     */
    y?: number,
    /**
     * The width of this camera
     */
    width?: number,
    /**
     * The height of this camera
     */
    height?: number,
    /**
     * Bounds of the camera content {x,y,width,height}
     */
    contentBounds?: {
        x: number,
        y: number,
        length?: number
    },
    /**
     * Start bound of the scroll (top for vertical orientation, left for horizontal orientation)
     */
    start?: number,
    /**
     * End bound of the scroll (bottom for vertical orientation, right for horizontal orientation)
     */
    end?: number,

    wheel?: {
        /*
        * Does this camera use the mouse wheel?
        */
        enable: boolean,
        /**
         * Variation of scroll with each wheel change
         */
        delta?: number
    },
    /**
     * Number between 0 and 1.
     * Reduces the scroll speed per game step.
     * Example: 0.5 reduces 50% scroll speed per game step.
     */
    drag?: number,
    /**
     * Contains snap parameters.
     */
    snap?: SnapConfig,
    /**
     * Should this camera use horizontal orientation?
     */
    horizontal?: boolean,
}