class LoadScreen extends Phaser.Scene {
    constructor() {
        super('loadScreen');
    }

    preload() {
        
        this.text_loading = this.add.text(400, 300, 'Loading ...');

        this.load.on('complete', function () {
            this.scene.start('test');
        }, this);

        /*
        Load all your assets here.
        */
        this.load.atlas('atlas', './demo/assets/scrolling-camera-atlas.png', './demo/assets/atlas.json');


        this.load.on('progress', this.updateText, this);

    }

    updateText(progress) {
        this.text_loading.text = `Loading ... ${Math.round(progress * 100)}%`;
    }
}