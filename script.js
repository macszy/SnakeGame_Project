console.log("JavaScript Loaded");

var snake = [
    { x: 50, y: 100 },
    { x: 40, y: 100 },
    { x: 30, y: 100 },
    { x: 20, y: 100 },
    { x: 10, y: 100 },
];
var changeDir = false;
            var food = {};
            var dx = 10, dy = 0;
            var speed = 6;
            var looping;
            var isPaused = false;
            var isQuit = false;

            const box = document.getElementById("snake");
            const board = box.getContext("2d");

            const scoreTag = document.getElementById('score'); 
            var score = 0;

            document.getElementById('startButton').addEventListener("click", function(){
                document.getElementById('welcomeScreen').style.display = "none";
                document.getElementById('gameContainer').style.display = "block";
            });

            document.getElementById('play').addEventListener("click", StartGame);
            document.getElementById('pause').addEventListener("click", PauseGame);
            document.getElementById('quit').addEventListener("click", QuitGame);

            function StartGame() {
                score = 0;
                scoreTag.innerText = "Score: " + score;

                var level = parseInt(document.getElementById("level").value);
                speed = level + 2; 

                if (looping) clearInterval(looping);
                
                isPaused = false;
                document.getElementById('pause').innerText = "Pause";

                isQuit = false;
                document.getElementById('quit').innerText = "Quit";

                GenerateFood();
                looping = setInterval(loop, 1000 / (2 * speed));
            }

            function PauseGame(){
                if (isPaused) {
                    isPaused = false;
                    looping = setInterval(loop, 1000 / (2*speed));
                    document.getElementById('pause').innerText = "Pause";
                } else {
                    isPaused = true;
                    clearInterval(looping);
                    document.getElementById('pause').innerText = "Resume";
                }
            }

            function QuitGame(){
                if (isQuit) {
                    isQuit = false;
                    looping = setInterval(loop, 1000 / (2*speed));
                    document.getElementById('quit').innerText = "Quit";
                } else {
                    isQuit = true;
                    clearInterval(looping);
                    document.getElementById('quit').innerText = "Restart";
                    alert('You quit the game!'); 
                }
            }

            function loop() {
                if (IsGameOver()) {
                    clearInterval(looping);
                    return;
                }
                changeDir = false;
                ClearBoard();
                DrawFood();
                MoveSnake();
                DrawSnake();
                changeDir = false;
            }

            function MoveSnake() {
                var head = {
                    x: snake[0].x + dx,
                    y: snake[0].y + dy
                };

                snake.unshift(head);
                var hasEatenFood = snake[0].x === food.x && snake[0].y === food.y;
                if (hasEatenFood) {
                    score++;
                    scoreTag.innerText = "Score: " + score;
                    GenerateFood();
                } else {
                    snake.pop();
                }
            }

            function DrawSnake() {
                snake.forEach(function(block) {
                    board.fillStyle = "lime";
                    board.strokeStyle = "#000";
                    board.fillRect(block.x, block.y, 10, 10);
                    board.strokeRect(block.x, block.y, 10, 10);
                });
            }

            function ClearBoard() {
                board.fillStyle = "#222";
                board.fillRect(0, 0, box.width, box.height);
            }

            function IsGameOver() {
                for (var i = 4; i < snake.length; i++) {
                    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
                        return true;
                    }
                }
                const lw = snake[0].x < 0;
                const rw = snake[0].x > box.width - 10;
                const tw = snake[0].y < 0;
                const bw = snake[0].y > box.height - 10;
                return lw || rw || tw || bw;
            }

            function ChangeDirection(e) {
                const lk = 37, rk = 39, uk = 38, dk = 40;

                if (changeDir) return;
                changeDir = true;

                let k = e.keyCode;
                let toUp = dy === -10,
                    toDown = dy === 10,
                    toLeft = dx === -10,
                    toRight = dx === 10;

                if (k === lk && !toRight) {
                    dx = -10;
                    dy = 0;
                } else if (k == rk && !toLeft) {
                    dx = 10;
                    dy = 0;
                } else if (k === uk && !toDown) {
                    dx = 0;
                    dy = -10;
                } else if (k === dk && !toUp) {
                    dx = 0;
                    dy = 10;
                }
            }

            function GenerateFood() {
                food.x = randPos(0, box.width - 10);
                food.y = randPos(0, box.height - 10);
                snake.forEach(function(block) {
                    var eaten = block.x == food.x && block.y == food.y;
                    if (eaten) GenerateFood();
                });
            }

            function randPos(min, max) {
                return Math.round((Math.random() * (max - min) + min) / 10) * 10;
            }

            function DrawFood() {
                board.fillStyle = "red";
                board.fillRect(food.x, food.y, 10, 10);
            }

            document.addEventListener("keydown", ChangeDirection);

