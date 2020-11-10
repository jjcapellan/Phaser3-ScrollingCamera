/// <reference path="../node_modules/phaser/types/phaser.d.ts" />



/**
 * This type of Phaser camera can be useful to build user interfaces that require scrolling,
 * but without needing scroll bars.
 * The scroll is done by dragging the pointer or using the mouse wheel.
 * @class
 * @extends Phaser.Cameras.Scene2D.Camera
 */
export default class ScrollingCamera extends Phaser.Cameras.Scene2D.Camera {

    //// Properties from ScrollConfig initiated in constructor
    x: number;
    y: number;
    width: number;
    height: number;
    start: number;
    end: number;
    left: number;
    right: number;
    wheel: boolean;
    drag: number;
    minSpeed: number;
    snap: SnapConfig;
    horizontal: boolean;



    /// Properties initiated in init()
    /**
     * Determines if draging is active. Avoids residual movement after stop the scroll with the pointer.
     */
    private moving: boolean;
    /**
     * Receives input. Allows this camera be interactive even behind the main camera
     */
    private _zone: Phaser.GameObjects.Zone;
    /** 
     * Scroll speed in pixels per second
     * */
    private _speed: number;
    /**
     * Scroll value when drag action begins
     */
    private _start: number;
    /**
     * Scroll value when drag action ends
     */
    private _end: number;
    /**
     * TimeStamp when drag action begins
     */
    private _startTime: number;
    /**
     * TimeStamp when drag action ends
     */
    private _endTime: number;
    /**
     * Stores 'scrollX' or 'scrollY'. This allows assign this value to a constant and change property by this[prop]
     */
    private _scrollProp: string;
    /**
     * Snap state
     */
    isOnSnap: boolean;
    /**
     * Stores the snap index (0 ,1 , 2, ...)
     */
    snapIndex: number;



    //// Properties inherited from parent class (Camera)
    private _customViewport: boolean;
    _bounds: Phaser.Geom.Rectangle;
    matrix: Phaser.GameObjects.Components.TransformMatrix;
    culledObjects: Phaser.GameObjects.GameObject[];


    constructor(
        scene: Phaser.Scene,
        {
            x = 0,
            y = 0,
            width,
            height,
            start = 0,
            end = 5000,
            wheel = false,
            drag = 0.95,
            minSpeed = 4,
            snap = {enable: false},
            horizontal = false
        }: ScrollConfig
    ) {
        super(x, y, width, height);
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.width = width || Number(this.scene.game.config.width);
        this.height = height || Number(this.scene.game.config.height);


        this.start = start;
        this.end = end - (horizontal ? this.width : this.height);
        this.wheel = wheel;
        this.drag = drag;
        this.minSpeed = minSpeed;
        this.snap = snap;
        this.horizontal = horizontal;

        this.snap.padding = snap.padding || 20;
        this.snap.deadZone = (snap.deadZone === undefined) ? 0.4 : snap.deadZone;

        this.init();
    } // End constructor

    private init() {
        this.moving = false;
        this.scrollX = this.horizontal ? (this.start || this.x) : this.x;
        this.scrollY = this.horizontal ? this.y : (this.start || this.y);
        this._zone = this.scene.add.zone(this.x, this.y, this.width, this.height).setOrigin(0).setInteractive();
        this._speed = 0;
        this._start = this.scrollY;
        this._end = this.scrollY;
        this._startTime = 0;
        this._endTime = 0;
        this._scrollProp = this.horizontal ? 'scrollX' : 'scrollY';
        this.isOnSnap = false;
        this.snapIndex = 0;

        //// Sets events
        this.setEvents();

        this.scene.time.addEvent({ delay: 500, callback: this.resetMoving, callbackScope: this, loop: true });

        this.scene.cameras.addExisting(this);
    } // End init()


    private resetMoving() {
        this.moving = false;
    }


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
    }


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
            this.setSpeed();
        }
    }


    private wheelHandler(event) {
        const prop = this._scrollProp;
        this[prop] += event.deltaY;
        this.isOnSnap = false;
    }


    private clampScroll() {
        const prop = this._scrollProp;
        this[prop] = Phaser.Math.Clamp(this[prop], this.start, this.end);
        this._end = this[prop];
    }


    update(time, delta) {
        const prop = this._scrollProp;
        this[prop] += this._speed * (delta / 1000);
        this._speed *= this.drag;

        if (!this.isOnSnap) {
            this.checkBounds();
        }


        if (Math.abs(this._speed) < this.minSpeed && !this.isOnSnap) {
            this._speed = 0;
            if (this.snap.enable&& !this.scene.input.activePointer.isDown) {
                const start = this.start;
                const snapPosition = this[prop] - start;
                const gap = this.snap.padding;
                const gapRatio = snapPosition / gap;
                const gapRatioRemain = gapRatio % 1;
                //// Snap
                if (Math.abs(0.5 - gapRatioRemain) >= this.snap.deadZone / 2) {
                    this[prop] = this.getNearest(this[prop], this.start, this.snap.padding);
                    this.snapIndex = this.getSnapIndex(this[prop], this.start, this.snap.padding);
                    this.isOnSnap = true;
                    this.emit('snap', this.snapIndex);
                }
            }
        }
        this.clampScroll();
    }

    private checkBounds() {
        const prop = this._scrollProp;

        if (this[prop] <= this.start) {
            this[prop] = this.start;
            this._speed = 0;
        } else if (this[prop] >= this.end) {
            this[prop] = this.end;
            this._speed = 0;
        }
    }


    private getSnapIndex(scrollPos: number, snapTop: number, gap: number) {
        let snapIdx = Math.round((scrollPos - snapTop) / gap);
        return snapIdx;
    }

    private getNearest(currentPos: number, start: number, padding: number): number{
        return start + Math.round((currentPos - start)/padding) * padding;
    }


    destroy() {
        this.emit(Phaser.Cameras.Scene2D.Events.DESTROY, this);
        window.removeEventListener('wheel', this.wheelHandler);
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
} // End class



interface SnapConfig {
    /**
     * Will this camera use snap?
     */
    enable: boolean,
    /**
     * Vertical distance in pixels between snap points.
     */
    padding?: number,
    /**
     * % of space between two snap points not influenced by snap effect.\n
     */
    deadZone?: number
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
     * Start bound of the scroll (top for vertical orientation, left for horizontal orientation)
     */
    start?: number,
    /**
     * End bound of the scroll (bottom for vertical orientation, right for horizontal orientation)
     */
    end?: number,
    /*
     * Does this camera use the mouse wheel?
     */
    wheel?: boolean,
    /**
     * Number between 0 and 1.
     * Reduces the scroll speed per game step.
     * Example: 0.5 reduces 50% scroll speed per game step.
     */
    drag?: number,
    /**
     * Bellow this speed value (pixels/second), the scroll is stopped
     */
    minSpeed?: number,
    /**
     * Contains snap parameters.
     */
    snap?: SnapConfig,
    /**
     * Should this camera use horizontal orientation?
     */
    horizontal?: boolean,
}