/// <reference types="phaser" />
interface SnapConfig {
    topMargin?: number;
    padding?: number;
    deadZone?: number;
}
interface ScrollConfig {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    top?: number;
    bottom?: number;
    wheel?: boolean;
    drag?: number;
    minSpeed?: number;
    snap?: boolean;
    snapConfig?: SnapConfig;
}
/**
 * This type of Phaser camera can be useful to build user interfaces that require scrolling,
 * but without needing scroll bars.
 * The scroll is done by dragging the pointer or using the mouse wheel.
 * @class
 * @extends Phaser.Cameras.Scene2D.Camera
 */
export default class ScrollingCamera extends Phaser.Cameras.Scene2D.Camera {
    top: number;
    bottom: number;
    wheel: boolean;
    drag: number;
    minSpeed: number;
    snap: boolean;
    snapGrid: SnapConfig;
    matrix: Phaser.GameObjects.Components.TransformMatrix;
    culledObjects: Phaser.GameObjects.GameObject[];
    private moving;
    private _rectangle;
    private _speed;
    private _startY;
    private _endY;
    private _startTime;
    private _endTime;
    _customViewport: boolean;
    _bounds: Phaser.Geom.Rectangle;
    constructor(scene: Phaser.Scene, { x, y, width, height, top, bottom, wheel, drag, minSpeed, snap, snapConfig }: ScrollConfig);
    init(): void;
    resetMoving(): void;
    /**
     * Sets scroll speed. Use it to control scroll with any key or button.
     * @param  {number} speed Speed in pixels per second.
     * @memberof ScrollingCamera
     */
    setSpeed(speed?: number): void;
    setDragEvent(): void;
    setWheelEvent(): void;
    downHandler(): void;
    dragHandler(pointer: any): void;
    upHandler(): void;
    wheelHandler(event: any): void;
    isOver(pointer: any): boolean;
    clampScroll(): void;
    update(time: any, delta: any): void;
    destroy(): void;
}
export {};
/**
 * Contains snap effect parameters
 * @typedef  {object} snapConfig
 * @property  {number} [topMargin = 0] Position y of the first snap point from the top.
 * @property  {number} [padding = 20] Vertical distance in pixels between snap points.
 * @property  {number} [deadZone = 0] % of space between two snap points not influenced by snap effect.\n
 * Example: 0.2 means 20% of middle space between two snap points is free of snap effect.
 */
/**
 * Contains all cameraScroll parameters
 * @typedef  {object} scrollConfig
 * @property  {number} [x = 0] The x position of this camera
 * @property  {number} [y = 0] The y position of this camera
 * @property  {number} [width = Phaser.game.config.width] The width of this camera
 * @property  {number} [height = Phaser.game.config.height] The height of this camera
 * @property  {number} [top = 0] Upper bound of the scroll
 * @property  {number} [bottom = 5000] Lower bound of the scroll
 * @property  {bool} [wheel = false] Does this camera use the mouse wheel?
 * @property  {number} [drag = 0.95] Number between 0 and 1.\n
 * Reduces the scroll speed per game step.\n
 * Example: 0.5 reduces 50% scroll speed per game step
 * @property  {number} [minSpeed] Bellow this speed value (pixels/second), the scroll is stopped
 * @property  {bool} [snap = false] Does this camera use snap points?
 * @property  {snapConfig} [snapConfig] Contains snap effect parameters. Only used if snap parameter is true
 */ 
