import { Math } from "phaser";
import { getGameWidth, getGameHeight } from "../helpers";
import Boid from "../objects/Boid";
import { QuadTree, Box, Point } from "js-quadtree";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: "Game",
};

export class GameScene extends Phaser.Scene {
  private _goblins: Boid[] = [];
  private _quadTree: QuadTree;

  constructor() {
    super(sceneConfig);

    this._quadTree = new QuadTree(
      new Box(0, 0, getGameWidth(this), getGameHeight(this))
    );
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
          this._quadTree,
          new Math.Vector2(x, y)
        )
      );
    }

    this._quadTree.clear();
    this._goblins.forEach((goblin) =>
      this._quadTree.insert(new Point(goblin.pos.x, goblin.pos.y, goblin))
    );
    this._goblins.forEach((goblin) => goblin.update());
  }
}
