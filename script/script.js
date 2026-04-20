const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Speler variabelen
let playerX = 100;
let playerY = 170;
let playerWidth = 20;
let playerHeight = 40;
let velocityX = 0;
let velocityY = 0;
const gravity = 0.5;
const jumpStrength = -10;
const speed = 5;
let onGround = false;

// Platformen array: [x, y, width, height]
const platforms = [
  [0, 400, 800, 50],  // Grond, 1=x 2=y 3=width 4=height
  [120, 340, 120, 20], // Eerste platform
  [400, 310, 140, 20], // Tweede platform
  [600, 250, 120, 20], // Derde platform
  [80, 210, 120, 20], // Vierde platform
  [300, 150, 120, 20], // Vijfde platform
  [520, 110, 180, 20], // Zesde platform
];

const sentenceItems = [
  { x: 170, y: 300, width: 50, height: 20, text: "houdt", collected: false },
  { x: 360, y: 260, width: 50, height: 20, text: "van", collected: false },
  { x: 580, y: 210, width: 50, height: 20, text: "Rafael", collected: false },
  { x: 600, y: 360, width: 50, height: 20, text: "ids", collected: false },
];

const collectedSentences = [];

// Correct order of words to win
const correctOrder = ["ids", "houdt", "van", "Rafael"];
let gameWon = false;

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

  checkSentencePickup();

  // Houd speler binnen canvas
  if (playerX < 0) playerX = 0;
  if (playerX + playerWidth > canvas.width) playerX = canvas.width - playerWidth;
  if (playerY + playerHeight > canvas.height) {
    playerY = canvas.height - playerHeight;
    velocityY = 0;
    onGround = true;
  }
}

function drawSentences() {
  ctx.fillStyle = "#ffd700";
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.font = "14px Arial";
  sentenceItems.forEach(item => {
    if (!item.collected) {
      ctx.fillRect(item.x, item.y, item.width, item.height);
      ctx.strokeRect(item.x, item.y, item.width, item.height);
      ctx.fillStyle = "black";
      ctx.fillText(item.text, item.x + 5, item.y + 14);
      ctx.fillStyle = "#ffd700";
    }
  });
}

function drawHUD() {
  ctx.fillStyle = "white";
  ctx.font = "18px Arial";
  ctx.fillText(`Zinnen opgepakt: ${collectedSentences.length}/${sentenceItems.length}`, 10, 25);
  ctx.font = "14px Arial";
  collectedSentences.forEach((text, index) => {
    ctx.fillText(text, 10, 45 + index * 18);
  });
  
  // Display win message
  if (gameWon) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#FFD700";
    ctx.font = "bold 60px Arial";
    ctx.textAlign = "center";
    ctx.fillText("YOU WIN!", canvas.width / 2, canvas.height / 2);
    ctx.textAlign = "left";
  }
}

function checkSentencePickup() {
  sentenceItems.forEach(item => {
    if (!item.collected &&
        playerX < item.x + item.width &&
        playerX + playerWidth > item.x &&
        playerY < item.y + item.height &&
        playerY + playerHeight > item.y) {
      item.collected = true;
      collectedSentences.push(item.text);
      
      // Check if current collection matches the correct order
      if (collectedSentences.join(" ") === correctOrder.join(" ")) {
        gameWon = true;
        alert("🎉 You Win! 🎉\nYou collected: " + collectedSentences.join(" "));
      }
    }
  });
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
  drawSentences();
  drawPlayer();
  drawHUD();
  requestAnimationFrame(gameLoop);
}

gameLoop();