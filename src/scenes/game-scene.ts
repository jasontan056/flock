import { Math } from "phaser";
import { getGameWidth, getGameHeight } from "../helpers";
import Boid, { ForceMultipliers } from "../objects/Boid";
import { QuadTree, Box, Point } from "js-quadtree";
import {
  Slider,
  Sizer,
} from "phaser3-rex-plugins/templates/ui/ui-components.js";
import RoundRectangle from "phaser3-rex-plugins/plugins/roundrectangle.js";

const COLOR_LIGHT = 0xa6e1fa;
const COLOR_DARK = 0x001c55;

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: "Game",
};

export class GameScene extends Phaser.Scene {
  private _goblins: Boid[] = [];
  private _quadTree: QuadTree;
  private _controlPanel: Sizer;
  private _goblinCountText: Phaser.GameObjects.Text;
  private _forceMultipliers: ForceMultipliers = {
    align: 0,
    separate: 0,
    cohesion: 0,
  };

  constructor() {
    super(sceneConfig);
  }

  public preload() {
    this.load.spritesheet("goblin", "assets/goblin_run_spritesheet.png", {
      frameWidth: 16,
      frameHeight: 16,
    });

    this.load.image("floor", "assets/floor.png");
  }

  public create() {
    this.add.tileSprite(
      0,
      0,
      getGameWidth(this) * 2,
      getGameHeight(this) * 2,
      "floor"
    );

    // Walking animation.
    this.anims.create({
      key: "walk",
      frames: this.anims.generateFrameNumbers("goblin", { start: 0, end: 5 }),
      frameRate: 10,
      repeat: -1,
    });

    this._quadTree = new QuadTree(
      new Box(0, 0, getGameWidth(this), getGameHeight(this))
    );

    const alignmentSlider = this._createSlider(
      "Alignment: ",
      (value) => (this._forceMultipliers.align = value)
    );
    const separationSlider = this._createSlider(
      "Separation: ",
      (value) => (this._forceMultipliers.separate = value)
    );
    const cohesionSlider = this._createSlider(
      "Cohesion: ",
      (value) => (this._forceMultipliers.cohesion = value)
    );

    this._goblinCountText = this.add.text(
      0,
      0,
      "Click and hold to spawn goblins!"
    );

    this._controlPanel = new Sizer(this, {
      anchor: { left: "left+10", top: "top+10" },
      align: "left",
      orientation: "y",
    });
    this._controlPanel
      .add(alignmentSlider, 0, "right")
      .add(separationSlider, 0, "right")
      .add(cohesionSlider, 0, "right")
      .add(this._goblinCountText, 0, "center");
    this._controlPanel.layout();
    this._controlPanel.setDepth(1);
    this.add.existing(this._controlPanel);
  }

  public update() {
    const pointer = this.input.activePointer;
    if (pointer.isDown) {
      const x = pointer.x;
      const y = pointer.y;

      if (!this._controlPanel.getBounds().contains(x, y)) {
        const sprite = this.add.sprite(x, y, "goblin");
        sprite.anims.load("walk");
        sprite.anims.play("walk");
        this._goblins.push(
          new Boid(
            sprite,
            getGameWidth(this),
            getGameHeight(this),
            this._quadTree,
            new Math.Vector2(x, y),
            this._forceMultipliers
          )
        );

        this._goblinCountText.text = `${this._goblins.length} Goblins`;
        this._controlPanel.layout();
      }
    }

    this._quadTree.clear();
    this._goblins.forEach((goblin) =>
      this._quadTree.insert(new Point(goblin.pos.x, goblin.pos.y, goblin))
    );
    this._goblins.forEach((goblin) => goblin.update());
  }

  private _createSlider(label, valueChangeCallback) {
    var track = new RoundRectangle(this, 0, 0, 0, 0, 6, COLOR_DARK);
    this.add.existing(track);
    var thumb = new RoundRectangle(this, 0, 0, 0, 0, 10, COLOR_LIGHT);
    this.add.existing(thumb);

    const slider = new Slider(this, {
      x: 0,
      y: 0,
      width: 200,
      height: 20,
      orientation: "x",

      track: track,
      thumb: thumb,

      valuechangeCallback: valueChangeCallback,
      space: {
        top: 4,
        bottom: 4,
      },
      input: "drag", // 'drag'|'click'
    }).layout();
    this.add.existing(slider);

    const sizer = new Sizer(this, {
      x: 0,
      y: 0,
      space: { left: 0, right: 0, top: 0, bottom: 5 },
      orientation: "x",
    });
    sizer.add(this.add.text(0, 0, label));
    sizer.add(slider, 0);
    this.add.existing(sizer);

    return sizer;
  }
}
