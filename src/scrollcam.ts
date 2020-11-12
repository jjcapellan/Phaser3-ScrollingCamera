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
     * The x position of this camera (default = 0)
     */
    x: number = 0;
    /**
     * The y position of this camera (default = 0)
     */
    y: number = 0;
    /**
     * The width of this camera (default = game.width)
     */
    width: number;
    /**
     * The height of this camera (default = game.height)
     */
    height: number;
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
     * Number between 0 and 1. (default = 0.95)
     * Reduces the scroll speed per game step.
     * Example: 0.5 reduces 50% scroll speed per game step.
     */
    drag: number = 0.95;
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
     * Should this camera use horizontal orientation?
     */
    horizontal: boolean;
    /**
     * Start bound of the scroll (top for vertical orientation, left for horizontal orientation)
     */
    start: number;
    /**
     * End bound of the scroll (bottom for vertical orientation, right for horizontal orientation)
     */
    end: number;
    /**
     * Stores the snap position in function of gap beteen snaps (0 ,1 , 2, ...)
     */
    snapIndex: number = 0;



    //// Private properties

    /**
     * Determines if draging is active. Avoids residual movement after stop the scroll with the pointer.
     */
    private moving: boolean = false;
    /**
     * Receives input. Allows this camera be interactive even behind the main camera
     */
    private _zone: Phaser.GameObjects.Zone;
    /** 
     * Scroll speed in pixels per second
     * */
    private _speed: number = 0;
    /**
     * Scroll value when drag action begins
     */
    private _start: number = 0;
    /**
     * Scroll value when drag action ends
     */
    private _end: number = 0;
    /**
     * TimeStamp when drag action begins
     */
    private _startTime: number = 0;
    /**
     * TimeStamp when drag action ends
     */
    private _endTime: number = 0;
    /**
     * Stores 'scrollX' or 'scrollY'. This allows assign this value to a constant and change property by this[prop]
     */
    private _scrollProp: string;
    /**
     * Snap state
     */
    private isOnSnap: boolean = true;
    /**
     * Used for debug tasks
     */
    private _debug: boolean;
    /**
     * Used only for debug purposes (needs this._debug = true in init())
     */
    private txtDebug: Phaser.GameObjects.Text;
    /**
     * Snap bounces counter
     */
    private _snapBounces: number = 0;



    //// Properties inherited from parent class (Camera)

    private _customViewport: boolean;
    _bounds: Phaser.Geom.Rectangle;
    matrix: Phaser.GameObjects.Components.TransformMatrix;
    culledObjects: Phaser.GameObjects.GameObject[];


    //// Constructor

    constructor(scene: Phaser.Scene, config: ScrollConfig) {

        super(0, 0, 0, 0);

        const { x, y, width, height, contentBounds, wheel, drag, snap, horizontal }: ScrollConfig = config;

        this.scene = scene;
        this.x = x || this.x;
        this.y = y || this.y;
        this.width = width || Number(this.scene.game.config.width);
        this.height = height || Number(this.scene.game.config.height);
        this.drag = drag || this.drag;
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
            this.txtDebug = this.scene.add.text(this.x, this.y, 'debug');
        }

        this.scene.cameras.addExisting(this);

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

        if (!this.isOnSnap) {
            this.checkBounds();
        }

        if (Math.abs(this._speed) < 1 && !this.snap.enable) {

            this._speed = 0;
            this.moving = false;

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
        cb.x = cb.x || this.x;
        cb.y = cb.y || this.y;
        cb.length = cb.length || 5000;

        if (this.horizontal) {
            this.start = cb.x;
            this.end = cb.x + cb.length - this.width;
        } else {
            this.start = cb.y;
            this.end = cb.y + cb.length - this.height;
        }

        this.contentBounds = cb;
    }



    private initInputZone() {
        this._zone = this.scene.add.zone(this.x, this.y, this.width, this.height)
            .setOrigin(0)
            .setInteractive();
    }



    private initScroll() {
        this.scrollX = this.horizontal ? (this.start || this.x) : this.x;
        this.scrollY = this.horizontal ? this.y : (this.start || this.y);
        this._scrollProp = this.horizontal ? 'scrollX' : 'scrollY';
    }



    private initWheel(wheel?: WheelConfig) {
        let w = wheel || { enable: false };
        w.delta = w.delta || 55;

        this.wheel = w;
    }



    private initSnap(snap?: SnapConfig) {
        let s = snap || { enable: false };
        s.bounces = snap.bounces || 3;
        s.padding = snap.padding || 20;

        this.snap = s;
    }



    // EVENT METHODS ////

    private setEvents() {
        this._zone.on('pointermove', this.dragHandler, this);
        this._zone.on('pointerup', this.upHandler, this);
        this._zone.on('pointerout', this.upHandler, this);
        this._zone.on('pointerdown', this.downHandler, this);
        if (this.wheel) {
            this._zone.on('wheel', this.wheelHandler, this);
        }
    }



    private downHandler() {
        const prop = this._scrollProp;
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
            this.moving = true;
        }
    }



    private upHandler() {
        this._end = this.horizontal ? this.scrollX : this.scrollY;
        this._endTime = performance.now();
        this.isOnSnap = false;
        if (this.moving) {
            this.moving = false;
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
        const start = this.start;
        const padding = this.snap.padding;
        return start + Math.round((currentPos - this.start) / padding) * padding;
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
        this.txtDebug.setText(str);
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

        if (this[prop] <= this.start) {
            this[prop] = this.start;
            this.makeSnap(this.getNearest(this[prop]));
        } else if (this[prop] >= this.end) {
            this[prop] = this.end;
            this.makeSnap(this.getNearest(this[prop]));
        }
    }



    private clampScroll() {
        const prop = this._scrollProp;
        this[prop] = Phaser.Math.Clamp(this[prop], this.start, this.end);
        this._end = this[prop];
    }



    private makeSnap(nearest: number) {
        const prop = this._scrollProp;
        this[prop] = nearest;
        this.snapIndex = this.getSnapIndex(this[prop], this.start, this.snap.padding);
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