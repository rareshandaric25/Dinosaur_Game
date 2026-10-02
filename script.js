
const game = document.querySelector(".game-container")
const player = document.querySelector(".player");
const scoreValue = document.querySelector("#score-value");



let playerY = 0;

let playerVerticalSpeed = 0;
const gravity = 0.5;
let onGround = true;
const groundOffset = 50;

let obstacles = [];
let onScreen = true;

let setIntervalId = null;

let bgPositionX = 0;

let gameStarted = false;
let score = 0;

//PLAYER

document.addEventListener("keydown", (event) => {
    if(event.key === " ") {
        if(!gameStarted) {
            gameStarted = true;
            startGame();
        }

        if(onGround) {
            playerVerticalSpeed = 10;
            onGround = false
            updatePlayer();
        }
    }
})

/*  Updates player's vertical position with playerVerticalSpeed substracting gravity,
    until the player is on the ground again */
function updatePlayer() {
    playerVerticalSpeed -= gravity;
    playerY += playerVerticalSpeed;

    if(playerY <= 0) {
        playerY = 0;
        playerVerticalSpeed = 0;
        onGround = true;
    }

    player.style.bottom = `${playerY + groundOffset}px`;

    if(!onGround && onScreen) {
        requestAnimationFrame(updatePlayer);
    }
}


function endGame() {
    onGround = false;
    onScreen = false;
    clearInterval(setIntervalId)

    const gameOverText = document.createElement("div");
    gameOverText.classList.add("gameOverText")
    gameOverText.textContent = "GAME OVER";
    game.appendChild(gameOverText);

    //Restart button
    const startBtn = document.createElement("button");
    startBtn.classList.add("restartBtn");
    startBtn.textContent = "Restart";
    game.appendChild(startBtn);

    startBtn.addEventListener("click", startGame);
}


function obstacleCollision(obstacle, obstacleRight) {
    let gameWidth = game.clientWidth;
    
    const playerX = player.offsetLeft;
    const playerWidth = player.offsetWidth;

    //Right edge of the player
    let playerRightEdge = playerX + playerWidth;
    let obstacleWidth = parseFloat(obstacle.style.width);
    let obstacleLeftEdge = gameWidth - obstacleRight - obstacleWidth;
    let obstacleRightEdge = obstacleLeftEdge + obstacleWidth;

    if(obstacleLeftEdge <= playerRightEdge 
        && obstacleLeftEdge + obstacleWidth >= playerX 
        && playerY == 0){
        endGame();
    }
    
    if(obstacleRightEdge < playerX && obstacle.dataset.scored !== "true"){
        score += 1;
        obstacle.dataset.scored = "true";
        scoreValue.textContent = score;
    }
}

// OBSTACLES

function createObstacle() {
    const obstacle = document.createElement("div");
    obstacle.classList.add("obstacle");
    obstacle.style.height = `${generateRandomNumber()}px`;
    obstacle.style.width = `${generateRandomNumber()}px`;
    obstacle.style.right = -1 + "px";

    game.appendChild(obstacle);
    obstacles.push(obstacle);
}

function generateRandomNumber() {
    return Math.floor((Math.random() * 40) + 30);
}

function updateObstacle() {
    let obstacleSpeed = 5 + Math.floor(score / 5) * 0.5;

    obstacles = obstacles.filter((obstacle) => {
        const obstacleRight = parseFloat(getComputedStyle(obstacle).right) + obstacleSpeed;
        obstacle.style.right = `${obstacleRight}px`;

        obstacleCollision(obstacle, obstacleRight);

        if (obstacleRight > game.clientWidth) {
            obstacle.remove();
            return false;
        }

        return true;
    });

    if(onScreen) {
        requestAnimationFrame(updateObstacle);
    }
}

//Background movement
function bgMovement(){
    bgPositionX -= 2;
    game.style.backgroundPositionX  = `${bgPositionX}px`;

    if(onScreen) {
        requestAnimationFrame(bgMovement);
    }
}

function startGame(){
    document.querySelector(".gameOverText")?.remove();
    document.querySelector(".restartBtn")?.remove();
    document.querySelectorAll(".obstacle").forEach((obstacle) => obstacle.remove());

    onScreen = true;
    onGround = true;
    obstacles = [];
    score = 0;
    scoreValue.textContent = score;

    setIntervalId = setInterval(createObstacle, 2000);
    requestAnimationFrame(updateObstacle);
    requestAnimationFrame(bgMovement);
}
