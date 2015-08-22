'use strict';

var IMAGE_TURTLE = document.getElementById('IMAGE_TURTLE');

var TURTLE_SPEED = 100;

function Turtle(){
	this.pos = {
		x: 140,
		y: 0
	}

	this.velocity = {
		x: 0,
		y: 0
	}

	this.image = IMAGE_TURTLE;

	this.onGround = false;
}

Turtle.prototype.update = function(delta){
	this.velocity.y += GRAVITY*delta/1000;
	
	// Land on bricks
	var footTile = {
		x: Math.floor(this.pos.x / GAME_TILE_SIZE),
		y: Math.floor((this.pos.y + this.image.height/2) / GAME_TILE_SIZE)
	}
	if(world.bricks[footTile.x][footTile.y]){
		this.pos.y = footTile.y*GAME_TILE_SIZE - this.image.height/2;
		this.velocity.y = 0;
	}

	// Move left and right
	this.velocity.x = 0;
	if(controller.buttons.left){
		this.velocity.x = -TURTLE_SPEED;
	}
	if(controller.buttons.right){
		this.velocity.x = TURTLE_SPEED;
	}

	// Jump
	if(controller.buttons.jump){
		var testY = Math.floor((this.pos.y + this.image.height/2 + 1)/GAME_TILE_SIZE);
		if(world.bricks[Math.floor(this.pos.x/GAME_TILE_SIZE)][testY]){
			this.velocity.y = -350;
		}
	}

	this.pos.x += this.velocity.x * delta/1000;
	this.pos.y += this.velocity.y * delta/1000;
	if(this.pos.x - this.image.width/2 < 0){
		this.pos.x = this.image.width/2
	}
	if(this.pos.x + this.image.width/2 > canvas.width){
		this.pos.x = canvas.width - this.image.width/2;
	}
}

Turtle.prototype.render = function(){
	ctx.drawImage(
		this.image,
		this.pos.x - this.image.width/2,
		this.pos.y - this.image.height/2
	);
}
