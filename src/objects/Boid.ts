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

  private _separation() {
    // Find boids within perception radius.
    // Get vector pointing from other position and this position.
    // Divide by something related to distance to make separation force inversely correlated
    //   with distance.
    // Get average of all of these.
    // Set magnitude of steering velocity to max.
    // Get difference between desired steering velocity and current velocity.
    // Limit to max force.
  }

  private _cohesion() {
    // Find boids within perception radius.
    // Get average position of nearby boids.
    // Steer towards that average position (curPos - avgPos)
    // Set magnitude of steering velocity to max.
    // Get difference between desired steering velocity and current velocity.
    // Limit to max force.
  }

  private _flock() {
    const alignAcc = this._align().scale(ALIGN_MULT);

    this._acc.add(alignAcc);
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
