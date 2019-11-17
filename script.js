function startGame() {
    const directions = {
        LEFT: 0,
        RIGHT: 1,
        DOWN: 2,
        UP: 3
    };

    const COLUMN = 1;
    const ROW = 0;
    const SQUARE_SIZE = 25;
    const TEXT_SIZE = '20px';
    const SQUARE = SQUARE_SIZE + 'px';
    const GAME_SPEED = 100;

    let snakeExtraSegments = 0;
    let direction = directions.RIGHT;
    let refreshInterval;
    let moveInterval;
    let accentColor = '#00e600';
    let keyPressed = false;
    document.body.style.backgroundColor = 'rgb(0,0,0)';

    // Initializes the values needed for the game and starts it
    function startGame() {

        let board = new Array(Math.floor((window.innerHeight - SQUARE_SIZE) / SQUARE_SIZE));;
        let snakeSegments = [];

        create2DArray(Math.floor(window.innerWidth / SQUARE_SIZE), board);
        initializeBoard(board, snakeSegments);
        printBoard(board);

        // Game loop
        moveInterval = setInterval(moveSnake, GAME_SPEED, board, snakeSegments);
        refreshInterval = setInterval(refreshBoard, GAME_SPEED, board);
    }

    // Changes the snake's direction IF a correct key is pressed, IF the direction is possible(e.g. the snake cannot move left
    // if he is headed right) AND IF another key hasn't been pressed before the next refresh
    document.onkeydown = function (event) {
        if (keyPressed)
            return;
        if (((event.key === "ArrowUp") || (event.key === 'w')) && (direction !== directions.DOWN)) {
            direction = directions.UP;
            keyPressed = true;
        }
        if (((event.key === "ArrowDown") || (event.key === 's')) && (direction !== directions.UP)) {
            direction = directions.DOWN;
            keyPressed = true;
        }
        if (((event.key === "ArrowLeft") || (event.key === 'a')) && (direction !== directions.RIGHT)) {
            direction = directions.LEFT;
            keyPressed = true;
        }
        if (((event.key === "ArrowRight") || (event.key === 'd')) && (direction !== directions.LEFT)) {
            direction = directions.RIGHT;
            keyPressed = true;
        }
    };

    // Creates a 2 dimensional array
    function create2DArray(width, array) {
        for (let index = 0; index < array.length; index++) {
            array[index] = new Array(width);
        }
    }

    // Places the starting values(walls, snake, food) for the board
    function initializeBoard(board, snake) {
        for (let index = 0; index < board.length; index++) {
            for (let index2 = 0; index2 < board[index].length; index2++) {
                if ((index === 0) || (index2 === 0) || (index === board.length - 1) || (index2 === board[index].length - 1)) {
                    board[index][index2] = 1;
                    board[index][index2] = 1;
                } else {
                    board[index][index2] = 0;
                }
            }
        }
        setStartPositions(board, snake);
    }

    // Places the food and the snake on the board
    function setStartPositions(board, snake) {
        snake.push([3, 1], [3, 2], [3, 3]);
        board[3][3] = 1;
        board[3][2] = 1;
        board[3][1] = 1;
        createFood(board);
    }

    // Places the snake's food in a random place on the board
    function createFood(board) {
        let row = 0;
        let column = 0;
        while ((board[row][column] === 1) || (board[row][column] === 2)) {
            row = Math.floor(Math.random() * (board.length - 1));
            column = Math.floor(Math.random() * (board[0].length - 1));
        }
        board[row][column] = 2;
    }

    // Creates a visual display of the board(a 2 dimensional array)
    function printBoard(board) {
        let boardHeight = SQUARE_SIZE;

        for (let index = 0; index < board.length; index++) {
            let lineLength = 0;
            for (let index2 = 0; index2 < board[index].length; index2++) {
                createSquare(accentColor, board[index][index2], boardHeight + 'px', lineLength + 'px');
                lineLength += SQUARE_SIZE;
            }
            boardHeight += SQUARE_SIZE;
        }

        createScoreBoard(accentColor);
    }

    // Creates a div element representing a value on the board
    function createSquare(activeColor, value, top, left) {
        let elemChar = document.createElement('div');
        elemChar.style.height = SQUARE;
        elemChar.style.width = SQUARE;
        elemChar.style.top = top;
        elemChar.style.left = left;
        elemChar.style.position = 'fixed';

        if (value === 0) {
            elemChar.style.backgroundColor = '';
        } else {
            elemChar.style.backgroundColor = activeColor;
        }

        document.body.appendChild(elemChar);
    }

    // Creates a div element that shows the score
    function createScoreBoard(activeColor) {
        let score = document.createElement('div');

        score.style.height = TEXT_SIZE;
        score.style.top = '0' + 'px';
        score.style.position = 'fixed';
        score.style.fontFamily = '"Lucida Console", bold, serif';
        score.style.color = activeColor;
        score.id = 'textBox';
        score.innerText = 'SCORE: ' + snakeExtraSegments;

        document.body.appendChild(score);
    }

    // Updates the screen while only recoloring the needed elements
    function refreshBoard(board) {
        let children = document.body.children;

        for (let index = 0; index < board.length; index++) {
            for (let index2 = 0; index2 < board[index].length; index2++) {
                if (board[index][index2] === 0) {
                    children[index * board[index].length + index2].style.backgroundColor = '';
                } else {
                    children[index * board[index].length + index2].style.backgroundColor = accentColor;
                }
            }
        }

        children[board.length * board[0].length].innerText = 'SCORE: ' + snakeExtraSegments;
        children[board.length * board[0].length].style.color = accentColor;
    }

    // Moves the snake in a direction
    function moveSnake(board, snake) {
        let nextRow;
        let nextCol;

        switch (direction) {
            case directions.UP:
                nextRow = snake[snake.length - 1][ROW] - 1;
                nextCol = snake[snake.length - 1][COLUMN];
                break;
            case directions.DOWN:
                nextRow = snake[snake.length - 1][ROW] + 1;
                nextCol = snake[snake.length - 1][COLUMN];
                break;
            case directions.LEFT:
                nextRow = snake[snake.length - 1][ROW];
                nextCol = snake[snake.length - 1][COLUMN] - 1;
                break;
            case directions.RIGHT:
                nextRow = snake[snake.length - 1][ROW];
                nextCol = snake[snake.length - 1][COLUMN] + 1;
                break;
        }

        if (!move(board, snake, nextRow, nextCol)) {
            endGame();
        }

        keyPressed = false;
    }

    // Moves the snake to a position on the board
    function move(board, snake, nextRow, nextCol) {
        switch (board[nextRow][nextCol]) {
            case 0:
                const last = snake.shift();
                board[last[ROW]][last[COLUMN]] = 0;
                break;
            case 1:
                return false;
            case 2:
                createFood(board);
                changeColor();
                break;
        }

        board[nextRow][nextCol] = 1;
        snake.push([nextRow, nextCol]);
        snakeExtraSegments = snake.length - 3;

        return true;
    }

    // Changes the colors every 10 points
    function changeColor() {
        switch(snakeExtraSegments / 10) {
            case 1: accentColor = '#99ff99'; break;
            case 2: accentColor = '#99ffff'; break;
            case 3: accentColor = '#00e6e6'; break;
            case 4: accentColor = '#0000e6'; break;
            case 5: accentColor = '#e6e600'; break;
            case 6: accentColor = '#e600e6'; break;
            case 7: accentColor = '#ff99ff'; break;
            case 9: accentColor = '#e60000'; break;
            case 8: accentColor = '#ff6666'; break;
            case 10:
                accentColor = '#ffc700';
                document.body.style.backgroundImage = 'url("Images/bg.jpg")';
                break;
        }
    }

    // Finishes the game
    function endGame() {
        document.getElementById('textBox').innerText = 'GAME OVER!!! FINAL SCORE: ' + (snakeExtraSegments);
        window.clearInterval(moveInterval);
        window.clearInterval(refreshInterval);
    }

    startGame();
}

window.onload = function () {
    startGame();
};