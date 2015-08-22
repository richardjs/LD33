'use strict';

function Entity(options){
	this.pos = options.pos || {x: 0, y: 0};
	this.velocity = options.velocity || {x: 0, y:0};

	this.image = options.image;
	this.flipImage = options.flipImage;
}

Entity.prototype.update = function(delta){
	this.velocity.y += GRAVITY * delta/1000;

	// Movement and brick collision

	this.pos.x += this.velocity.x * delta/1000;
	var left = Math.floor((this.pos.x - this.image.width/2) / GAME_TILE_SIZE);
	var right = Math.floor((this.pos.x + this.image.width/2) / GAME_TILE_SIZE);
	var top = Math.floor((this.pos.y - this.image.height/2) / GAME_TILE_SIZE);
	var mid = Math.floor(this.pos.y / GAME_TILE_SIZE);
	var bottom = Math.floor((this.pos.y - 1 + this.image.height/2) / GAME_TILE_SIZE);

	if(world.brickAt(left, top) || world.brickAt(left, mid) || world.brickAt(left, bottom)){
		this.pos.x = (left+1)*GAME_TILE_SIZE + this.image.width/2;
		this.velocity.x = 0;
	}else if(world.brickAt(right, top) || world.brickAt(right, mid) || world.brickAt(right, bottom)){
		this.pos.x = right*GAME_TILE_SIZE - this.image.width/2;
		this.velocity.x = 0;
	}

	this.pos.y += this.velocity.y * delta/1000;
	left = Math.floor((this.pos.x - this.image.width/2) / GAME_TILE_SIZE);
	right = Math.floor((this.pos.x - 1 + this.image.width/2) / GAME_TILE_SIZE);
	top = Math.floor((this.pos.y - this.image.height/2) / GAME_TILE_SIZE);
	bottom = Math.floor((this.pos.y + this.image.height/2) / GAME_TILE_SIZE);

	if(world.brickAt(left, top) || world.brickAt(right, top)){
		this.pos.y = (top+1)*GAME_TILE_SIZE + this.image.height/2;
		this.velocity.y = 0;
	}else if(world.brickAt(left, bottom) || world.brickAt(right, bottom)){
		this.pos.y = bottom*GAME_TILE_SIZE - this.image.height/2;
		this.velocity.y = 0;
	}
}

Entity.prototype.onGround = function(){
	var tileX = Math.floor(this.pos.x/GAME_TILE_SIZE);
	var testY = Math.floor((this.pos.y + this.image.height/2 + 1)/GAME_TILE_SIZE);
	return world.brickAt(tileX, testY);
}

Entity.prototype.jump = function(velocity){
	var tileX = Math.floor(this.pos.x/GAME_TILE_SIZE);
	var testY = Math.floor((this.pos.y + this.image.height/2 + 1)/GAME_TILE_SIZE);
	if(this.onGround()){
		this.velocity.y = -velocity;
	}
}

Entity.prototype.render = function(){
	ctx.drawImage(
		this.image,
		this.pos.x - this.image.width/2,
		this.pos.y - this.image.height/2
	);
}
