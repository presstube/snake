window.onload = function () {
  const canvas = document.getElementById("gridCanvas");
  const ctx = canvas.getContext("2d");
  const gridSize = 10;
  const gridColor = "#555";
  const backgroundColor = "#222";
  const playerColor = "blue";
  const foodColor = "green";
  const enemyColor = "red";
  let fps = 10; // Initial frames per second
  let frameDuration = 1000 / fps; // Duration of each frame in milliseconds
  let enemyProbability = 0.07; // Initial probability of enemy cells being alive

  // Player's initial position and body
  let playerX = 0;
  let playerY = 0;
  let playerBody = [{ x: playerX, y: playerY }];

  // Player's movement direction
  let directionX = 1; // Moving right by default
  let directionY = 0; // Not moving vertically by default

  // Food's initial position
  let foodX = getRandomInt(0, canvas.width / gridSize);
  let foodY = getRandomInt(0, canvas.height / gridSize);

  // Enemy grid based on Conway's Game of Life
  const enemyGridWidth = canvas.width / gridSize;
  const enemyGridHeight = canvas.height / gridSize;
  let enemyGrid = createGrid(enemyGridWidth, enemyGridHeight);

  // Initialize enemy grid with random cells
  function initializeEnemyGrid() {
    enemyGrid = createGrid(enemyGridWidth, enemyGridHeight);
    for (let x = 0; x < enemyGridWidth; x++) {
      for (let y = 0; y < enemyGridHeight; y++) {
        if (
          (Math.abs(playerX - x) > 10 || Math.abs(playerY - y) > 10) &&
          (Math.abs(foodX - x) > 10 || Math.abs(foodY - y) > 10)
        ) {
          enemyGrid[x][y] = Math.random() < enemyProbability ? 1 : 0; // Probability of enemy cells being alive
        }
      }
    }
  }

  initializeEnemyGrid();

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

  // Function to create a grid
  function createGrid(width, height) {
    const grid = [];
    for (let x = 0; x < width; x++) {
      grid[x] = [];
      for (let y = 0; y < height; y++) {
        grid[x][y] = 0;
      }
    }
    return grid;
  }

  // Function to draw the grid, the player, the food, and the enemy
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
    playerBody.forEach((segment) => {
      ctx.fillRect(
        segment.x * gridSize,
        segment.y * gridSize,
        gridSize,
        gridSize,
      );
    });

    // Draw the food
    ctx.fillStyle = foodColor;
    ctx.fillRect(foodX * gridSize, foodY * gridSize, gridSize, gridSize);

    // Draw the enemy
    ctx.fillStyle = enemyColor;
    for (let x = 0; x < enemyGridWidth; x++) {
      for (let y = 0; y < enemyGridHeight; y++) {
        if (enemyGrid[x][y] === 1) {
          ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
        }
      }
    }
  }

  // Function to move the player
  function movePlayer() {
    playerX += directionX;
    playerY += directionY;

    // Wrap the player around the canvas
    if (playerX < 0) playerX = canvas.width / dpr / gridSize - 1;
    if (playerY < 0) playerY = canvas.height / dpr / gridSize - 1;
    if (playerX >= canvas.width / dpr / gridSize) playerX = 0;
    if (playerY >= canvas.height / dpr / gridSize) playerY = 0;

    // Check if the player has hit the food
    if (playerX === foodX && playerY === foodY) {
      // Grow the player's body
      playerBody.push({ x: playerX, y: playerY });

      // Respawn the food at a new random location
      foodX = getRandomInt(0, canvas.width / dpr / gridSize);
      foodY = getRandomInt(0, canvas.height / dpr / gridSize);
      console.log(`Food respawned at (${foodX}, ${foodY})`);

      // Respawn the enemy grid with increased probability
      enemyProbability = Math.min(enemyProbability + 0.02, 1); // Cap probability at 1
      fps += 1;
      frameDuration = 1000 / fps;
      initializeEnemyGrid();
    } else {
      // Move the player's body
      playerBody.push({ x: playerX, y: playerY });
      playerBody.shift();
    }

    // Check for collision with enemy
    if (enemyGrid[playerX][playerY] === 1) {
      resetGame();
    }
  }

  // Function to get a random integer between min and max
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  // Function to update the enemy grid based on Conway's Game of Life rules
  function updateEnemyGrid() {
    const newGrid = createGrid(enemyGridWidth, enemyGridHeight);

    for (let x = 0; x < enemyGridWidth; x++) {
      for (let y = 0; y < enemyGridHeight; y++) {
        const neighbors = countNeighbors(enemyGrid, x, y);
        if (enemyGrid[x][y] === 1) {
          if (neighbors < 2 || neighbors > 3) {
            newGrid[x][y] = 0; // Cell dies
          } else {
            newGrid[x][y] = 1; // Cell lives
          }
        } else {
          if (neighbors === 3) {
            newGrid[x][y] = 1; // Cell becomes alive
          }
        }
      }
    }

    enemyGrid = newGrid;
  }

  // Function to count alive neighbors for a cell in the grid
  function countNeighbors(grid, x, y) {
    let count = 0;
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const nx = (x + dx + enemyGridWidth) % enemyGridWidth;
        const ny = (y + dy + enemyGridHeight) % enemyGridHeight;
        count += grid[nx][ny];
      }
    }
    return count;
  }

  // Function to reset the game
  function resetGame() {
    playerX = 0;
    playerY = 0;
    playerBody = [{ x: playerX, y: playerY }];
    directionX = 1;
    directionY = 0;
    foodX = getRandomInt(0, canvas.width / gridSize);
    foodY = getRandomInt(0, canvas.height / gridSize);
    enemyProbability = 0.07; // Reset enemy probability
    fps = 10; // Reset FPS
    frameDuration = 1000 / fps;
    initializeEnemyGrid();
    console.log("Game reset");
  }

  // Event listener for key presses to change direction
  window.addEventListener("keydown", function (event) {
    switch (event.key) {
      case "ArrowUp":
        if (directionY === 0) {
          // Prevent reversing direction
          directionX = 0;
          directionY = -1;
        }
        break;
      case "ArrowDown":
        if (directionY === 0) {
          // Prevent reversing direction
          directionX = 0;
          directionY = 1;
        }
        break;
      case "ArrowLeft":
        if (directionX === 0) {
          // Prevent reversing direction
          directionX = -1;
          directionY = 0;
        }
        break;
      case "ArrowRight":
        if (directionX === 0) {
          // Prevent reversing direction
          directionX = 1;
          directionY = 0;
        }
        break;
    }
  });

  // Animation loop with FPS control
  let lastTime = 0;

  function update(time) {
    const deltaTime = time - lastTime;

    if (deltaTime >= frameDuration) {
      lastTime = time;
      movePlayer();
      updateEnemyGrid();
      draw();
    }

    requestAnimationFrame(update);
  }

  // Initial draw and start the animation loop
  draw();
  requestAnimationFrame(update);
};
