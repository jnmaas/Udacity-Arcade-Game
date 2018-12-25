// TODO: show level score on screen
// TODO: show countdown after each game reset

const game = {
	tileHeight: 83,
	tileWidth: 101,
	startingTileXY: [2, 5], // starting position of player expressed in rows and columns
	playerOffset: [0, -10], // make sure player starts in the middle of the tile
	enemyOffset: [-300, -20], // make sure the enemy the enemy starts outside the canvas and walks neatly between each row
	enemyBorderLeft: -75, // determines collision proximity of enemy
	enemyBorderRight: 75, // // determines collision proximity of enemy
};

let level = 1; //initial level of the game
let allEnemies = [];
let player;
let getReady = false;
let playerCollidesX;
let playerCollidesY;
let textLocation = document.querySelector('.message');

// Enemies our player must avoid
class Enemy {
	// creates new enemy object
	constructor() {
		this.sprite = 'images/enemy-bug.png';     // The image/sprite for our enemies
		this.reset();
	}
	// sets the starting location, speed and delay
	reset() {
		this.row = Math.floor(Math.random() * 3)+1;
		this.y = (this.row*game.tileHeight)+game.enemyOffset[1];  // randomize y location between row 0, 1 and 2 expressed in pixels
		this.x = game.enemyOffset[0];
		this.speed = Math.floor(Math.random() * 5 + 1); // randomize speed between slow (1) and fast (5)
		this.isStarting = false;
		this.isMoving = false;
		this.isStarting = setTimeout(function() { return true; }, Math.floor(Math.random() * 10 + 1)*10000);
	}
	// Update the enemy's position, required method for game
	// Parameter: dt, a time delta between ticks
	update(dt) {
		if (this.isStarting) {  // If Enemy has not started yet, check if enemy is ready to start
			this.isMoving = true;
			this.isStarting = false;
		}
		else if (this.x >= (6*game.tileWidth)) { // If enemy has moved off-screen
			this.reset();
		}
		else if (this.isMoving) {
			this.x = this.x + (this.speed*dt*level*30); // Updates the Enemy location
		}
	}
	// Draw the enemy on the screen
	render() {
		ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
	}
}

class Player {
	constructor() {
		this.sprite = 'images/char-cat-girl.png';
		this.setPosition();
	}
	// set x and y location at start
	setPosition() {
		this.col = game.startingTileXY[0];
		this.row = game.startingTileXY[1];
	}
	// translates grid position to pixel position
	// checks if player has hit the water or has hit a bug
	update() {
		this.x = this.col*game.tileWidth + game.playerOffset[0];
		this.y = this.row*game.tileHeight + game.playerOffset[1];
		if (this.row < 1) {  // player in water
			nextLevel();
		}
		checkCollision(); // check if player collides with an enemy
	}
	// Draw the player on the screen
	render() {
		ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
	}
	// Respond to keyboard input
	handleInput(move) {
		switch(move) {
		case 'up':
			this.row -= 1;
			break;
		case 'down':
			if (this.row < 5) { //check for lower border to prevent player from moving off screen
				this.row += 1;
			}
			break;
		case 'left':
			if (this.col > 0) { //check for left border to prevent player from moving off screen
				this.col -= 1;
			}
			break;
		case 'right':
			if (this.col < 4) { //check for lower border to prevent player from moving off screen
				this.col += 1;
			}
			break;
		}
		this.update();
	}
}

// Instantiate enemy objects after each round, place them in array
// TODO: add other enemy objects
// TODO: add colectibles
function makeEnemies() {
	allEnemies = [];
	for (let i = 0; i < 10; i++) {
		let enemy = new Enemy();
		allEnemies.push(enemy);
	}
}
// checks if player touches an enemy object
function checkCollision() {
	allEnemies.forEach( function(enemy) {
		playerCollidesX = (player.x - enemy.x + game.enemyBorderLeft) * (player.x - enemy.x + game.enemyBorderRight) <= 0; // if player is in the same horizontal space as enemy
		playerCollidesY = (player.row == enemy.row); // if player is in the same ertical space as enemy
		if (playerCollidesX && playerCollidesY) { //check for collision
			gameOver();
		}
	});
}
// increases (speed) level, and calls to reset enemies and player
function nextLevel() {
	player = {};
	level += 0.1;
	textLocation.textContent = ('You won! Get ready for the next level...');
	makeEnemies();
	getReadyStart();
}
// Resets player and inserts a time delay to allow enemies to enter the canvas
function getReadyStart() {
	getReady = true;
	player = new Player();
	player.col = 6; // temporarily moves player off canvas to allow for restart time and allow new enemies to occupy the canvas
	setTimeout(function () {getReady = false; player.col = 2; textLocation.textContent = ('Get to the water!');}, 3000);
}
// Displays message and calls to reset player
function gameOver() {
	textLocation.textContent = ('The bugs got you! Get ready to try again...');
	getReadyStart();
}

makeEnemies();
getReadyStart();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
	var allowedKeys = {
		37: 'left',
		38: 'up',
		39: 'right',
		40: 'down'
	};
	if (!getReady) { // Do not allow movement when player is getting ready
		player.handleInput(allowedKeys[e.keyCode]);
	}
});
