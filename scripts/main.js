window.onload = () => {
	console.log(innerHeight, innerWidth)
	const blockSize = 48;
	const canvasWidth = innerWidth -100 ;
	const canvasHeight = innerHeight -100;
	const delay = 100;
	const widthInBlocks = canvasWidth / blockSize;
	const heightInBlocks = canvasHeight / blockSize;
	let ctx;
	let snakee;
	let applee;
	let score;
	let timeout;
	
	const newGame = () => {
		snakee = new Snake([
			[6, 4],
			[5, 4],
			[4, 4],
			[3, 4]
		], "right");
		applee = new Apple([10, 10]);
		score = 0;
		refreshCanvas();
	}
	
	init();
	/* creation d'un fond 900x600 avec cadre fin noir */
	function init() {
		const canvas = document.createElement('canvas');
		canvas.width = canvasWidth;
		canvas.height = canvasHeight;
		canvas.style.border = "15px groove gray";
		canvas.style.margin = "25px auto";
		canvas.style.display = "block";
		canvas.style.background = "#ddd";
		document.body.appendChild(canvas);
		ctx = canvas.getContext('2d');
		newGame()
	}
	/* ajout d'un rectangle rouge 100x50 au coin supérieur gauche,
	distance 30x30, dans un plan 2D,
	se deplaçant de 5px/cs vers le bas et la droite */
	function refreshCanvas() {
		snakee.advance();
		if (snakee.checkCollision()) gameOver();
		else {
			if (snakee.isEatingApple(applee)) {
				score++;
				snakee.ateApple = true;
				do applee.setNewPosition();
				while (applee.isOnSnake(snakee))
			}
			ctx.clearRect(0, 0, canvasWidth, canvasHeight);
			drawScore();
			snakee.draw();
			applee.draw();
			timeout = setTimeout(refreshCanvas, delay);
		}
	}

	function gameOver() {
		ctx.save();
		ctx.font = "75px bold sans-serif ";
		ctx.fillStyle = "#000";
		ctx.strokeStyle = "white";
		ctx.textBaseline = "middle";
		ctx.lineWidth = "5";
		ctx.textAlign = "center";
		const centerX = canvasWidth / 2;
		const centerY = canvasHeight / 2;
		ctx.strokeText("Fin de partie", centerX, centerY / 2);
		ctx.fillText("Fin de partie", centerX, centerY / 2);
		ctx.font = "25px bold sans-serif ";
		ctx.strokeText("Appuie sur ESPACE pour réessayer", centerX, centerY * 1.5);
		ctx.fillText("Appuie sur ESPACE pour réessayer", centerX, centerY * 1.5);
		ctx.restore();
	}

	function restart() {
		newGame()
		clearTimeout(timeout);
	}

	function drawScore() {
		ctx.save();
		ctx.font = "100px bold sans-serif ";
		ctx.fillStyle = "#444";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		const centerX = canvasWidth / 2;
		const centerY = canvasHeight / 2;
		ctx.fillText(score.toString(), centerX, centerY);
		ctx.restore();
	}
	/* affichage structure par blocs */
	function drawBlock(ctx, position) {
		const x = position[0] * blockSize;
		const y = position[1] * blockSize;
		ctx.fillRect(x, y, blockSize, blockSize);
	}
	/* creation du serpent */
	function Snake(body, direction) {
		const r = Math.floor(Math.random() * 200)
		const g = Math.floor(Math.random() * 256)
		const b = Math.floor(Math.random() * 256)
		const snakeColor = `rgb(${r}, ${g}, ${b})`
		this.body = body;
		this.direction = direction;
		this.ateApple = false;
		this.draw = function() {
			ctx.save();
			ctx.fillStyle = snakeColor;
			for (i in this.body) drawBlock(ctx, this.body[i]);
			ctx.restore();
		}
		/* faire avancer le serpent:
			création de la méthode advance
			attention au sens du mouvement avec nextPosition[0/1] */
		this.advance = function() {
			const nextPosition = this.body[0].slice();
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
			this.body.unshift(nextPosition);
			!this.ateApple ? this.body.pop() : this.ateApple = false;
		}
		this.setDirection = function(newDirection) {
			let allowedDirections;
			switch (this.direction) {
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
			if (allowedDirections.indexOf(newDirection) > -1) this.direction = newDirection;
		}
		this.checkCollision = function() {
			let wallCollision = false;
			let snakeCollision = false;
			const head = this.body[0];
			const rest = this.body.slice(1);
			const snakeX = head[0];
			const snakeY = head[1];
			const minX = 0;
			const minY = 0;
			const maxX = widthInBlocks - 1;
			const maxY = heightInBlocks - 1;
			const isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
			const isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;
			if (isNotBetweenVerticalWalls || isNotBetweenHorizontalWalls) wallCollision = true;
			for (let i = 0; i < rest.length; i++)
				if (snakeX === rest[i][0] && snakeY === rest[i][1]) snakeCollision = true;
			return wallCollision || snakeCollision;
		}
		this.isEatingApple = function(appleToEat) {
			const head = this.body[0];
			return (head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1])
				?  true
				:  false
			
		}
	}

	function Apple(position) {
		this.position = position;
		this.draw = function() {
			// let g = Math.floor(Math.random() * 256)
			// let b = Math.floor(Math.random() * 256)
			// ctx.fillStyle = `rgb(255, ${g}, ${b})`;
			ctx.save();
			ctx.fillStyle = "lime";
			ctx.beginPath();
			const radius = blockSize / 2;
			const x = this.position[0] * blockSize + radius;
			const y = this.position[1] * blockSize + radius;
			ctx.arc(x, y, radius, 0, Math.PI * 2, true);
			ctx.fill();
			ctx.restore();
		}
		this.setNewPosition = function() {
			const newX = Math.round(Math.random() * (widthInBlocks - 1));
			const newY = Math.round(Math.random() * (heightInBlocks - 1));
			this.position = [newX, newY];
		}
		this.isOnSnake = function(snakeToCheck) {
			let isOnSnake = false;
			// for (let i = 0; i < snakeToCheck.body.length; i++)
			for (i in snakeToCheck.body)
				if (this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1]) 
					isOnSnake = true;
			return isOnSnake;
		}
	}
	document.onkeydown = function handleKeyDown(e) {
		const key = e.key;
		console.log(e)
		let newDirection;
		switch (key) {
			case "ArrowLeft":
				newDirection = "left";
				break;
			case "ArrowUp":
				newDirection = "up";
				break;
			case "ArrowRight":
				newDirection = "right";
				break;
			case "ArrowDown":
				newDirection = "down";
				break;
			case " ":
				restart();
				return;
			default:
				return;
		}
		snakee.setDirection(newDirection);
	}
}

document.querySelector("footer").textContent = new Date().getFullYear()