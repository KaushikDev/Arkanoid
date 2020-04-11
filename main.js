let game = document.querySelector(".game");
let gameModal = document.querySelector(".game-modal");
let gameModal_h1 = document.querySelector(".game-modal__h1");
let gameModal_p = document.querySelector(".game-modal__p");
let gameModal_btn = document.querySelector(".game-modal__btn");

let cnv = document.querySelector("#myCanvas");
let ctx = cnv.getContext("2d");
let cnvWidth = (cnv.width = window.innerWidth); 
let cnvHeight = (cnv.height = window.innerHeight); 

let raf;
let toggle_raf = false;
let game_state = "new";

let ballRadius = 10;
let x = cnvWidth / 2;
let y = cnvHeight - 30;
let dx = 5;
let dy = -5;
let paddleHeight = 10;
let paddleWidth = cnvWidth / 4;
let paddleX = (cnvWidth - paddleWidth) / 2;
let paddleOffsetBottom = 10;
let rightPressed = false;
let leftPressed = false;

let brickWidth = 60;
let brickHeight = 20;
let brickPadding = 5;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;
let brickRowCount = 10;
let brickColumnCount = Math.floor(cnvWidth / (brickWidth + brickPadding));
let score = 0;
let score_multiplier = 5;
let max_score = brickRowCount * brickColumnCount * score_multiplier;
let lives = 3;

let soundGameStart = new Audio("./assets/sounds/gameStart.mp3");
let soundBounceOffPaddle = new Audio("./assets/sounds/hitThePaddle.ogg");
let soundHitTheFloor = new Audio("./assets/sounds/hitTheFloor.mp3");
let soundHitTheBrick = new Audio("./assets/sounds/hitTheBrick.mp3");
let soundWin = new Audio("./assets/sounds/gameWin.mp3");
let soundGameOver = new Audio("./assets/sounds/gameOver.mp3");

let bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

const keyDownHandler = (e) => {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = true;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = true;
  }
};

const keyUpHandler = (e) => {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = false;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = false;
  }
};

const mouseMoveHandler = (e) => {
  var relativeX = e.clientX - cnv.offsetLeft;
  if (relativeX > 0 && relativeX < cnvWidth) {
    paddleX = relativeX - paddleWidth / 2;
  }
};

const touchMoveHandler = (e) => {
  var relativeX = e.touches[0].screenX - cnv.offsetLeft;
  if (relativeX > 0 && relativeX < cnvWidth) {
    paddleX = relativeX - paddleWidth / 2;
  }
};

const collisionDetection = () => {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      let b = bricks[c][r];
      if (b.status == 1) {
        if (
          x > b.x &&
          x < b.x + brickWidth &&
          y > b.y &&
          y < b.y + brickHeight
        ) {
          dy = -dy;
          b.status = 0;
          soundHitTheBrick.play();
          score += score_multiplier;
          if (score >= max_score / 4 && score < max_score / 2) {
            dx = 6;
            dy = -6;
            paddleWidth = cnvWidth / 5;
          } else if (score >= max_score / 2 && score < max_score * (3 / 4)) {
            dx = 7;
            dy = -7;
            paddleWidth = cnvWidth / 6;
          } else if (score >= max_score * (3 / 4) && score < max_score) {
            dx = 8;
            dy = -8;
            paddleWidth = cnvWidth / 8;
          }
          if (score == max_score) {
            soundWin.play();
            game.style.display = "flex";
            gameModal_h1.innerHTML = "YOU WIN! CONGRATULATIONS!";
            gameModal_p.innerHTML = "YOU SCORED " + score + " POINTS.";
            gameModal_btn.innerText = "Replay";
            game_state = "replay";
            toggle_raf = false;
            
          }
        }
      }
    }
  }
};
const drawBall = () => {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#E0E0E0";
  ctx.fill();
  ctx.closePath();
};
const drawPaddle = () => {
  ctx.beginPath();
  ctx.rect(
    paddleX,
    cnvHeight - paddleHeight - paddleOffsetBottom,
    paddleWidth,
    paddleHeight
  );
  ctx.fillStyle = "#ddd";
  ctx.fill();
  ctx.closePath();
};
const drawBricks = () => {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      r % 2 === 0 ? (brickOffsetLeft = 0) : (brickOffsetLeft = brickWidth / 2);

      if (bricks[c][r].status == 1) {
        let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        let gradient = ctx.createLinearGradient(
          brickX,
          brickY,
          brickX + brickWidth,
          brickY
        );
        gradient.addColorStop(0, "#EF5350");
        gradient.addColorStop(1, "#FF8A65");
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#fff";
        ctx.stroke();
        ctx.closePath();
      }
    }
  }
};

const drawLives = () => {
  ctx.font = "1rem Nunito";
  ctx.fillStyle = "#fff";
  ctx.fillText("Lives : " + lives, cnvWidth - 100, 20);
};

const drawScore = () => {
  ctx.font = "1rem Nunito";
  ctx.fillStyle = "#fff";
  ctx.fillText("Score : " + score, 50, 20);
};

const draw = () => {
  ctx.clearRect(0, 0, cnvWidth, cnvHeight);
  drawBricks();
  drawBall();
  drawPaddle();
  collisionDetection();
  drawScore();
  drawLives();
  if (x + dx > cnvWidth - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > cnvHeight - ballRadius - paddleOffsetBottom) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      if ((y = y - paddleHeight)) {
        soundBounceOffPaddle.play();
        dy = -dy;
      }
    } else {
      lives--;
      if (!lives) {
        soundGameOver.play();
        game.style.display = "flex";
        gameModal_h1.innerHTML = "GAME OVER!!";
        gameModal_p.innerHTML = "YOU SCORED " + score + " POINTS.";
        gameModal_btn.innerText = "Replay";
        game_state = "replay";
        return;
      } else {
        soundHitTheFloor.play();
        x = cnvWidth / 2;
        y = cnvHeight - 30;
        paddleX = (cnvWidth - paddleWidth) / 2;
      }
    }
  }

  if (rightPressed && paddleX < cnvWidth - paddleWidth) {
    paddleX += 10;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 10;
  }

  x += dx;
  y += dy;
   if (toggle_raf) {
    requestAnimationFrame(draw);
  }
};
raf = requestAnimationFrame(draw);
const gameStart = () => {
  if (game_state === "new") {
    soundGameStart.play();
    game.style.display = "none";
    toggle_raf = true;
    draw(toggle_raf);
  } else if (game_state === "replay") {
    document.location.reload();
  }
};
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);
document.addEventListener("touchmove", touchMoveHandler, false);
gameModal_btn.addEventListener("click", gameStart, false);
