import { Math } from "phaser";
import { getGameWidth, getGameHeight } from "../helpers";
import Boid from "../objects/Boid";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: "Game",
};

export class GameScene extends Phaser.Scene {
  private _goblins: Boid[] = [];

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

      const sprite = this.add.sprite(x, y, "goblin");
      sprite.anims.load("walk");
      sprite.anims.play("walk");
      this._goblins.push(
        new Boid(
          sprite,
          getGameWidth(this),
          getGameHeight(this),
          new Math.Vector2(x, y)
        )
      );
    }

    for (const goblin of this._goblins) {
      goblin.update();
    }
  }
}
