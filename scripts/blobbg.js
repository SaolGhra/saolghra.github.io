// Get the canvas element
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Function to resize canvas and adjust blur amount
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Adjust blur amount based on screen size
  blurAmount = Math.min(canvas.width, canvas.height) / 2;

  drawBalls();
}

// Blur amount
let blurAmount = Math.min(window.innerWidth, window.innerHeight) / 2;

// Mouse position
let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;

// Function to draw pattern with blur
function drawPattern() {
  // Create a temporary canvas for the pattern
  const patternCanvas = document.createElement("canvas");
  const patternCtx = patternCanvas.getContext("2d");
  patternCanvas.width = canvas.width;
  patternCanvas.height = canvas.height;

  // Draw the pattern on the temporary canvas
  patternCtx.fillStyle = "#218380";
  for (let i = 0; i < canvas.width; i += 35) {
    for (let j = 0; j < canvas.height; j += 40) {
      // Calculate the distance between the cursor and the center of the box
      const distanceX = mouseX - (i + 10);
      const distanceY = mouseY - (j + 10);
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

      const maxDistance = 100;
      let rotationAngle = Math.PI / 4;
      if (distance < maxDistance) {
        rotationAngle = (1 - distance / maxDistance) * (Math.PI / 4);
      }

      patternCtx.save();
      patternCtx.translate(i + 10, j + 10);
      patternCtx.rotate(rotationAngle);
      patternCtx.fillRect(-10, -10, 20, 20);
      patternCtx.restore();
    }
  }

  // Apply blur to the pattern
  patternCtx.filter = `blur(${blurAmount}px)`;

  // Draw the pattern onto the main canvas
  ctx.drawImage(patternCanvas, 0, 0);
}

// Draw balls with blur effect
function drawBalls() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw pattern
  drawPattern();

  // Draw blue ball (using a brighter shade of blue)
  ctx.fillStyle = "rgba(0, 0, 255, 1)";
  ctx.filter = `blur(${blurAmount}px)`;
  ctx.beginPath();
  ctx.arc(
    canvas.width / 2 + (mouseX - canvas.width / 2) / 20,
    canvas.height / 2 + (mouseY - canvas.height / 2) / 20,
    (canvas.width / 2) * 0.8,
    0,
    Math.PI * 2
  );
  ctx.closePath();
  ctx.fill();

  // Draw red ball
  ctx.fillStyle = "rgba(255, 0, 0, 0.7)";
  ctx.beginPath();
  ctx.arc(
    canvas.width / 4,
    canvas.height / 4,
    canvas.width / 2,
    0,
    Math.PI * 2
  );
  ctx.closePath();
  ctx.fill();

  // Draw green ball
  // ctx.fillStyle = "rgba(0, 255, 0, 0.7)";
  // ctx.beginPath();
  // ctx.arc(
  //   (canvas.width * 9) / 10,
  //   (canvas.height * 9) / 10,
  //   canvas.width / 2,
  //   0,
  //   Math.PI * 2
  // );
  // ctx.closePath();
  // ctx.fill();

  // Reset filter
  ctx.filter = "none";
}

// Mouse move event listener
document.addEventListener("mousemove", function (event) {
  mouseX = event.clientX;
  mouseY = event.clientY;
  drawBalls();
});

// Window resize event listener
window.addEventListener("resize", resizeCanvas);

// Initial resize
resizeCanvas();
