const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startScreen = document.getElementById('startScreen');
const startBtn = document.getElementById('startBtn');
const gameOverScreen = document.getElementById('gameOverScreen');
const restartBtn = document.getElementById('restartBtn');
const finalScoreDisplay = document.getElementById('finalScore');

let fishImg = new Image();
let bgImg = new Image();
let pipeNorth = new Image();
let pipeSouth = new Image();

fishImg.src = 'assets/fish.png';
bgImg.src = 'assets/background.jpg';
pipeNorth.src = 'https://i.imgur.com/1xXW2Oa.png';
pipeSouth.src = 'https://i.imgur.com/1pH5c9F.png';

let flapSound = new Audio('assets/flap.mp3');
let hitSound = new Audio('assets/hit.mp3');
let bgMusic = new Audio('assets/bgmusic.mp3');
bgMusic.loop = true;

let gap = 170;
const pipeWidth = 50;
const pipeHeight = 200;
let bX = 10;
let bY = 150;
let gravity = 0.5;
let velocityY = 0;
let score = 0;
let pipes = [];

function draw() {
  ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

  for (let i = 0; i < pipes.length; i++) {
    ctx.fillStyle = 'green';
    ctx.fillRect(pipes[i].x, pipes[i].y, pipeWidth, pipeHeight);
    ctx.fillRect(pipes[i].x, pipes[i].y + pipeHeight + gap, pipeWidth, canvas.height);

    pipes[i].x--;

    if (pipes[i].x === 125) {
      pipes.push({
        x: canvas.width,
        y: Math.floor(Math.random() * (-100 + 1)) - 100
      });
    }

    const fishWidth = 40;
    const fishHeight = 30;

    if (
      bX + fishWidth >= pipes[i].x &&
      bX <= pipes[i].x + pipeWidth &&
      (bY <= pipes[i].y + pipeHeight || bY + fishHeight >= pipes[i].y + pipeHeight + gap) ||
      bY + fishHeight >= canvas.height
    ) {
      gameOver();
      return;
    }

    if (pipes[i].x === 5) {
      score++;
    }
  }

  const fishWidth = 40;
  const fishHeight = 30;
  ctx.drawImage(fishImg, bX, bY, fishWidth, fishHeight);
  velocityY += gravity;
  bY += velocityY;

  ctx.fillStyle = '#fff';
  ctx.font = '20px Arial';
  ctx.fillText('Score: ' + score, 10, 30);

  requestAnimationFrame(draw);
}

function gameOver() {
  hitSound.play();
  bgMusic.pause();
  finalScoreDisplay.textContent = score;
  gameOverScreen.classList.add('active');
  canvas.style.display = 'none';
}

function startGame() {
  console.log('Starting game with image check');

  const checkAllLoaded = () => {
    startScreen.classList.remove('active');
    gameOverScreen.classList.remove('active');
    canvas.style.display = 'block';

    bX = 50;
    bY = canvas.height / 2;
    velocityY = 0;
    score = 0;
    pipes = [{
      x: canvas.width + 100,
      y: Math.floor(Math.random() * (-100 + 1)) - 100
    }];

    bgMusic.currentTime = 0;
    bgMusic.play();
    draw();
  };

  if (fishImg.complete && bgImg.complete && pipeNorth.complete && pipeSouth.complete) {
    checkAllLoaded();
  } else {
    fishImg.onload = checkAllLoaded;
    bgImg.onload = checkAllLoaded;
    pipeNorth.onload = checkAllLoaded;
    pipeSouth.onload = checkAllLoaded;
  }
}

function flap() {
  velocityY = -8;
  flapSound.play();
}

document.addEventListener('keydown', e => {
  if (e.code === 'Space') flap();
});
document.addEventListener('mousedown', flap);

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', () => {
  gameOverScreen.classList.remove('active');
  startScreen.classList.add('active');
});

window.addEventListener('load', () => {
  startScreen.classList.add('active');

  if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('service-worker.js')
      .then(() => console.log('Service Worker Registered'))
      .catch(err => console.error('SW registration failed:', err));
  }
});
