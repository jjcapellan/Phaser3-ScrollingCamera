class Test extends Phaser.Scene {
  constructor() {
    super('test');
  }

  create() {
    this.makeContent();
    this.makeGraphics();
    this.makeScrollCamera();
  }

  makeContent() {
    let top = this.game.config.height;
    let gameWidth = this.game.config.width;
    let centerX = gameWidth / 2;
    let marginY = 50;
    let paddingY = 50;
    let rowsQty = 50;
    // Rows
    let textStyle = { fontFamily: 'Arial', fontSize: 26, color: '#ffffff' };
    for (let i = 0; i < rowsQty; i++) {
      let y = top + marginY + i * paddingY;
      this.add.text(centerX, y, `--- ${y} ---`, textStyle)
        .setOrigin(0.5);
    }

  }

  makeGraphics() {
    let g = this.add.graphics();
    g.lineStyle(2, 0xdd0000);
    g.strokeRect(45, 45, 310, 510);
    g.fillStyle(0xdd0000, 1);
    g.fillTriangle(80, 290, 80, 310, 120, 300);
    g.fillTriangle(320, 290, 320, 310, 280, 300);
  }

  makeScrollCamera() {
    let camera1 = new ScrollingCamera(
      this,
      50,
      50,
      300,
      500,
      {
        top: 600,
        bottom: 3025,
        wheel: true
      });
    this.cameras.addExisting(camera1);
    camera1.scrollX = camera1.getScroll(this.game.config.width/2, 0).x;
  }


}
