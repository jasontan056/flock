import { Input } from 'phaser';
import { getGameWidth, getGameHeight } from '../helpers';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Game',
};

export class GameScene extends Phaser.Scene {
  constructor() {
    super(sceneConfig);
  }

  public preload() {
    this.load.spritesheet('goblin', 'assets/goblin_run_spritesheet.png', { frameWidth: 16, frameHeight: 16 });
  }

  public create() {
    const goblin = this.add.sprite(400, 300, 'goblin').setScale(2);
    goblin.setOrigin(.5);
    const goblinWalk = this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNumbers('goblin', { start: 0, end: 5 }),
      frameRate: 10,
      repeat: -1
    })
    goblin.anims.load('walk');
    goblin.anims.play('walk');

    //goblin.scaleX *= -1;
  }

  public update() {}
}
