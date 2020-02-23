
/**
 * @fileoverview ScrollingCamera extends the class Phaser.Cameras.Scene2D.Camera of Phaser 3 framework,
 * adding the capacity of vertical scrolling by dragging or using the mouse wheel.
 * @author       Juan Jose Capellan <soycape@hotmail.com>
 * @copyright    2019 Juan Jose Capellan
 * @license      {@link https://github.com/jjcapellan/Phaser3-ScrollingCamera/blob/master/LICENSE | MIT license}
 * @version      1.0.2
 */

/**
 * This type of Phaser camera can be useful to build user interfaces that require scrolling,
 * but without needing scroll bars.
 * The scroll is done by dragging the pointer or using the mouse wheel.
 * @class
 * @extends Phaser.Cameras.Scene2D.Camera
 */
class ScrollingCamera extends Phaser.Cameras.Scene2D.Camera {
    /**
     * Creates an instance of ScrollingCamera.
     * @param  {Phaser.Scene} scene 
     * @param  {scrollConfig} scrollConfig Contains scroll parameters 
     * @memberof ScrollingCamera
     */
    constructor(
        scene,
        {
            x = 0,
            y = 0,
            width,
            height,
            top = 0,
            bottom = 5000,
            wheel = false,
            drag = 0.95,
            minSpeed = 4,
            snap = false,
            snapConfig = {}
        }
    ) {
        super(x, y, width, height);
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.width = width || this.scene.game.config.width;
        this.height = height || this.scene.game.config.height;

        /**
         * Upper bound of the scroll
         * @type  {number}
         * @public
         */
        this.top = top;

        /**
         * Lower bound of the scroll
         * @type  {number}
         * @public
         */
        this.bottom = bottom - this.height;

        /**
         * Does this camera use the mouse wheel?
         * @type  {bool}
         * @public
         */
        this.wheel = wheel;

        /**
         * Number between 0 and 1.\n
         * Reduces the scroll speed per game step.\n
         * Example: 0.5 reduces 50% scroll speed per game step.
         * @type  {number}
         * @public
         */

        this.drag = drag;
        /**
         * Bellow this speed value (pixels/second), the scroll is stopped.
         * @type  {number}
         * @public
         */
        this.minSpeed = minSpeed;

        /**
         * Does this camera use snap points?
         * @type  {bool}
         * @public
         */
        this.snap = snap;

        /**
         * Contains snap effect parameters. Only used if snap parameter is true
         * @type  {snapConfig}
         * @public
         */
        this.snapGrid = snapConfig;

        /**
         * Determines if draging is active. Avoids residual movement after stop the scroll with the pointer.
         * Internal use.
         * @type {bool}
         * @private
         */
        this.moving = false;

        this.snapGrid.topMargin = (snapConfig.topMargin === undefined) ? 0 : snapConfig.topMargin;
        this.snapGrid.padding = snapConfig.padding || 20;
        this.snapGrid.deadZone = (snapConfig.deadZone === undefined) ? 0.4 : snapConfig.deadZone;

        this.init();
    }

    init() {
        this.scrollY = this.top || this.y;
        this._rectangle = new Phaser.Geom.Rectangle(this.x, this.y, this.width, this.height);
        // Vertical speed in pixels per second
        this._speed = 0;
        // scrollY value when drag action begins
        this._startY = this.scrollY;
        // scrollY value when drag action ends
        this._endY = this.scrollY;
        // timeStamp when drag action begins
        this._startTime = 0;
        // timeStamp when drag action ends
        this._endTime = 0;
        //// Sets events
        this.setDragEvent();
        if (this.wheel) {
            this.setWheelEvent();
        }
                
        this.scene.time.addEvent({ delay: 500, callback: this.resetMoving, callbackScope: this, loop: true });

        this.scene.cameras.addExisting(this);
    }

    resetMoving(){
        this.moving = false;
    }

    /**
     * Sets scroll speed. Use it to control scroll with any key or button.
     * @param  {number} speed Speed in pixels per second.
     * @memberof ScrollingCamera
     */
    setSpeed(speed) {
        let t = this;
        if (typeof speed != 'number') {
            let distance = t._endY - t._startY; // pixels
            let duration = (t._endTime - t._startTime) / 1000; //seconds
            this._speed = distance / duration; // pixels/second
        } else {
            this._speed = speed;
        }
    }

    setDragEvent() {
        this.scene.input.on('pointermove', this.dragHandler, this);
        this.scene.input.on('pointerup', this.upHandler, this);
        this.scene.input.on('pointerdown', this.downHandler, this);
    }

    setWheelEvent() {
        window.addEventListener('wheel', this.wheelHandler.bind(this));
    }

    downHandler() {
        this._speed = 0;
        this._startY = this.scrollY;
        this._startTime = performance.now();
    }

    dragHandler(pointer) {
        if (pointer.isDown && this.isOver(pointer)) {
            this.startY = this.scrollY;
            this.scrollY -= (pointer.position.y - pointer.prevPosition.y);
            this.moving = true;
        }
    }

    upHandler() {
        this._endY = this.scrollY;
        this._endTime = performance.now();
        this.speed = 0;
        if(this.moving){
        this.setSpeed();
        }
    }

    wheelHandler(event) {
        if (this.isOver(this.scene.input.activePointer)) {
            this.scrollY += event.deltaY;
        }
    }

    isOver(pointer) {
        return this._rectangle.contains(pointer.x, pointer.y);
    }

    clampScroll() {
        this.scrollY = Phaser.Math.Clamp(this.scrollY, this.top, this.bottom);
        this._endY = this.scrollY;
    }

    update(time, delta) {
        this.scrollY += this._speed * (delta / 1000);
        this._speed *= this.drag;
        if (Math.abs(this._speed) < this.minSpeed) {
            this._speed = 0;
            if (this.snap && !this.scene.input.activePointer.isDown) {
                let snapTop = this.top + this.snapGrid.topMargin;
                let snapPosition = this.scrollY - snapTop;
                let gap = this.snapGrid.padding;
                let gapRatio = snapPosition / gap;
                let gapRatioRemain = gapRatio % 1;
                if (Math.abs(0.5 - gapRatioRemain) >= this.snapGrid.deadZone / 2) {
                    this.scrollY = snapTop + Math.round(gapRatio) * gap;
                }
            }
        }
        this.clampScroll();

    }

    destroy() {
        this.emit(Events.DESTROY, this);
        window.removeEventListener('wheel', this.wheelHandler);
        this.removeAllListeners();
        this.matrix.destroy();
        this.culledObjects = [];
        if (this._customViewport) {
            //  We're turning off a custom viewport for this Camera
            this.sceneManager.customViewports--;
        }
        this._bounds = null;
        this.scene = null;
        this.scaleManager = null;
        this.sceneManager = null;

    }
}

// ************************ TYPE DEFINITIONS *************************************
// *******************************************************************************

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