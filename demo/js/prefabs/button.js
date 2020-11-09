class Button extends Phaser.GameObjects.Image {
    constructor(scene, x, y, texture, frameOff, frameOn, startOn = false) {
        super(scene, x, y, texture);

        this.frameOff = frameOff;
        this.frameOn = frameOn;

        if (startOn) {
            this.pressed = true;
            this.setFrame(frameOn, true);
        } else {
            this.presed = false;
            this.setFrame(frameOff, true);
        }

        this.scene.add.existing(this);

        this.init();
    }

    init() {
        this.setOrigin(0);
        this.setInteractive();
    }

    switchState() {
        this.pressed = !this.pressed;
        if (this.pressed) {
            this.setFrame(this.frameOn, true);
        } else {
            this.setFrame(this.frameOff, true);
        }
    }


}