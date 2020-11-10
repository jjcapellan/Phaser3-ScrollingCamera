class Test extends Phaser.Scene {
  constructor() {
    super('test');
  }

  create() {

    //// Images

    const contentCamera1 = this.add.image(60,100,'atlas','content').setOrigin(0);
    const shade1 = this.add.image(60 - 20 ,100 - 20, 'atlas','horizontal-shade').setOrigin(0,1).setAngle(90);

    const contentCamera2 = this.add.image(300 ,600-60,'atlas','content').setOrigin(0).setAngle(-90);
    const shade2 = this.add.image(300 - 20,600-60, 'atlas','horizontal-shade').setOrigin(0,1);

    const contentCamera3 = this.add.image(540, 140, 'atlas', 'drag').setOrigin(0);
    const shade3 = this.add.image(540 - 20, 140 - 20, 'atlas', 'param-shade').setOrigin(0);

    const contentCamera4 = this.add.image(540, 220, 'atlas', 'minspeed').setOrigin(0);
    const shade4 = this.add.image(540 - 20, 220 -20, 'atlas', 'param-shade').setOrigin(0);
    

    this.add.image(200, 600 - 60 - 40, 'atlas', 'value-background').setOrigin(0,1);
    this.txtValue = this.add.text(200 + 40, 600 - 60 - 40 -45 + 23, '--', {color: '#000000'}).setOrigin(0.5,0.5);
    this.add.image(200 - 20, 600 - 60 - 40, 'atlas', 'value-shade').setOrigin(0,1);
    
    const body = this.add.image(0,0,'atlas','body').setOrigin(0);

    // Button

    this.button = new Button(this, 475, 350, 'atlas', 'bt-snap-off', 'bt-snap-on', true);
    this.setButton();
    

    //// Scrolling cameras

    this.setCamera1();
    this.camera1.ignore([body, shade1]);

    this.setCamera2();
    this.camera2.ignore([body, shade2]);

    this.setCamera3();
    this.camera3.ignore([body, shade3]);

    this.setCamera4();
    this.camera4.ignore([body, shade4]);

    this.setCamerasEvents();
    // Brings main camera to top
    this.cameras.cameras.push(this.cameras.cameras.shift());

    // Not necesary if the camera contents is out of screen
    this.cameras.main.ignore([contentCamera1, contentCamera2, contentCamera3, contentCamera4]);
    
  }

  setButton(){
    this.button.on('pointerdown', () => {
      this.button.switchState();
      if(this.button.pressed){
        this.camera2.snap.enable = true;
      } else {
        this.camera2.snap.enable = false;
        this.txtValue.setText('--');
      }
    });
  }

  setCamerasEvents(){
    function getValue(snapIndex, initialValue, increment){
      return snapIndex * increment + initialValue;
    }
    this.camera3.on('snap', (snapIndex) => {
      const drag = getValue(snapIndex, 0.95, -0.05);
      this.camera1.drag = drag;
      this.camera2.drag = drag;
    });
    this.camera4.on('snap', (snapIndex) => {
      const minSpeed = getValue(snapIndex, 3, 1);
      this.camera2.minSpeed = minSpeed;
    });
    this.camera2.on('snap', (snapIndex) => {
      this.txtValue.text = getValue(snapIndex, 830, 60);
    });
  }

  setCamera1(){
    const config = {
      x: 60,
      y: 100,
      width: 120,
      height: 450,
      contentBounds: {
        x: 60,
        y: 100,
        height: 1120
      }
    }

    this.camera1 = new ScrollingCamera(this, config);

  }

  setCamera2(){
    const config = {
      x: 300,
      y: 600 - 60 - 120,
      width: 450,
      height: 120,
      contentBounds: {
        x: 300,
        y: 600 - 60 - 120,
        width: 1120
      },
      wheel: true,
      snap: {
        enable: true,
        padding: 60
      },
      horizontal: true
    }

    this.camera2 = new ScrollingCamera(this, config);
  }

  // drag values
  setCamera3(){
    const config = {
      x: 540,
      y: 140,
      width: 200,
      height: 45,
      contentBounds: {
        x: 540,
        y: 140,
        width: 800
      },
      snap: {
        enable: true,
        padding: 80
      },
      horizontal: true
    }

    this.camera3 = new ScrollingCamera(this, config);
  }

  // minSpeed values
  setCamera4(){
    const config = {
      x: 540,
      y: 220,
      width: 200,
      height: 45,
      contentBounds: {
        x: 540,
        y: 220,
        width: 800
      },
      snap: {
        enable: true,
        padding: 40
      },
      horizontal: true
    }

    this.camera4 = new ScrollingCamera(this, config);
  }

  


}
