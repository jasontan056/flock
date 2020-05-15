import { Input } from "phaser";
import { getGameWidth, getGameHeight } from "../helpers";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: "Game",
};

export class GameScene extends Phaser.Scene {
  private goblins = [];

  constructor() {
    super(sceneConfig);
  }

  public preload() {
    this.load.spritesheet("goblin", "assets/goblin_run_spritesheet.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
  }

  public create() {
    // Walking animation.
    this.anims.create({
      key: "walk",
      frames: this.anims.generateFrameNumbers("goblin", { start: 0, end: 5 }),
      frameRate: 10,
      repeat: -1,
    });
  }

  public update() {
    const pointer = this.input.activePointer;
    if (pointer.isDown) {
      const x = pointer.x;
      const y = pointer.y;

      const goblin = this.add.sprite(x, y, "goblin");
      goblin.anims.load("walk");
      goblin.anims.play("walk");
      this.goblins.push(goblin);
    }
  }
}
