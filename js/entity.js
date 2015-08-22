'use strict';

function Entity(options){
	this.pos = options.pos || {x: 0, y: 0};
	this.velocity = options.velocity || {x: 0, y:0};

	this.image = options.image;
	this.flipImage = options.flipImage;
}

Entity.prototype.update = function(delta){
	this.velocity.y += GRAVITY * delta/1000;

	/*
	// Land on bricks
	var footTile = {
		x: Math.floor(this.pos.x / GAME_TILE_SIZE),
		y: Math.floor((this.pos.y + this.image.height/2) / GAME_TILE_SIZE)
	}
	if(footTile.x < 0){
		footTile.x = 0;
	}
	if(footTile.x >= GAME_WIDTH){
		footTile.x = GAME_WIDTH - 1;
	}
	if(world.bricks[footTile.x][footTile.y]){
		this.pos.y = footTile.y*GAME_TILE_SIZE - this.image.height/2;
		if(this.velocity.y > 0){
			this.velocity.y = 0;
		}
	}
	*/

	var lastX = this.pos.x;
	var lastY = this.pos.y;
	this.pos.x += this.velocity.x * delta/1000;
	this.pos.y += this.velocity.y * delta/1000;

	// Brick collision
	var left = Math.floor((this.pos.x - this.image.width/2) / GAME_TILE_SIZE);
	var right = Math.floor((this.pos.x + this.image.width/2) / GAME_TILE_SIZE);
	var top = Math.floor((this.pos.y - this.image.height/2) / GAME_TILE_SIZE);
	var bottom = Math.floor((this.pos.y + this.image.height/2) / GAME_TILE_SIZE);
	

	if(world.brickAt(left, top) && world.brickAt(left, bottom)){
		this.pos.x = left*GAME_TILE_SIZE - this.image.height/2;
		this.velocity.x = 0;
	}
	if(world.brickAt(left, bottom) && world.brickAt(right, bottom)){
		this.pos.y = bottom*GAME_TILE_SIZE - this.image.height/2;
		this.velocity.y = 0;
	}

	/*
	if(world.brickAt(left, top)){
		var lastLeft = Math.floor((lastX - this.image.width/2) / GAME_TILE_SIZE);
		var lastTop = Math.floor((lastY - this.image.height/2) / GAME_TILE_SIZE);
		if(!world.brickAt(lastLeft, top)){
			this.pos.x = (left+1)*GAME_TILE_SIZE + this.image.width/2;
			this.velocity.x = 0;
		}
		if(!world.brickAt(left, lastTop)){
			this.pos.y = (top+1)*GAME_TILE_SIZE + this.image.height/2;
			this.velocity.y = 0;
		}
	}
	if(world.brickAt(right, top)){
		var lastRight = Math.floor((lastX + this.image.width/2) / GAME_TILE_SIZE);
		var lastTop = Math.floor((lastY - this.image.height/2) / GAME_TILE_SIZE);
		if(!world.brickAt(lastRight, top)){
			this.pos.x = right*GAME_TILE_SIZE - this.image.width/2;
			this.velocity.x = 0;
		}
		if(world.brickAt(right, lastTop)){
			this.pos.y = (top+1)*GAME_TILE_SIZE + this.image.height/2;
			this.velocity.y = 0;
		}
	}
	if(world.brickAt(left, bottom)){
		var lastLeft = Math.floor((lastX - this.image.width/2) / GAME_TILE_SIZE);
		var lastBottom = Math.floor((lastY + this.image.height/2) / GAME_TILE_SIZE);
		if(!world.brickAt(lastLeft, bottom)){
			this.pos.x = (left+1)*GAME_TILE_SIZE + this.image.width/2;
			this.velocity.x = 0;
		}
		if(!world.brickAt(left, lastBottom)){
			this.pos.y = bottom*GAME_TILE_SIZE - this.image.height/2;
			this.velocity.y = 0;
		}
	}
	if(world.brickAt(right, bottom)){
		var lastRight = Math.floor((lastX + this.image.width/2) / GAME_TILE_SIZE);
		var lastBottom = Math.floor((lastY + this.image.height/2) / GAME_TILE_SIZE);
		if(!world.brickAt(lastRight, top)){
			this.pos.x = right*GAME_TILE_SIZE - this.image.width/2;
			this.velocity.x = 0;
		}
		if(!world.brickAt(left, lastBottom)){
			this.pos.y = bottom*GAME_TILE_SIZE - this.image.height/2;
			this.velocity.y = 0;
		}
	}
	*/
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
