const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");



const BALL_RADIUS = 10; // Ball vars
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;

function drawBall()
{
	ctx.beginPath();
	ctx.arc(ballX, ballY, BALL_RADIUS, 0, Math.PI * 2);
	ctx.fillStyle = "red";
	ctx.fill();
	ctx.closePath();
}

const paddleHeight = 100; // Player vars
const paddleWidth = 10;
const playerX = 5;
const enemyX = canvas.width - paddleWidth - 5;
let playerY = canvas.height/2;
let enemyY = canvas.height/2;
let enemyAiTarget = canvas.height/2;
let ballSpeed = 3;

let upPressed = false;
let downPressed = false;
let pause = false;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);



function keyDownHandler(event) {
	if (event.key === "Up" || event.key === "ArrowUp") {
		upPressed = true;
	} else if (event.key === "Down" || event.key === "ArrowDown") {
		downPressed = true;
	} else if (event.key === "p") {
		pause = !pause;
	}
}
  
function keyUpHandler(event) {
	if (event.key === "Up" || event.key === "ArrowUp") {
		upPressed = false;
	} else if (event.key === "Down" || event.key === "ArrowDown") {
		downPressed = false;
	}
}

  
function drawPlayer(y)
{
	ctx.beginPath();
	ctx.rect(playerX, y - paddleHeight / 2, paddleWidth, paddleHeight);
	ctx.fillStyle = "red";
	ctx.fill();
	ctx.closePath();
}

function drawEnemy(y)
{
	ctx.beginPath();
	ctx.rect(enemyX, y - paddleHeight / 2, paddleWidth, paddleHeight);
	ctx.fillStyle = "red";
	ctx.fill();
	ctx.closePath();
}
let playerScore = 0;
let enemyScore = 0;

function getlength(number) { return number.toString().length; }		// This gives the number of ciffers in a number used in scoreboard to offset player score

function drawScoreboard()
{
	ctx.font = "32px Arial";
	ctx.fillStyle = "red";
	ctx.fillText(`${playerScore}`, (canvas.width / 2 - 32) - ((getlength(playerScore) - 1) * 16), 30);
	ctx.fillText(`${enemyScore}`, canvas.width / 2 + 12, 30);
}
function drawLine()
{
	ctx.beginPath();
	ctx.rect(canvas.width / 2 - 1, 0, 2, canvas.height);
	ctx.fillStyle = "white";
	ctx.fill();
	ctx.closePath();
}

var startGameInterval;
function resetGame()
{
	ballX = canvas.width / 2;
	ballY = canvas.height / 2;
	dx = 0;
	dy = 0;
	startGameInterval = setInterval(startGame, 1000);
}
function startGame()
{
	var ang = Math.random() * Math.PI / 2 - Math.PI / 4;;				// Calculate angle between 0 and 90 degrees and offset it with -45.
		dx = Math.cos(ang) * ballSpeed;
		dy = Math.sin(ang) * ballSpeed;
	if (Math.random() < 0.5) {											// Decides if the ball goes left or right
		dx = -dx;
		dy = -dy;
	}
	
	clearInterval(startGameInterval)
}

function enemyAi()
{
	enemyAiTarget = ballY + ((Math.random() - 0.5) * 20 );
}

let dx;
let dy;

resetGame()

var paddlePong = new Audio('soundfx/paddlePong.mp3');
var wallPong = new Audio('soundfx/wallPong.mp3');
var scorePong = new Audio('soundfx/scorePong.mp3');


function draw()
{
	if(pause) {return; }

	ctx.clearRect(0, 0, canvas.width, canvas.height); //Clear frame

	if(ballY > canvas.height - BALL_RADIUS || ballY < 0 + BALL_RADIUS) // Ball hit detection top and bottom
	{
		dy = -dy;
		wallPong.play();
	}
	
	ballX += dx
	ballY += dy

	if (upPressed && playerY > paddleHeight/2) { // Player movement
		playerY -= 4;
	} else if (downPressed && playerY < canvas.height - paddleHeight/2) {
		playerY += 4;
	}

	if (enemyAiTarget < enemyY && enemyY > paddleHeight/2) { // Enemy AI movement
		enemyY -= 2;
	} else if (enemyAiTarget > enemyY && enemyY < canvas.height - paddleHeight/2) {
		enemyY += 2;
	}

	if (ballX - BALL_RADIUS < playerX && ballY > playerY - paddleHeight / 2 && ballY < playerY + paddleHeight / 2)			// Paddle hit detection
	{
		if (ballY > playerY) {
			dy += 0.1;
			dx -= 0.1;
		} else {
			dy -= 0.1;
			dx -= 0.1;
		}
		dx = - dx;
		paddlePong.play();
	} else if (ballX > enemyX && ballY > enemyY - paddleHeight / 2 && ballY < enemyY + paddleHeight / 2)
	{
		if (ballY > enemyY) {
			dy += 0.1;
			dx += 0.1;
		} else {
			dy -= 0.1;
			dx += 0.1;
		}
		dx = - dx;
		paddlePong.play();
	}

	if (ballX < 0)
	{
		resetGame();
		enemyScore += 1;
		scorePong.play();
	} else if (ballX > canvas.width) {
		resetGame();
		playerScore += 1;
		scorePong.play();
	}

	drawLine();
	drawBall();
	drawPlayer(playerY);
	drawEnemy(enemyY);
	drawScoreboard();
}



setInterval(draw, 5);
setInterval(enemyAi, 200);