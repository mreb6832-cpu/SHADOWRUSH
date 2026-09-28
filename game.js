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


// ==========================
// KEYBOARD
// ==========================

document.addEventListener("keydown", (event) => {

  keys[event.key.toLowerCase()] = true;

  if (event.code === "Space") {
    attack();
  }

});

document.addEventListener("keyup", (event) => {

  keys[event.key.toLowerCase()] = false;

});


// ==========================
// MOBILE MOVEMENT
// ==========================

function holdButton(buttonId, key) {

  const button = document.getElementById(buttonId);

  button.addEventListener("touchstart", (event) => {

    event.preventDefault();

    keys[key] = true;

  });

  button.addEventListener("touchend", (event) => {

    event.preventDefault();

    keys[key] = false;

  });

  button.addEventListener("touchcancel", () => {

    keys[key] = false;

  });

  // Mouse support for testing on PC

  button.addEventListener("mousedown", () => {
    keys[key] = true;
  });

  button.addEventListener("mouseup", () => {
    keys[key] = false;
  });

  button.addEventListener("mouseleave", () => {
    keys[key] = false;
  });
}


holdButton("up", "arrowup");
holdButton("down", "arrowdown");
holdButton("left", "arrowleft");
holdButton("right", "arrowright");


// ==========================
// PLAYER MOVEMENT
// ==========================

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


// ==========================
// CREATE ENEMY
// ==========================

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


// ==========================
// ENEMY MOVEMENT
// ==========================

function moveEnemies() {

  enemies.forEach((enemy) => {

    const dx = playerX - enemy.x;
    const dy = playerY - enemy.y;

    const distance = Math.sqrt(
      dx * dx + dy * dy
    );

    if (distance > 45) {

      enemy.x +=
        (dx / distance) * enemy.speed;

      enemy.y +=
        (dy / distance) * enemy.speed;

      enemy.element.style.left =
        enemy.x + "px";

      enemy.element.style.top =
        enemy.y + "px";

    } else {

      health -= 0.5;

      healthText.textContent =
        Math.max(0, Math.floor(health));

      if (health <= 0) {
        gameOver();
      }

    }

  });

}


// ==========================
// ATTACK
// ==========================

function attack() {

  // Weapon animation

  player.classList.remove("attacking");

  void player.offsetWidth;

  player.classList.add("attacking");

  setTimeout(() => {

    player.classList.remove("attacking");

  }, 250);


  const attackRange = 110;

  // Find enemies inside range

  for (let i = enemies.length - 1; i >= 0; i--) {

    const enemy = enemies[i];

    const dx = playerX - enemy.x;
    const dy = playerY - enemy.y;

    const distance = Math.sqrt(
      dx * dx + dy * dy
    );

    if (distance <= attackRange) {

      // Hit animation

      enemy.element.classList.add("hit");

      setTimeout(() => {

        createDeathEffect(
          enemy.x,
          enemy.y
        );

        enemy.element.remove();

      }, 120);

      enemies.splice(i, 1);

      score += 10;
      coins += 1;

      scoreText.textContent = score;
      coinsText.textContent = coins;

    }

  }

}


// ==========================
// DEATH EFFECT
// ==========================

function createDeathEffect(x, y) {

  const effect =
    document.createElement("div");

  effect.className = "death-effect";

  effect.style.left = x + "px";
  effect.style.top = y + "px";

  document
    .getElementById("game")
    .appendChild(effect);

  setTimeout(() => {

    effect.remove();

  }, 500);

}


// ==========================
// ATTACK BUTTON
// ==========================

attackButton.addEventListener(
  "touchstart",
  (event) => {

    event.preventDefault();

    attack();

  }
);

attackButton.addEventListener(
  "mousedown",
  (event) => {

    event.preventDefault();

    attack();

  }
);


// ==========================
// GAME OVER
// ==========================

function gameOver() {

  alert(
    "💀 SHADOW RUSH\n\n" +
    "GAME OVER!\n\n" +
    "Score: " + score
  );

  location.reload();

}


// ==========================
// SPAWN ENEMIES
// ==========================

setInterval(() => {

  if (enemies.length < 8) {

    createEnemy();

  }

}, 1500);


// ==========================
// WINDOW RESIZE
// ==========================

window.addEventListener("resize", () => {

  playerX = Math.min(
    playerX,
    window.innerWidth - 22
  );

  playerY = Math.min(
    playerY,
    window.innerHeight - 22
  );

});


// ==========================
// START
// ==========================

updatePlayer();
