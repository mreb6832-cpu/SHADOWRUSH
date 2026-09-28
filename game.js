const player = document.getElementById("player");

let playerX = window.innerWidth / 2;
let playerY = window.innerHeight / 2;

const speed = 5;

const keys = {};

document.addEventListener("keydown", (event) => {
  keys[event.key.toLowerCase()] = true;
});

document.addEventListener("keyup", (event) => {
  keys[event.key.toLowerCase()] = false;
});

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

  requestAnimationFrame(updatePlayer);
}

updatePlayer();
