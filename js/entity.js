'use strict';

function Entity(options){
	this.pos = options.pos || {x: 0, y: 0};
	this.velocity = options.velocity || {x: 0, y:0};

	this.image = options.image;
	this.flipImage = options.flipImage;
}

Entity.prototype.update = function(delta){
	this.velocity.y += GRAVITY * delta/1000;

	// Land on bricks
	var footTile = {
		x: Math.floor(this.pos.x / GAME_TILE_SIZE),
		y: Math.floor((this.pos.y + this.image.height/2) / GAME_TILE_SIZE)
	}
	if(world.bricks[footTile.x][footTile.y]){
		this.pos.y = footTile.y*GAME_TILE_SIZE - this.image.height/2;
		if(this.velocity.y > 0){
			this.velocity.y = 0;
		}
	}

	this.pos.x += this.velocity.x * delta/1000;
	this.pos.y += this.velocity.y * delta/1000;
}

Entity.prototype.render = function(){
	ctx.drawImage(
		this.image,
		this.pos.x - this.image.width/2,
		this.pos.y - this.image.height/2
	);
}
