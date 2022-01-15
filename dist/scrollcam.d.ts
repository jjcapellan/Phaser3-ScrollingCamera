/// <reference types="phaser" />
/**
 * This type of Phaser camera can be useful to build user interfaces that require scrolling,
 * but without needing scroll bars.
 * The scroll is done by dragging the pointer or using the mouse wheel.
 * @class
 * @extends Phaser.Cameras.Scene2D.Camera
 */
export default class ScrollingCamera extends Phaser.Cameras.Scene2D.Camera {
    /**
     * Determines the limits of the area where the camera is looking.
     */
    contentBounds: {
        /**
         * x position of the top left origin
         */
        x: number;
        /**
         * y position of the top left origin
         */
        y: number;
        /**
         * Distance measured in pixels along the camera main axis
         */
        length?: number;
    };
    /**
     * Number between 0 and 1. (default = 0.95)
     * Reduces the scroll speed per game step.
     * Example: 0.5 reduces 50% scroll speed per game step.
     */
    drag: number;
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
        enable: boolean;
        /**
        * Distance in pixels between snap points. (default = 20)
        */
        padding?: number;
        /**
        * Number of bounces before snapping (default = 3)
        */
        bounces?: number;
    };
    /**
     * Stores the snap position in function of gap beteen snaps (0 ,1 , 2, ...)
     */
    snapIndex: number;
    /**
     * wheel config
     */
    wheel: {
        enable: boolean;
        /**
         * Variation of scroll in pixels with each wheel change (default = 55)
         */
        delta?: number;
    };
    /**
     * The width of this camera (default = game.width)
     */
    width: number;
    /**
     * The x position of this camera (default = 0)
     */
    x: number;
    /**
     * The y position of this camera (default = 0)
     */
    y: number;
    /**
     * Scroll value when drag action ends
     */
    private _end;
    /**
     * End bound of the scroll (bottom for vertical orientation, right for horizontal orientation)
     */
    private _endBound;
    /**
     * TimeStamp when drag action ends
     */
    private _endTime;
    /**
     * Used for debug tasks
     */
    private _debug;
    /**
     * Snap state
     */
    private isOnSnap;
    /**
     * Determines if draging is active. Avoids residual movement after stop the scroll with the pointer.
     */
    private _moving;
    /**
     * Stores 'scrollX' or 'scrollY'. This allows assign this value to a constant and change property by this[prop]
     */
    private _scrollProp;
    /**
     * Snap bounces counter
     */
    private _snapBounces;
    /**
     * Scroll speed in pixels per second
     * */
    private _speed;
    /**
     * Scroll value when drag action begins
     */
    private _start;
    /**
     * Start bound of the scroll (top for vertical orientation, left for horizontal orientation)
     */
    private _startBound;
    /**
     * TimeStamp when drag action begins
     */
    private _startTime;
    /**
     * Used only for debug purposes (needs this._debug = true in init())
     */
    private _txtDebug;
    /**
     * Receives input. Allows this camera be interactive even behind the main camera
     */
    private _zone;
    private _upTriggered;
    /**
     * Number of frames which should be rendered before set _moving to 0. This avoids rough stops on pointer up,
     * especially on touch devices.
     */
    private _inertia_frames;
    private _customViewport;
    _bounds: Phaser.Geom.Rectangle;
    matrix: Phaser.GameObjects.Components.TransformMatrix;
    culledObjects: Phaser.GameObjects.GameObject[];
    constructor(scene: Phaser.Scene, config: ScrollConfig);
    /**
     * Sets scroll speed in pixels/second. Use it to control scroll with any key or button.
     * @param { numer } [speed]
     */
    setSpeed(speed?: number): void;
    update(_time: any, delta: any): void;
    destroy(): void;
    private initContentBounds;
    private initInputZone;
    private initScroll;
    private initWheel;
    private initSnap;
    private setEvents;
    private downHandler;
    private dragHandler;
    private upHandler;
    private wheelHandler;
    private getNearest;
    private getSnapIndex;
    private debug;
    private pointerIsOver;
    private checkBounds;
    private clampScroll;
    private makeSnap;
}
interface SnapConfig {
    /**
     * Will this camera use snap?
     */
    enable: boolean;
    /**
     * Distance in pixels between snap points.
     */
    padding?: number;
    /**
     * Number of bounces before snapping
     */
    bounces?: number;
}
interface ScrollConfig {
    /**
     * The x position of this camera
     */
    x?: number;
    /**
     * The y position of this camera
     */
    y?: number;
    /**
     * The width of this camera
     */
    width?: number;
    /**
     * The height of this camera
     */
    height?: number;
    /**
     * Bounds of the camera content {x,y,width,height}
     */
    contentBounds?: {
        x: number;
        y: number;
        length?: number;
    };
    /**
     * Start bound of the scroll (top for vertical orientation, left for horizontal orientation)
     */
    start?: number;
    /**
     * End bound of the scroll (bottom for vertical orientation, right for horizontal orientation)
     */
    end?: number;
    wheel?: {
        enable: boolean;
        /**
         * Variation of scroll with each wheel change
         */
        delta?: number;
    };
    /**
     * Number between 0 and 1.
     * Reduces the scroll speed per game step.
     * Example: 0.5 reduces 50% scroll speed per game step.
     */
    drag?: number;
    /**
     * Contains snap parameters.
     */
    snap?: SnapConfig;
    /**
     * Should this camera use horizontal orientation?
     */
    horizontal?: boolean;
}
export {};
