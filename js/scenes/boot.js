class Boot extends Phaser.Scene {
  constructor() {
    super('boot');
  }

  create() {
    let top = this.game.config.height;
    let gameWidth = this.game.config.width;
    let centerX = gameWidth / 2;
    let marginY = 50;
    let paddingY = 50;
    // Generates rows
    let textStyle = { fontFamily: 'Arial', fontSize: 26, color: '#ffffff' };
    for (let i = 0; i < 50; i++) {
      let y = top + marginY + i * paddingY;
      this.add.text(centerX, y, `--- ${y} ---`, textStyle)
        .setOrigin(0.5);
    }

    let camera1 = new ScrollingCamera(this, 0, 0, gameWidth, 600, { top: 600, bottom: 3025, wheel: true});
    this.cameras.addExisting(camera1);
  }
}
