const player = document.getElementById("player");

const healthText = document.getElementById("health");
const coinsText = document.getElementById("coins");
const scoreText = document.getElementById("score");

const attackButton = document.getElementById("attackButton");

let playerX = window.innerWidth / 2;
let playerY = window.innerHeight / 2;

let health = 100;
let coins = 0;
let score = 0;

const speed = 5;

const keys = {};

const enemies = [];


// =========================
// KEYBOARD
// =========================

document.addEventListener("keydown", (event) => {
  keys[event.key.toLowerCase()] = true;

  // SPACE = ATTACK
  if (event.code === "Space") {
    attack();
  }
});

document.addEventListener("keyup", (event) => {
  keys[event.key.toLowerCase()] = false;
});


// =========================
// PLAYER MOVEMENT
// =========================

function updatePlayer() {

  if (keys["w"] || keys["arrowup"]) {
    playerY -= speed;
  }

  if (keys["s"] || keys["arrowdown"]) {
    playerY += speed;
  }

  if (keys["a"] || keys["arrowleft"]) {
    playerX -= speed;
  }

  if (keys["d"] || keys["arrowright"]) {
    playerX += speed;
  }

  const halfWidth = 22;
  const halfHeight = 22;

  playerX = Math.max(
    halfWidth,
    Math.min(window.innerWidth - halfWidth, playerX)
  );

  playerY = Math.max(
    halfHeight,
    Math.min(window.innerHeight - halfHeight, playerY)
  );

  player.style.left = playerX + "px";
  player.style.top = playerY + "px";

  moveEnemies();

  requestAnimationFrame(updatePlayer);
}


// =========================
// CREATE ENEMY
// =========================

function createEnemy() {

  const enemy = document.createElement("div");

  enemy.className = "enemy";

  const side = Math.floor(Math.random() * 4);

  let x;
  let y;

  if (side === 0) {
    x = Math.random() * window.innerWidth;
    y = -40;
  }

  if (side === 1) {
    x = window.innerWidth + 40;
    y = Math.random() * window.innerHeight;
  }

  if (side === 2) {
    x = Math.random() * window.innerWidth;
    y = window.innerHeight + 40;
  }

  if (side === 3) {
    x = -40;
    y = Math.random() * window.innerHeight;
  }

  enemy.style.left = x + "px";
  enemy.style.top = y + "px";

  document.getElementById("game").appendChild(enemy);

  enemies.push({
    element: enemy,
    x: x,
    y: y,
    speed: 1.5
  });
}


// =========================
// ENEMY MOVEMENT
// =========================

function moveEnemies() {

  enemies.forEach((enemy, index) => {

    const dx = playerX - enemy.x;
    const dy = playerY - enemy.y;

    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 45) {

      enemy.x += (dx / distance) * enemy.speed;
      enemy.y += (dy / distance) * enemy.speed;

      enemy.element.style.left = enemy.x + "px";
      enemy.element.style.top = enemy.y + "px";

    } else {

      // Enemy hits player

      health -= 0.5;

      healthText.textContent = Math.max(
        0,
        Math.floor(health)
      );

      if (health <= 0) {
        gameOver();
      }
    }
  });
}


// =========================
// ATTACK
// =========================

function attack() {

  attackButton.style.transform = "scale(0.85)";

  setTimeout(() => {
    attackButton.style.transform = "scale(1)";
  }, 100);


  const attackRange = 100;

  enemies.forEach((enemy, index) => {

    const dx = playerX - enemy.x;
    const dy = playerY - enemy.y;

    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance <= attackRange) {

      enemy.element.remove();

      enemies.splice(index, 1);

      score += 10;
      coins += 1;

      scoreText.textContent = score;
      coinsText.textContent = coins;
    }
  });
}


// =========================
// GAME OVER
// =========================

function gameOver() {

  alert(
    "💀 SHADOW RUSH\n\nGame Over!\nScore: " + score
  );

  location.reload();
}


// =========================
// SPAWN ENEMIES
// =========================

setInterval(() => {

  if (enemies.length < 8) {
    createEnemy();
  }

}, 1500);


// =========================
// START GAME
// =========================

updatePlayer();
