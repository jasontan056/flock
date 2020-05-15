class Boid {
  constructor() {}

  // Ensure that boid stays onscreen.
  private edges() {}

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

  show() {}
}
