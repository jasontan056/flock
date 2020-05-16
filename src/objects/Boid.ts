import { Math, GameObjects } from "phaser";

export default class Boid {
  private _sprite: GameObjects.Sprite;
  private _width: number;
  private _height: number;
  private _pos: Math.Vector2;
  private _vel: Math.Vector2 = Math.RandomXY(new Math.Vector2());
  private _acc: Math.Vector2 = new Math.Vector2();
  private _maxForce = 1;
  private _maxSpeed = 4;

  constructor(
    sprite: GameObjects.Sprite,
    width: number,
    height: number,
    pos: Math.Vector2
  ) {
    this._width = width;
    this._height = height;
    this._sprite = sprite;
    this._pos = pos;
  }

  // Ensure that boid stays onscreen.
  private edges() {
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

  private align() {
    // Find boids within perception radius.
    // Find average velocity of nearby boids.
    // Set magnitude of steering velocity to max.
    // Get difference between desired steering velocity and current velocity.
    // Limit to max force.
  }

  private separation() {
    // Find boids within perception radius.
    // Get vector pointing from other position and this position.
    // Divide by something related to distance to make separation force inversely correlated
    //   with distance.
    // Get average of all of these.
    // Set magnitude of steering velocity to max.
    // Get difference between desired steering velocity and current velocity.
    // Limit to max force.
  }

  private cohesion() {
    // Find boids within perception radius.
    // Get average position of nearby boids.
    // Steer towards that average position (curPos - avgPos)
    // Set magnitude of steering velocity to max.
    // Get difference between desired steering velocity and current velocity.
    // Limit to max force.
  }

  private flock() {
    // Call align, cohesion, and separation and add up all their foces with some weights.
  }

  public update() {
    this.edges();
    this.flock();
    // Calc position, velocity.
    // Limit velicity.
    // Clear out acceleration.
  }
}
