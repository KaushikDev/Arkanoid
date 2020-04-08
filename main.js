//canvas variables
let cnv = document.querySelector("#myCanvas");
let ctx = cnv.getContext("2d"); //2d context to play with
let cnvWidth = (cnv.width = window.innerWidth); //canvas width
let cnvHeight = (cnv.height = window.innerHeight); //canvas height

let ballRadius = 10;
let x = cnvWidth / 2;
let y = cnvHeight - 30;
let dx = 5;
let dy = -5;
let paddleHeight = 10;
let paddleWidth = cnvWidth/4; //prev value 75
let paddleX = (cnvWidth - paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;

let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 0;
let brickRowCount = 7;
let brickColumnCount = Math.floor(cnvWidth/(brickWidth+brickPadding));
console.log("num of columns "+brickColumnCount)
let score = 0;
let lives = 3;

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

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

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
          score += 5;
          if (score == brickColumnCount * brickRowCount * 5) {
            alert(
              "YOU WIN, CONGRATULATIONS!\nYOU SCORED " + score + " POINTS!!"
            );
            document.location.reload();
            
          }
        }
      }
    }
  }
};
const drawBall = () => {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
};
const drawPaddle = () => {
  ctx.beginPath();
  ctx.rect(paddleX, cnvHeight - paddleHeight - 10, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
};
const drawBricks = () => {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
        r%2===0?brickOffsetLeft = 0: brickOffsetLeft = brickWidth/2;
        
      if (bricks[c][r].status == 1) {
        let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
};

const drawLives = () => {
  ctx.fontStyle = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Lives : " + lives, cnvWidth - 65, 20);
};

const drawScore = () => {
  ctx.fontStyle = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Score : " + score, 8, 20);
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
  } else if (y + dy > cnvHeight - ballRadius -10) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      if ((y = y - paddleHeight)) {
        dy = -dy;
      }
    } else {
      lives--;
      if (!lives) {
        alert("GAME OVER!!\nYOU SCORED "+score+" points.\nPRESS 'OK' TO REPLAY.");
        document.location.reload();
    } 
    else {
        x = cnvWidth / 2;
        y = cnvHeight - 30;
        // dx = 2;
        // dy = -2;
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
  requestAnimationFrame(draw);
};

draw();
