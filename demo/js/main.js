function runGame() {
  var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game',
    backgroundColor: 0xf2f0e1,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
      default: 'arcade',
      arcade: {
        debug: false
      }
    },
    scene: [LoadScreen, Test]
  };

  new Phaser.Game(config);
}

window.onload = function () {
  runGame();
};
