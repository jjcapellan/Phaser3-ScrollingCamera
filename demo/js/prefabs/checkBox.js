class CheckBox extends Phaser.GameObjects.Image {
  /**
   * Creates an instance of CheckBox.
   * @param  {Phaser.Scene} scene 
   * @param  {number} x 
   * @param  {number} y 
   * @param  {object} options
   * @param  {number} [options.size = 20]
   * @param  {number} [options.color = 0xdd0000]
   * @param  {number} [options.lineWidth = 3]
   * @param  {boolean} [options.value = false] Initial value of the checkbox. (true/false)
   */
  constructor(scene, x, y, {size, color, lineWidth, value} = {}) {
    super(scene, x, y);
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.size = size || 20
    this.color = color || 0xdd0000;
    this.lineWidth = lineWidth || 3;
    this.value = value || false;
    this.init();
  }

  init() {
    this.makeOnTexture();
    this.makeOffTexture();
    this.setInteractive();
    this.resetTexture();
    this.setBehavior();
  }

  makeOnTexture() {
    let g = this.scene.add.graphics();
    let s = this.size;   
    g.fillStyle(this.color,1);
    g.fillRect(0, 0, s, s);
    g.generateTexture('checkBoxOn', s, s);
    g.setVisible(false);
    g.destroy();
  }

  makeOffTexture() {
    let g = this.scene.add.graphics();   
    let s = this.size; 
    g.lineStyle( this.lineWidth, this.color);
    g.strokeRect(0, 0, s, s);
    g.generateTexture('checkBoxOff', s, s);
    g.setVisible(false);
    g.destroy();
  }

  setBehavior() {
    this.on(
      'pointerup',
      function(){
        this.value = !this.value;
        this.resetTexture();
      },
      this
    );
  }

  resetTexture() {
    if (this.value) {
      this.setTexture('checkBoxOn');
    } else {
      this.setTexture('checkBoxOff');
    }
  }
}
