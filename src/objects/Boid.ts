import { Math, GameObjects } from "phaser";
import { QuadTree, Circle } from "js-quadtree";

const MAX_ACC = 1;
const MAX_VEL = 4;

const ALIGN_PERCEPTION_DIST = 50;
const SEPERATION_PERCEPTION_DIST = 50;
const COHESION_PERCEPTION_DIST = 100;

const ALIGN_MULT = 1;
const SEPARATION_MULT = 1;
const COHESION_MULT = 1;

export default class Boid {
  private _sprite: GameObjects.Sprite;
  private _width: number;
  private _height: number;
  private _quadTree: QuadTree;
  private _pos: Math.Vector2;
  private _vel: Math.Vector2 = Math.RandomXY(new Math.Vector2());
  private _acc: Math.Vector2 = new Math.Vector2();

  constructor(
    sprite: GameObjects.Sprite,
    width: number,
    height: number,
    quadTree: QuadTree,
    pos: Math.Vector2
  ) {
    this._sprite = sprite;
    this._width = width;
    this._height = height;
    this._quadTree = quadTree;
    this._pos = pos;
  }

  get pos(): Math.Vector2 {
    return this._pos;
  }

  get vel(): Math.Vector2 {
    return this._vel;
  }

  // Ensure that boid stays onscreen.
  private _edges() {
    if (this._pos.x > this._width) {
      this._pos.x = 0;
    } else if (this._pos.x < 0) {
      this._pos.x = this._width;
    }
    if (this._pos.y > this._height) {
      this._pos.y = 0;
    } else if (this._pos.y < 0) {
      this._pos.y = this._height;
    }
  }

  private _align(): Math.Vector2 {
    const nearby = this._quadTree.query(
      new Circle(this._pos.x, this._pos.y, ALIGN_PERCEPTION_DIST)
    );

    const alignAcc = new Math.Vector2();
    let total = 0;
    for (const other of nearby) {
      if (other.data !== this) {
        alignAcc.add(other.data.vel);
        total++;
      }
    }

    if (total > 0) {
      alignAcc.scale(1 / total);
      alignAcc.setLength(MAX_VEL);
      alignAcc.subtract(this._vel);
      alignAcc.limit(MAX_ACC);
    }

    return alignAcc;
  }

  private _separation(): Math.Vector2 {
    const nearby = this._quadTree.query(
      new Circle(this._pos.x, this._pos.y, SEPERATION_PERCEPTION_DIST)
    );

    const separateAcc = new Math.Vector2();
    let total = 0;
    for (const other of nearby) {
      if (other.data !== this) {
        const diff = this._pos.clone();
        diff.subtract(other.data.pos);

        const dist = this._pos.distanceSq(other.data.pos);
        diff.scale(1 / dist);
        separateAcc.add(diff);
        total++;
      }
    }

    if (total > 0) {
      separateAcc.scale(1 / total);
      separateAcc.setLength(MAX_VEL);
      separateAcc.subtract(this._vel);
      separateAcc.limit(MAX_ACC);
    }

    return separateAcc;
  }

  private _cohesion(): Math.Vector2 {
    const nearby = this._quadTree.query(
      new Circle(this._pos.x, this._pos.y, COHESION_PERCEPTION_DIST)
    );

    const cohesionAcc = new Math.Vector2();
    let total = 0;
    for (const other of nearby) {
      if (other.data !== this) {
        cohesionAcc.add(other.data.pos);
        total++;
      }
    }

    if (total > 0) {
      cohesionAcc.scale(1 / total);
      cohesionAcc.subtract(this._pos);
      cohesionAcc.setLength(MAX_VEL);
      cohesionAcc.subtract(this._vel);
      cohesionAcc.limit(MAX_ACC);
    }

    return cohesionAcc;
  }

  private _flock() {
    const alignAcc = this._align().scale(ALIGN_MULT);
    const separateAcc = this._separation().scale(SEPARATION_MULT);
    const cohesionAcc = this._cohesion().scale(COHESION_MULT);

    this._acc.add(alignAcc);
    this._acc.add(separateAcc);
    this._acc.add(cohesionAcc);
  }

  public update() {
    this._flock();

    this._acc.limit(MAX_ACC);
    this._vel.add(this._acc);
    this._vel.limit(MAX_VEL);
    this._pos.add(this._vel);
    this._acc.scale(0);
    this._edges();

    this._sprite.setX(this._pos.x);
    this._sprite.setY(this._pos.y);
  }
}
