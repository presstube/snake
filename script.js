window.onload = function () {
  const canvas = document.getElementById("gridCanvas");
  const ctx = canvas.getContext("2d");
  const gridSize = 10;
  const gridColor = "#555";
  const backgroundColor = "#222";
  const playerColor = "blue";

  // Player's initial position
  let playerX = 0;
  let playerY = 0;

  // Key state
  const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
  };

  // Get the device pixel ratio, falling back to 1
  const dpr = window.devicePixelRatio || 1;

  // Set the canvas width and height according to the device pixel ratio
  canvas.width = 800 * dpr;
  canvas.height = 800 * dpr;

  // Scale the context to account for the device pixel ratio
  ctx.scale(dpr, dpr);

  // Set the CSS display size
  canvas.style.width = "800px";
  canvas.style.height = "800px";

  // Function to draw the grid and the player
  function draw() {
    // Set the background color
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr);

    // Draw the grid
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1 / dpr;

    for (let x = 0; x <= canvas.width / dpr; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height / dpr);
      ctx.stroke();
    }

    for (let y = 0; y <= canvas.height / dpr; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width / dpr, y);
      ctx.stroke();
    }

    // Draw the player
    ctx.fillStyle = playerColor;
    ctx.fillRect(playerX * gridSize, playerY * gridSize, gridSize, gridSize);
  }

  // Function to move the player
  function movePlayer() {
    if (keys.ArrowUp) playerY -= 1;
    if (keys.ArrowDown) playerY += 1;
    if (keys.ArrowLeft) playerX -= 1;
    if (keys.ArrowRight) playerX += 1;

    // Ensure player stays within bounds
    if (playerX < 0) playerX = 0;
    if (playerY < 0) playerY = 0;
    if (playerX >= canvas.width / dpr / gridSize)
      playerX = canvas.width / dpr / gridSize - 1;
    if (playerY >= canvas.height / dpr / gridSize)
      playerY = canvas.height / dpr / gridSize - 1;
  }

  // Animation loop
  function update() {
    movePlayer();
    draw();
    requestAnimationFrame(update);
  }

  // Event listeners for key down and up
  window.addEventListener("keydown", function (event) {
    if (keys.hasOwnProperty(event.key)) {
      keys[event.key] = true;
    }
  });

  window.addEventListener("keyup", function (event) {
    if (keys.hasOwnProperty(event.key)) {
      keys[event.key] = false;
    }
  });

  // Initial draw and start the animation loop
  draw();
  requestAnimationFrame(update);
};
