﻿window.onload = function () {
	var canvasWidth = 900;
	var canvasHeight = 600;
	var blockSize = 30;
	var ctx;
	var delay = 100;
	var snakee;
	var applee;
	var widthInBlocks = canvasWidth / blockSize;
	var heightInBlocks = canvasHeight / blockSize;

	init ();

	/* creation d'un fond 900x600 avec cadre fin noir */
	function init () {
		var canvas = document.createElement ('canvas');
		canvas.width = canvasWidth;
		canvas.height = canvasHeight;
		canvas.style.border = "1px solid";
		document.body.appendChild (canvas);
		ctx = canvas.getContext ('2d');
		snakee = new Snake ([[6,4],[5,4],[4,4]], "right");
		applee = new Apple ([10,10]);
		refreshCanvas ();

	}

	/* ajout d'un rectangle rouge 100x50 au coin supérieur gauche,
	distance 30x30, dans un plan 2D,
	se deplaçant de 5px/cs vers le bas et la droite */
	function refreshCanvas () {
		snakee.advance ();
		if (snakee.checkCollision()) {
			// game over
		}
		else {
			ctx.clearRect (0, 0, canvasWidth, canvasHeight);
			snakee.draw ();
			applee.draw ();
			setTimeout (refreshCanvas, delay);

		}

	}

	/* affichage structure par blocs */
	function drawBlock (ctx, position) {
		var x = position[0] * blockSize;
		var y = position[1] * blockSize;
		ctx.fillRect (x, y, blockSize, blockSize);
	}

	/* creation du serpent */
	function Snake (body, direction) {
		this.body = body;
		this.direction = direction;
		this.draw = function () {
			ctx.save ();
			ctx.fillStyle = "#f00";
			for (var i = 0; i < this.body.length; i++) {
				drawBlock (ctx, this.body[i]);
			}
			ctx.restore ();
		}

		/* faire avancer le serpent:
			création de la méthode advance
			attention au sens du mouvement avec nextPosition[0/1] */
		this.advance = function () {
			var nextPosition = this.body[0].slice ();
			switch (this.direction) {
				case "left":
					nextPosition[0] -= 1;
					break;
				case "up":
					nextPosition[1] -= 1;
					break;
				case "right":
					nextPosition[0] += 1;
					break;
				case "down":
					nextPosition[1] += 1;
					break;
				default:
					throw ("Invalid Direction!");
			}
			this.body.unshift (nextPosition);
			this.body.pop ();
		}

		this.setDirection = function (newDirection) {
			var allowedDirections;
			switch (this.direction ) {
				case "left":
				case "right":
					allowedDirections = ["up", "down"];
					break;
				case "up":
				case "down":
					allowedDirections = ["left", "right"];
                    break;
				default:
					throw ("Invalid Direction!");

			}
			if (allowedDirections.indexOf (newDirection) > -1) {
				this.direction = newDirection;
			}

		}
		this.checkCollision = function () {
			var wallCollision = false;
			var snakeCollision = false;
			var head = this.body[0];
			var rest = this.body.slice(1);
			var snakeX = head[0];
			var snakeY = head[1];
			var minX = 0;
			var minY = 0;
			var maxX = widthInBlocks - 1;
			var maxY = heightInBlocks - 1;
			var isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
			var isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;
			if (isNotBetweenVerticalWalls || isNotBetweenHorizontalWalls) {
				wallCollision = true;
			}
			for (var i = 0; i < rest.length; i++) {
				if (snakeX === rest[i][0] && snakeY === rest[i][1]) {
					snakeCollision = true;
				}
			}
			return wallCollision || snakeCollision ;
		}

		// this.isEatingApple (appleToEat) {
		// 	var head[0] = this.body[0];
		// 	if (head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1]) 
		// 		return true;
		// 	else 
		// 		return false;
			
		// }

	}

	function Apple (position) {
		this.position = position;
		this.draw = function () {
			ctx.save ();
			ctx.fillStyle = "#33cc33";
			ctx.beginPath ();
			var radius = blockSize/2;
			var x = position[0] * blockSize + radius;
			var y = position[1] * blockSize + radius;
			ctx.arc(x, y, radius, 0, Math.PI*2, true);
			ctx.fill();
			ctx.restore ();
		}
	}

	document.onkeydown = function handleKeyDown (e) {
		var key = e.keyCode;
		var newDirection;
		switch (key) {
			case 37:
				newDirection = "left";
				break;
			case 38:
				newDirection = "up";
				break;
			case 39:
				newDirection = "right";
				break;
			case 40:
				newDirection = "down";
				break;
			default:
				return;

		}
		snakee.setDirection (newDirection);
	}
}
