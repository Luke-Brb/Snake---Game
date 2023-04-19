const cvs = document.getElementById('cvs');
const ctx = cvs.getContext('2d');
const headColor = '#96D34A',
      bodyColor = '#FBFF15',
      boardColor = '#000000',
      foodColor = '#FC618D';
      
// Create the Snake start position
let snake = [{x: 2, y: 0},
             {x: 1, y: 0},
             {x: 0, y: 0}];

const initialSnakeLength = snake.length;
let currentDirection = '';
let directionsQueue = []; //We save every movement given to the snake
let score = 0;
let highScore = localStorage.getItem('high-score') || 0; // High score

let gameLoop = setInterval(frame, 400);
let a = 0, b = 0;

// Draw board
const width = cvs.width,
      height = cvs.height;
function drawBoard() {
    ctx.fillStyle = boardColor; 
    ctx.fillRect(0, 0, width, height);
}

// Make the pixels square
const sq = 20;
const horizontalSq = width / sq;
const verticalSq = height / sq;

// Draw square
function drawSquare(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * sq, y * sq, sq, sq);
    ctx.strokeStyle = boardColor;
    ctx.strokeRect(x * sq, y * sq, sq, sq);
}
//drawSnake();
// Create and draw the food
// Create the food
let food = createFood();
function createFood() {
    let food = {  // Math.floor - round down the product of Math.random X horizontalSq (eg: 5.9 will become 5)
                  // Math.random - generate number ​​between 0 and 0.99
        x: Math.floor(Math.random() * horizontalSq),
        y: Math.floor(Math.random() * verticalSq)
    };
    // We condition that NO food is generated on the coordinates occupied by the snake
    while(snake.some((tile) => tile.x === food.x && tile.y === food.y)) {
        food = {
            x: Math.floor(Math.random() * horizontalSq),
            y: Math.floor(Math.random() * verticalSq)
        };
    }
    return food;
}

// Draw the food
function drawFood() {
    drawSquare(food.x, food.y, foodColor);
}

// Check if the food has been eaten
function hasEatenFood() {
    const head = {...snake[0]};
    return food.x === head.x && food.y === head.y;
}

// Create the movement directions of the snake
const directions = {
    LEFT: 'ArrowLeft',
    RIGHT: 'ArrowRight',
    UP: 'ArrowUp',
    DOWN: 'ArrowDown'
};
document.addEventListener('keyup', setDirection);
function setDirection(e) {
    const newDirection = e.key;
    const oldDirection = currentDirection;
    if ((newDirection === directions.LEFT && 
        oldDirection !== directions.RIGHT) ||
        (newDirection === directions.RIGHT && 
        oldDirection !== directions.LEFT) ||
        (newDirection === directions.UP && 
        oldDirection !== directions.DOWN) ||
        (newDirection === directions.DOWN && 
        oldDirection !== directions.UP)
        ) {
          directionsQueue.push(newDirection);
        }
}

// Draw the snake
function drawSnake() {
    snake.forEach((tile, i) => {
        const color = i === 0 ? headColor : bodyColor;
        drawSquare(tile.x, tile.y, color);
    });
}

// Move the snake
function moveSnake() {
    const head = {...snake[0]}; // "..." the Spread Operator is used to copy the enumerable properties of an object to create a clone of it
    if (directionsQueue.length) { // Change the direction of the snake only if 
                                  // the "directionQueue" string that saves the direction changes is not empty
        currentDirection = directionsQueue.shift();
    }
    switch (currentDirection) { // Positioning new direction for snake head
        case directions.LEFT:
            head.x -= 1;
            break;
        case directions.RIGHT:
            head.x += 1;
            break;
        case directions.UP:
            head.y -= 1;
            break;
        case directions.DOWN:
            head.y += 1;
            break;
    }
    if (hasEatenFood()) {
        food = createFood();
        snake.unshift(head);
        score++;
    } else if (currentDirection) {
        snake.pop();
        snake.unshift(head);
    }
}

// Collision detection - hit wall or hit self
function hitWall() {
    const head = snake[0];
    return (head.x < 0 || 
            head.x >= horizontalSq || 
            head.y < 0 || 
            head.y >= verticalSq
    );
}
function hitSelf() {
    const snakeBody = [...snake];
    const head = snakeBody.shift();
    return snakeBody.some(
        (tile) => ((tile.x === head.x) && (tile.y === head.y))
    );
}

// Score
function renderScore() {
    score = snake.length - initialSnakeLength;
    highScore = Math.max(highScore, score);
    localStorage.setItem('high-score', highScore);
}

// Show Game Over Screen
let btn = document.querySelector("button");
let div = document.querySelector(".game-over");
function gameOver() {
    div.style.display = "block";
    document.getElementById("current").innerHTML = score;
    document.getElementById("high").innerHTML = highScore;
}
btn.addEventListener("click", () => {
    div.style.display = "none";
    currentDirection = '';
    directionsQueue = [];
    snake = [{x: 2, y: 0},
             {x: 1, y: 0},
             {x: 0, y: 0}];
    gameLoop = setInterval(frame, 400); // setInterval is use to start the game
});

// Game dynamics frame by frame
function frame() {
    drawBoard()
    drawFood();
    moveSnake();
    drawSnake();
    renderScore();
    document.getElementById("current-score").innerHTML = score;
    document.getElementById("high-score").innerHTML = highScore;
    if (hitWall() || hitSelf()) {
        clearInterval(gameLoop); //clearInterval is use to stop the game
        gameOver();
    }
}