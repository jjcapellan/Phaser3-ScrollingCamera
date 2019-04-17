class ButtonGenerator extends Phaser.GameObjects.Image {
  constructor(
    scene,
    x,
    y,
    text,
    {
      fontKey,
      fontSize,
      textColor,
      buttonColor,
      control,
      step,
      limit,
      object,
      property,
      callback
    }
  ) {
    super(scene, x, y);

    this.text = text;
    this.fontKey = fontKey;
    this.fontSize = fontSize;
    this.textColor = textColor;
    this.buttonColor = buttonColor;

    this.control = control; // "increase" or "decrease"
    this.step = step ? step : 1;
    this.limit = limit || 0;
    this.object = object;
    this.property = property;
    this.callback = callback;

    this.width;
    this.height;
    this.bitmapText = null;
    this.rectangle = null;
    this.padding = 10;
    this.buttonTexture;

    this.init();
  }

  init() {
    this.createBitmapText();
    this.createRectangle();
    this.createTexture();
    /*this.setInteractive(
      new Phaser.Geom.Rectangle(0, 0, this.width, this.height),
      Phaser.Geom.Rectangle.Contains
    );*/
    
    this.setTexture('rt_button');
    this.enable();
    this.setBehaviors();
    this.clean();
  }

  createBitmapText() {
    this.bitmapText = this.scene.make.bitmapText(
      {
        font: this.fontKey,
        text: this.text,
        size: this.fontSize
      },
      false
    );
    this.bitmapText.setTint(this.textColor);
  }

  createRectangle() {
    let textBounds = this.bitmapText.getTextBounds(true);
    this.width = textBounds.local.width + this.padding * 2;
    this.height = textBounds.local.height + this.padding * 2;

    let g = this.scene.make.graphics(undefined, false);
    g.fillStyle(this.buttonColor, 0.2);
    g.fillRoundedRect(0, 0, this.width, this.height, 10);

    this.rectangle = g;
  }

  createTexture() {
    let texture = this.scene.make.renderTexture(
      {
        width: this.width,
        height: this.height
      },
      false
    );

    texture.draw(this.rectangle, 0, 0);
    texture.draw(this.bitmapText, this.padding, this.padding);

    texture.saveTexture('rt_button');
  }

  disable(){
    this.disableInteractive();
    this.setTint(0xff0000);
    this.setAlpha(0.5);
  }

  enable(){
    this.setInteractive();
    this.clearTint();
    this.clearAlpha();
  }

  setBehaviors() {
    let t = this;
    this.on(
      'pointerover',
      function() {
        this.setTint(0xefe823);
      },
      this
    );
    this.on(
      'pointerout',
      function() {
        this.clearTint();
      },
      this
    );

    if (this.control) {
      this.on('pointerup', function() {
        if (t.control == 'increase') {
          t.increase();
        } else {
          t.decrease();
        }
      });
      if (this.callback) {
        this.callback(this.object[this.property]);
      }
    }
  }

  increase() {
    this.object[this.property] += this.step;
    // If the number have decimals
    if(Math.round(this.object[this.property]) != this.object[this.property]){
      this.object[this.property] = Math.round(this.object[this.property] * 100) / 100;
    }
    this.object[this.property] =
      this.object[this.property] > this.limit ? this.limit : this.object[this.property];
    if (this.callback) {
      this.callback(this.object[this.property]);
    }
  }

  decrease() {
    this.object[this.property] -= this.step;
    // If the number have decimals
    if(Math.round(this.object[this.property]) != this.object[this.property]){
      this.object[this.property] = Math.round(this.object[this.property] * 100) / 100;
    }
    this.object[this.property] =
      this.object[this.property] < this.limit ? this.limit : this.object[this.property];
    if (this.callback) {
      this.callback(this.object[this.property]);
    }
  }

  clean() {
    this.rectangle.destroy();
    this.bitmapText.destroy();
  }
}
