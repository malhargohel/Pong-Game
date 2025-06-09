const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

// Game settings
const paddleWidth = 10, paddleHeight = 80;
const ballSize = 12;
const playerX = 10;
const aiX = canvas.width - paddleWidth - 10;
const paddleSpeed = 6;
const aiSpeed = 4;

// Game state
let playerY = (canvas.height - paddleHeight) / 2;
let aiY = (canvas.height - paddleHeight) / 2;
let ballX = canvas.width / 2 - ballSize / 2;
let ballY = canvas.height / 2 - ballSize / 2;
let ballSpeedX = 5 * (Math.random() > 0.5 ? 1 : -1);
let ballSpeedY = 4 * (Math.random() > 0.5 ? 1 : -1);

function resetBall() {
    ballX = canvas.width / 2 - ballSize / 2;
    ballY = canvas.height / 2 - ballSize / 2;
    ballSpeedX = 5 * (Math.random() > 0.5 ? 1 : -1);
    ballSpeedY = 4 * (Math.random() > 0.5 ? 1 : -1);
}

canvas.addEventListener("mousemove", function(e) {
    const rect = canvas.getBoundingClientRect();
    let mouseY = e.clientY - rect.top;
    playerY = mouseY - paddleHeight / 2;

    // Keep paddle inside the canvas
    if (playerY < 0) playerY = 0;
    if (playerY > canvas.height - paddleHeight) playerY = canvas.height - paddleHeight;
});

// Draw functions
function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawBall(x, y, size, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, size, size);
}

function drawNet() {
    ctx.fillStyle = "#fff";
    const segmentHeight = 16;
    for (let y = 0; y < canvas.height; y += segmentHeight * 2) {
        ctx.fillRect(canvas.width / 2 - 1, y, 2, segmentHeight);
    }
}

function update() {
    // Move ball
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Ball collision with top/bottom
    if (ballY <= 0 || ballY + ballSize >= canvas.height) {
        ballSpeedY *= -1;
    }

    // Ball collision with player paddle
    if (
        ballX <= playerX + paddleWidth &&
        ballY + ballSize >= playerY &&
        ballY <= playerY + paddleHeight
    ) {
        ballX = playerX + paddleWidth;
        ballSpeedX *= -1;
        // Add some randomness
        let deltaY = (ballY + ballSize/2) - (playerY + paddleHeight/2);
        ballSpeedY = deltaY * 0.2 + (Math.random() - 0.5) * 2;
    }

    // Ball collision with AI paddle
    if (
        ballX + ballSize >= aiX &&
        ballY + ballSize >= aiY &&
        ballY <= aiY + paddleHeight
    ) {
        ballX = aiX - ballSize;
        ballSpeedX *= -1;
        let deltaY = (ballY + ballSize/2) - (aiY + paddleHeight/2);
        ballSpeedY = deltaY * 0.2 + (Math.random() - 0.5) * 2;
    }

    // AI paddle movement (simple tracking)
    let aiCenter = aiY + paddleHeight / 2;
    if (aiCenter < ballY + ballSize / 2 - 10) {
        aiY += aiSpeed;
    } else if (aiCenter > ballY + ballSize / 2 + 10) {
        aiY -= aiSpeed;
    }
    // Clamp AI paddle
    if (aiY < 0) aiY = 0;
    if (aiY > canvas.height - paddleHeight) aiY = canvas.height - paddleHeight;

    // Ball out of bounds (left/right) - reset
    if (ballX < 0 || ballX > canvas.width) {
        resetBall();
    }
}

function draw() {
    // Clear
    drawRect(0, 0, canvas.width, canvas.height, "#000");
    drawNet();

    // Draw paddles
    drawRect(playerX, playerY, paddleWidth, paddleHeight, "#0f0");
    drawRect(aiX, aiY, paddleWidth, paddleHeight, "#f00");

    // Draw ball
    drawBall(ballX, ballY, ballSize, "#fff");
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();