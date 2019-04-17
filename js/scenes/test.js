class Test extends Phaser.Scene {
  constructor() {
    super('test');
  }

  preload() {
    this.load.bitmapFont('bmf', 'assets/fonts/bmf_xolonium.png', 'assets/fonts/bmf_xolonium.xml');
  }

  init() {
    this.marginY = 50;
    this.leftMargin = 390;
    this.rightMargin = 50;
    this.paddingY = 20;
    this.actualBottomRow = this.marginY;
  }

  create() {
    this.g = this.add.graphics();

    let bmf = this.add.bitmapText(0, 0, 'bmf', 'A', 20);
    this.letterWidth = bmf.width;
    bmf.destroy();

    this.makeContent();
    this.makeGraphics();
    this.makeScrollCamera();
    this.makeUI();
  }

  makeUI() {
    let t = this;
    this.letterWidth = 12;
    this.buttonTextStyle = { fontFamily: 'Arial', fontSize: 20, color: '#ffffff' };
    this.titleTextStyle = { fontFamily: 'Arial', fontSize: 26, color: '#dd0000' };
    this.obsTextStyle = { fontFamily: 'Arial', fontSize: 20, color: '#ffffff' };

    this.addTitle('PARAMETERS', this.g);
    this.addRow('drag', 'Multiplier of scroll speed', this.camera1.drag, 0.01, 0.8, 0.99, 'drag', this.camera1, this.g);
    this.addRow('minSpeed', 'Below this speed the scroll\nstops', this.camera1.minSpeed, 1, 1, 40, 'minSpeed', this.camera1, this.g);
    this.actualBottomRow += this.paddingY;

    this.checkbox = this.add.existing(new CheckBox(this, this.leftMargin, this.actualBottomRow, { value: true })).setOrigin(0, 0);
    this.add.bitmapText(this.checkbox.x + this.checkbox.width + 20, this.checkbox.y, 'bmf', 'Enable/Disable snap scroll', 20);
    this.checkbox.on('pointerup', function () {
      if (t.checkbox.value) {
        t.camera1.enableSnap();
      } else {
        t.camera1.disableSnap();
      }
    });

    this.actualBottomRow += this.paddingY*3;

    this.add.bitmapText(this.leftMargin, this.actualBottomRow , 'bmf', 'Drag your pointer in the red rectangle or use\n'+
    'the wheel of your mouse over the rectangle.', 16);

    this.add.bitmapText(this.camera1.x, this.camera1.y + this.camera1.height + 10, 'bmf', 'ScrollCamera', 16).setTint(0xdd0000);

  }

  makeContent() {
    let top = this.game.config.height;
    let gameWidth = this.game.config.width;
    let centerX = gameWidth / 2;
    let marginY = 50;
    let paddingY = 50;
    let rowsQty = 50;
    let textStyle = { fontFamily: 'Arial', fontSize: 26, color: '#ffffff' };
    // First row
    this.add.text(centerX, top + marginY, `--- TOP ---`, textStyle)
      .setOrigin(0.5);
    // Rows
    for (let i = 1; i <= rowsQty; i++) {
      let y = top + marginY + i * paddingY;
      let str = (i < rowsQty) ? `--- ${y} ---` : `--- BOTTOM ---`;
      this.add.text(centerX, y, str, textStyle)
        .setOrigin(0.5);
    }

  }

  makeGraphics() {
    let g = this.g;
    g.lineStyle(2, 0xdd0000);
    g.strokeRect(45, 45, 310, 510);
    g.fillStyle(0xdd0000, 1);
    g.fillTriangle(80, 290, 80, 310, 120, 300);
    g.fillTriangle(320, 290, 320, 310, 280, 300);
  }

  makeScrollCamera() {
    let cameraOptions = {
      top: 600,          // Top bound of scroll
      bottom: 3175,      // Bottom bound of scroll
      wheel: true,       // Use mouse wheel? 
      snapGrid: {        // Defines snap points
        topMargin: 50,   
        padding: 50,
        deadZone: 0      // % of space between points with not influenced by snap effect (0 - 1)
      }
    };
    this.camera1 = new ScrollingCamera(
      this,
      50,
      50,
      300,
      500,
      cameraOptions
      );
    this.cameras.addExisting(this.camera1);
    this.camera1.scrollX = this.camera1.getScroll(this.game.config.width / 2, 0).x;
  }

  addPlusButton(x, y, step, limit, property, object, label) {
    let t = this;
    let plusButtonConfig = {
      fontKey: 'bmf',
      fontSize: 20,
      textColor: '0xffffee',
      buttonColor: '0xffffff',
      control: 'increase',
      object: object
    };

    let button = this.add.existing(new ButtonGenerator(this, x, y, '>', plusButtonConfig)).setOrigin(0, 0.5);
    button.step = step;
    button.limit = limit;
    button.property = property;
    button.callback = function (value) {
      label.setText(value);
    }.bind(this);
    return button;
  }

  addMinusButton(x, y, step, limit, property, object, label) {
    let t = this;
    let minusButtonConfig = {
      fontKey: 'bmf',
      fontSize: 20,
      textColor: '0xffffee',
      buttonColor: '0xffffff',
      control: 'decrease',
      object: object
    };

    let button = this.add.existing(new ButtonGenerator(this, x, y, '<', minusButtonConfig)).setOrigin(0, 0.5);
    button.step = step;
    button.limit = limit;
    button.property = property;
    button.callback = function (value) {
      label.setText(value);
    }.bind(this);
    return button;
  }

  addRow(title, content, label, step, min, max, property, object, g) {
    const t = this;
    let x = this.leftMargin;
    // Header
    let bmf1 = this.add.bitmapText(x, this.actualBottomRow, 'bmf', title, 20);
    bmf1.setTint(0xdd0000);
    // Observations
    let bmf2 = this.add.bitmapText(x, bmf1.height + bmf1.y, 'bmf', content, 16);
    // Line
    g.lineBetween(x, bmf2.height + bmf2.y, this.game.config.width - t.rightMargin, bmf2.height + bmf2.y);
    // Data label
    let dataLabel = this.add
      .bitmapText(this.game.config.width - t.rightMargin, bmf2.height + bmf2.y - 6, 'bmf', label, 20)
      .setOrigin(1, 1);
    // Minus button
    this.addMinusButton(
      this.game.config.width - t.rightMargin - 8 * this.letterWidth,
      dataLabel.y,
      step,
      min,
      property,
      object,
      dataLabel
    ).setOrigin(1, 1);
    // Plus button
    this.addPlusButton(
      this.game.config.width - t.rightMargin - 5 * this.letterWidth,
      dataLabel.y,
      step,
      max,
      property,
      object,
      dataLabel
    ).setOrigin(1, 1);

    let bottom = bmf2.height + bmf2.y + this.paddingY;

    this.actualBottomRow = bottom;
  }

  addTitle(title, g) {
    const t = this;
    let x = this.leftMargin;
    // Title
    let bmf1 = this.add.bitmapText(x, this.actualBottomRow, 'bmf', title, 24);
    bmf1.setTint(0xee0000);
    g.lineBetween(x, bmf1.y + bmf1.height, this.game.config.width - t.rightMargin, bmf1.y + bmf1.height);
    let bottom = bmf1.y + bmf1.height + this.paddingY;

    this.actualBottomRow = bottom;
  }


}
