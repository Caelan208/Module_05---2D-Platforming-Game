const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Speler variabelen
let playerX = 100;
let playerY = 300;
let playerWidth = 20;
let playerHeight = 40;
let velocityX = 0;
let velocityY = 0;
const gravity = 0.5;
const jumpStrength = -12;
const speed = 5;
let onGround = false;

// Platformen array: [x, y, width, height]
const platforms = [
  [0, 400, 800, 50],  // Grond
  [200, 350, 100, 20],
  [400, 300, 100, 20],
  [600, 250, 100, 20],
];

// Teken stickman speler
function drawPlayer() {
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;

 
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  updatePlayer();
  drawPlatforms();
  drawPlayer();
  requestAnimationFrame(gameLoop);
}

gameLoop();