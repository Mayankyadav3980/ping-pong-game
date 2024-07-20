import Ball from "./Ball.js";
import Paddle from "./Paddle.js";

const ball = new Ball(document.getElementById("ball"));
const rod1 = new Paddle(document.getElementById("top"));
const rod2 = new Paddle(document.getElementById("bottom"));
let rod1Score = 0;
let rod2Score = 0;
localStorage.setItem("maxScore", "0");

let lastTime;
let id;

//function to update the position of the ball
function update(time) {
  if (lastTime != null) {
    const delta = time - lastTime;
    ball.update(delta, [rod1.rect(), rod2.rect()]);

    if (isLose()) handleLose();
  }

  lastTime = time;
  id = window.requestAnimationFrame(update);
}

function isLose() {
  const rect = ball.rect();
  return rect.top <= 0 || rect.bottom >= window.innerHeight;
}

// function to handle score when any paddle misses the ball
function handleLose() {
  const rect = ball.rect();
  let maxScore = localStorage.getItem("maxScore");

  if (rect.top <= 0) {
    rod2Score = rod2Score + 1;
    if (maxScore < rod2Score) {
      localStorage.setItem("maxScore", rod2Score);
    }
  } else {
    rod1Score += 1;
    if (maxScore < rod1Score) {
      localStorage.setItem("maxScore", rod1Score);
    }
  }

  ball.reset();
  rod1.reset();
  rod2.reset();
}

document.addEventListener("keypress", handlePress);

// function to detect when either 'a' or 'd' key is pressed, and moves rodes accordingly
function handlePress(e) {
  let rect = rod1.rect();
  if (e.key == "a") {
    if (rect.left > 5) {
      rod1.position = rod1.position - 5;
      rod2.position = rod2.position - 5;
    }
  }
  if (e.key == "d") {
    if (rect.right + 5 < window.innerWidth) {
      rod1.position = rod1.position + 5;
      rod2.position = rod2.position + 5;
    }
  }
}

document.addEventListener("keypress", handleStart);

// when ever the 'Enter' key is pressed, this function computes what is the current score & what is the max score till yet.
function handleStart(e) {
  let max = localStorage.getItem("maxScore");
  if (e.key == "Enter") {
    if (max == 0) {
      alert("This is your first game");
    } else if (rod1Score > rod2Score) {
      alert(`Rod 1 wins with a score of ${rod1Score}. Max score is ${max}`);
    } else if (rod1Score < rod2Score) {
      alert(`Rod 2 wins with a score of ${rod2Score}. Max score is ${max}`);
    } else {
      alert(`Both have equal scores. Max score is ${max}`);
    }
    window.cancelAnimationFrame(id);
    rod1Score = 0;
    rod2Score = 0;
    window.requestAnimationFrame(update);
  }
}
