class Boot extends Phaser.Scene {
  constructor() {
    super('boot');
  }

  create() {
    let top = this.game.config.height;
    let gameWidth = this.game.config.width;
    let centerX = gameWidth / 2;
    let marginY = 50;
    let marginX = 40;
    let paddingY = 50;
    // Generates rows
    let g = this.add.graphics();
    let textStyle = { fontFamily: 'Arial', fontSize: 26, color: '#ffffff' };
    g.lineStyle(4, 0xdd0000);
    for (let i = 0; i < 50; i++) {
      let y = top + marginY + i * paddingY;
      g.lineBetween(marginX, y, gameWidth / 3, y);
      g.lineBetween(gameWidth - marginX - gameWidth / 3, y, gameWidth - marginX, y);
      this.add.text(centerX, y, `${y}`, textStyle)
        .setOrigin(0.5);
    }

    let camera1 = new ScrollingCamera(this, 0, 0, gameWidth / 2, 300, { top: 600, bottom: 1525, wheel: true, wheelDrag: 0.2 });
    let camera2 = new ScrollingCamera(this, gameWidth / 2, 300, gameWidth / 2, 300, { top: 1525, bottom: 3025, wheel: true, wheelDrag: 0.2 });
    this.cameras.addExisting(camera1);
    this.cameras.addExisting(camera2);

  }
}
