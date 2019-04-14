class ScrollingCamera extends Phaser.Cameras.Scene2D.Camera {
    constructor(scene, x, y, width, height, { top, bottom, pointerDrag, wheel, wheelDrag }) {
        super(x, y, width, height);
        this.top = top;
        this.wheel = wheel || false;
        this.scene = scene;
        this.bottom = bottom - this.height;
        this.rectangle = new Phaser.Geom.Rectangle(x, y, width, height);
        this.verticalSpeed = 0;
        this.pointerDrag = pointerDrag || 1;
        this.wheelDrag = wheelDrag || 1;
        this.scrollY = this.top;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;        
        this.init();
    }

    init() {
        this.setDragEvent();
        if (this.wheel) {
            this.setWheelEvent();
        }
    }

    setDrag(value) {
        this.pointerDrag = value;
        Phaser.Math.Clamp(this.pointerDrag, 0.05, 1);
    }

    setDragEvent() {
        this.scene.input.on('pointermove', this.dragHandler, this);
    }

    setWheelEvent() {
        window.addEventListener('wheel', this.wheelHandler.bind(this));
    }

    dragHandler(pointer) {
        if (pointer.isDown && this.isOver(pointer)) {
            this.scrollY -= (pointer.position.y - pointer.prevPosition.y) * this.pointerDrag;
            this.clampScroll();
        }
    }

    wheelHandler(event) {
        if (this.isOver(this.scene.input.activePointer)) {
            this.scrollY += event.deltaY * this.wheelDrag;
            this.clampScroll();
        }
    }

    isOver(pointer) {
        return this.rectangle.contains(pointer.x, pointer.y);
    }

    clampScroll() {
        this.scrollY = Phaser.Math.Clamp(this.scrollY, this.top, this.bottom);
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