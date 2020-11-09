/// <reference types="phaser" />
/**
 * This type of Phaser camera can be useful to build user interfaces that require scrolling,
 * but without needing scroll bars.
 * The scroll is done by dragging the pointer or using the mouse wheel.
 * @class
 * @extends Phaser.Cameras.Scene2D.Camera
 */
export default class ScrollingCamera extends Phaser.Cameras.Scene2D.Camera {
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
    snap: boolean;
    snapGrid: SnapConfig;
    horizontal: boolean;
    /**
     * Determines if draging is active. Avoids residual movement after stop the scroll with the pointer.
     */
    private moving;
    private _rectangle;
    /**
     * Scroll speed in pixels per second
     * */
    private _speed;
    /**
     * Scroll value when drag action begins
     */
    private _start;
    /**
     * Scroll value when drag action ends
     */
    private _end;
    /**
     * TimeStamp when drag action begins
     */
    private _startTime;
    /**
     * TimeStamp when drag action ends
     */
    private _endTime;
    /**
     * Stores 'scrollX' or 'scrollY'. This allows assign this value to a constant and change property by this[prop]
     */
    private _scrollProp;
    /**
     * Snap state
     */
    isOnSnap: boolean;
    /**
     * Stores the snap index (0 ,1 , 2, ...)
     */
    snapIndex: number;
    private _customViewport;
    _bounds: Phaser.Geom.Rectangle;
    matrix: Phaser.GameObjects.Components.TransformMatrix;
    culledObjects: Phaser.GameObjects.GameObject[];
    constructor(scene: Phaser.Scene, { x, y, width, height, start, end, wheel, drag, minSpeed, snap, snapConfig, horizontal }: ScrollConfig);
    private init;
    private resetMoving;
    /**
     * Sets scroll speed in pixels/second. Use it to control scroll with any key or button.
     * @param { numer } [speed]
     */
    setSpeed(speed?: number): void;
    private setDragEvent;
    private setWheelEvent;
    private downHandler;
    private dragHandler;
    private upHandler;
    private wheelHandler;
    private isOver;
    private clampScroll;
    update(time: any, delta: any): void;
    private checkBounds;
    private getSnapIndex;
    destroy(): void;
}
interface SnapConfig {
    /**
     * Vertical distance in pixels between snap points.
     */
    padding?: number;
    /**
     * % of space between two snap points not influenced by snap effect.\n
     */
    deadZone?: number;
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
     * Start bound of the scroll (top for vertical orientation, left for horizontal orientation)
     */
    start?: number;
    /**
     * End bound of the scroll (bottom for vertical orientation, right for horizontal orientation)
     */
    end?: number;
    wheel?: boolean;
    /**
     * Number between 0 and 1.
     * Reduces the scroll speed per game step.
     * Example: 0.5 reduces 50% scroll speed per game step.
     */
    drag?: number;
    /**
     * Bellow this speed value (pixels/second), the scroll is stopped
     */
    minSpeed?: number;
    /**
     * Does this camera use snap points?
     */
    snap?: boolean;
    /**
     * Contains snap effect parameters. Only used if snap parameter is true
     */
    snapConfig?: SnapConfig;
    /**
     * Should this camera use horizontal orientation?
     */
    horizontal?: boolean;
}
export {};
