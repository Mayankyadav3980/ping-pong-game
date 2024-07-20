const INITIAL_VELOCITY = 0.03;
const VELOCITY_INCREASE = 0.000001;

export default class Ball {
  constructor(ballElem) {
    this.ballElem = ballElem;
    this.reset();
  }

  get x() {
    return parseFloat(getComputedStyle(this.ballElem).getPropertyValue("--x"));
  }

  set x(value) {
    this.ballElem.style.setProperty("--x", value);
  }

  get y() {
    return parseFloat(getComputedStyle(this.ballElem).getPropertyValue("--y"));
  }

  set y(value) {
    this.ballElem.style.setProperty("--y", value);
  }

  rect() {
    return this.ballElem.getBoundingClientRect();
  }

  // function to reset the position of ball to the center, before a new game starts.
  reset() {
    this.x = 50;
    this.y = 50;
    this.direction = { y: 0 };
    while (
      Math.abs(this.direction.y) <= 0.2 ||
      Math.abs(this.direction.y) >= 0.9
    ) {
      const heading = randomNumberBetween(0, 2 * Math.PI);
      this.direction = { y: Math.cos(heading), x: Math.sin(heading) };
    }
    this.velocity = INITIAL_VELOCITY;
  }

  //function updates the direction of ball, & increases velocity of ball gradually.
  update(delta, paddleReacts) {
    this.x += this.direction.x * this.velocity * delta;
    this.y += this.direction.y * this.velocity * delta;
    this.velocity += VELOCITY_INCREASE * delta;
    const rect = this.rect();

    if (rect.left <= 0 || rect.right >= window.innerWidth) {
      this.direction.x *= -1;
    }

    if (paddleReacts.some((r) => isCollision(r, rect))) {
      this.direction.y *= -1;
    }
  }
}

function randomNumberBetween(min, max) {
  return Math.random() * (max - min) + min;
}

// function to detect the collision between ball and paddles
function isCollision(rect1, rect2) {
  return (
    rect1.left <= rect2.right &&
    rect1.right >= rect2.left &&
    rect1.top <= rect2.bottom &&
    rect1.bottom >= rect2.top
  );
}
