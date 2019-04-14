class Test extends Phaser.Scene {
  constructor() {
    super('test');
  }

  create() {
    let top = this.game.config.height;
    let gameWidth = this.game.config.width;
    let centerX = gameWidth / 2;
    let marginX = 50;
    let marginY = 50;
    let paddingY = 50;
    // Rows
    let textStyle = { fontFamily: 'Arial', fontSize: 26, color: '#ffffff' };
    for (let i = 0; i < 50; i++) {
      let y = top + marginY + i * paddingY;
      this.add.text(centerX, y, `--- ${y} ---`, textStyle)
        .setOrigin(0.5);
    }

    // Guide line
    let g = this.add.graphics();
    g.lineStyle(2, 0xdd0000);
    g.lineBetween(marginX, 300, centerX - 100, 300);
    g.lineBetween(centerX + 100, 300, gameWidth - marginX, 300);

    let camera1 = new ScrollingCamera(
      this,
      0,
      0,
      gameWidth,
      600,
      {
        top: 600,
        bottom: 3025,
        wheel: true,
        snapGrid: {
          topMargin: 50,
          padding: 50
        }
      });
    this.cameras.addExisting(camera1);
  }
}
