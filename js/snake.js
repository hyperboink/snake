$(function(){

	var canvas = document.getElementById('canvas'),
		context = canvas.getContext('2d'),
		$canvas = $('#canvas'),
		$width = $canvas.width(),
		$height = $canvas.height(),
		isColliding,
		axis,
		snake = {
			positions: [],
			color: 'teal',
			size: 3,
			pixelSize: 10,
			direction: 'left',
			stage: {
				color: '#000'
			},
			food: {},
			time: 85,
			score: 0,
			gameOver: {
				header: {
					text: 'GAME OVER!',
					font: {
						size: '13px',
						family: 'Trebuchet MS',
						color: '#fff'
					}
				},
				content: {
					text: 'Press any key to continue.',
					font: {
						size: '10px',
						family: 'Trebuchet MS',
						color: '#fff'
					}
				}
			},
			controls: {
				up: 38,
				down: 40,
				left: 37,
				right: 39
			}
		}


	function createStage(bgColor){
		context.fillStyle = bgColor ? bgColor : snake.stage.color;
		context.fillRect(0, 0, $width, $height);
	}

	function createSnake(){
		snake.positions = [];
		for(var i = 0; i < snake.size; i++){
			snake.positions.push({x: i + 10, y: 10});
		}
	}

	function drawSnake(){
		for(var i = 0; i < snake.positions.length; i++){
			snakePixel = snake.positions[i];
			drawPixel(snakePixel.x, snakePixel.y);
		}
	}

	function createFood(){
		snake.food = {
			x: Math.round( Math.random() * ($width - snake.pixelSize) / snake.pixelSize ),
			y: Math.round( Math.random() * ($height - snake.pixelSize * 2) / snake.pixelSize )
		}
	}

	function drawFood(){
		drawPixel(snake.food.x, snake.food.y);
	}

	function drawPixel(x, y, bgColor){
		context.fillStyle = bgColor ? bgColor : snake.color;
		context.fillRect(x * snake.pixelSize, y * snake.pixelSize, snake.pixelSize, snake.pixelSize);
	}

	function isCollide(x, y, positions){
		for(var i = 0; i < snake.positions.length; i++){
			if(positions[i].x === x && positions[i].y === y) return true;
		}
		return false;
	}

	function drawScore(score, bgColor){
		context.fillStyle = bgColor ? bgColor : snake.color;
		context.fillText('Score: ' + score, 5, $height - 5);
	}

	function gameOver(){
		context.fillStyle = snake.gameOver.header.font.color;
		context.font = snake.gameOver.header.font.size + ' ' + snake.gameOver.header.font.family;
		context.fillText(snake.gameOver.header.text, ($width - 80) / 2, ($height - 15) / 2);
		context.font = snake.gameOver.content.font.size + ' ' + snake.gameOver.content.font.family;
		context.fillText(snake.gameOver.content.text, ($width - 120) / 2, ($height + 15) / 2);
	}

	function snakeMove(){
		var snakeTail,
			positionX = snake.positions[0].x,
			positionY = snake.positions[0].y;

		createStage();

		switch(snake.direction){
			case 'up':
				positionY--;
				axis = 'vertical';
				break;
			case 'down':
				positionY++;
				axis = 'vertical';
				break;
			case 'left':
				positionX--;
				axis = 'horizontal';
				break;
			case 'right':
				positionX++;
				axis = 'horizontal';
				break;
		}

		isColliding = isCollide(positionX, positionY, snake.positions);

		if(isColliding){
			gameOver();
			return false;
		}

		if(snake.food.x === positionX && snake.food.y === positionY){
			snakeTail = {x: positionX, y: positionY};
			createFood();
			snake.score++;
		}else{
			snakeTail = snake.positions.pop();
			snakeTail.x = positionX;
			snakeTail.y = positionY;
		}

		if(positionX === -1) snakeTail.x = $width / snake.pixelSize;
		if(positionX === $width / snake.pixelSize) snakeTail.x = 0;
		if(positionY === -1) snakeTail.y = $height / snake.pixelSize;
		if(positionY === $height / snake.pixelSize) snakeTail.y = 0;

		snake.positions.unshift(snakeTail);

		drawSnake();

		drawFood();

		drawScore(snake.score);

	}

	function reset(){
		snake.direction = 'left';
		snake.score = 0;
	}

	function init(){
		snake.direction = snake.direction ? snake.direction : 'left';
		snake.score = snake.score.length ? snake.score : 0;
	}

	function startGame(){
		createSnake();
		createFood();
		init();

		if(typeof start != 'undefined') clearInterval(start);
		start = setInterval(snakeMove, snake.time);
	}


	$(document).on('keydown', function(e){
		var key = e.keyCode || e.which;

		setTimeout(function(){
			if(isColliding){
				startGame();
				reset();
			}
		}, snake.time);

		if(key === snake.controls.up && snake.direction != 'down' && axis != 'vertical') snake.direction = 'up';
		else if(key === snake.controls.down && snake.direction != 'up' && axis != 'vertical') snake.direction = 'down';
		else if(key === snake.controls.left && snake.direction != 'right' && axis != 'horizontal') snake.direction = 'left';
		else if(key === snake.controls.right && snake.direction != 'left' && axis != 'horizontal') snake.direction = 'right';

	});

	startGame();

});