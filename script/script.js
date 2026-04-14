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
  ctx.strokeStyle = "white";
  ctx.lineWidth = 3;

  // Hoofd
  ctx.beginPath();
  ctx.arc(playerX + playerWidth / 2, playerY + 10, 8, 0, Math.PI * 2);
  ctx.stroke();

  // Lichaam
  ctx.beginPath();
  ctx.moveTo(playerX + playerWidth / 2, playerY + 18);
  ctx.lineTo(playerX + playerWidth / 2, playerY + 30);
  ctx.stroke();

  // Armen
  ctx.beginPath();
  ctx.moveTo(playerX + playerWidth / 2, playerY + 22);
  ctx.lineTo(playerX + 5, playerY + 25);
  ctx.moveTo(playerX + playerWidth / 2, playerY + 22);
  ctx.lineTo(playerX + playerWidth - 5, playerY + 25);
  ctx.stroke();

  // Benen
  ctx.beginPath();
  ctx.moveTo(playerX + playerWidth / 2, playerY + 30);
  ctx.lineTo(playerX + 5, playerY + playerHeight);
  ctx.moveTo(playerX + playerWidth / 2, playerY + 30);
  ctx.lineTo(playerX + playerWidth - 5, playerY + playerHeight);
  ctx.stroke();
}

// Teken platformen
function drawPlatforms() {
  ctx.fillStyle = "green";
  platforms.forEach(platform => {
    ctx.fillRect(platform[0], platform[1], platform[2], platform[3]);
  });
}

// Update speler positie en collision
function updatePlayer() {
  // Input
  if (keys.left) velocityX = -speed;
  else if (keys.right) velocityX = speed;
  else velocityX = 0;

  if (keys.up && onGround) {
    velocityY = jumpStrength;
    onGround = false;
  }

  // Zwaartekracht
  velocityY += gravity;

  // Update positie
  playerX += velocityX;
  playerY += velocityY;

  // Collision met platformen
  onGround = false;
  platforms.forEach(platform => {
    if (playerX < platform[0] + platform[2] &&
        playerX + playerWidth > platform[0] &&
        playerY < platform[1] + platform[3] &&
        playerY + playerHeight > platform[1]) {
      // Bovenkant collision (landing)
      if (velocityY > 0 && playerY < platform[1]) {
        playerY = platform[1] - playerHeight;
        velocityY = 0;
        onGround = true;
      }
      // Onderkant (van bovenaf duwen)
      else if (velocityY < 0 && playerY + playerHeight > platform[1] + platform[3]) {
        playerY = platform[1] + platform[3];
        velocityY = 0;
      }
      // Zij collision
      else if (velocityX > 0 && playerX < platform[0]) {
        playerX = platform[0] - playerWidth;
        velocityX = 0;
      } else if (velocityX < 0 && playerX + playerWidth > platform[0] + platform[2]) {
        playerX = platform[0] + platform[2];
        velocityX = 0;
      }
    }
  });

  // Houd speler binnen canvas
  if (playerX < 0) playerX = 0;
  if (playerX + playerWidth > canvas.width) playerX = canvas.width - playerWidth;
  if (playerY + playerHeight > canvas.height) {
    playerY = canvas.height - playerHeight;
    velocityY = 0;
    onGround = true;
  }
}

// Toetsen tracking
const keys = {};
document.addEventListener("keydown", (e) => {
  if (e.code === "ArrowLeft" || e.code === "KeyA") keys.left = true;
  if (e.code === "ArrowRight" || e.code === "KeyD") keys.right = true;
  if (e.code === "ArrowUp" || e.code === "KeyW" || e.code === "Space") keys.up = true;
});
document.addEventListener("keyup", (e) => {
  if (e.code === "ArrowLeft" || e.code === "KeyA") keys.left = false;
  if (e.code === "ArrowRight" || e.code === "KeyD") keys.right = false;
  if (e.code === "ArrowUp" || e.code === "KeyW" || e.code === "Space") keys.up = false;
});

// Game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  updatePlayer();
  drawPlatforms();
  drawPlayer();
  requestAnimationFrame(gameLoop);
}

gameLoop();