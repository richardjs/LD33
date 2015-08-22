'use strict';

var IMAGE_BRICK = document.getElementById('IMAGE_BRICK');

function World(){
	this.entities = [];

	// Lookup array of bricks
	this.bricks = [];
	for(var i = 0; i < GAME_WIDTH; i++){
		this.bricks.push([]);
	}
	// List of bricks, for rendering
	this.bricksList = [];

	for(var i = 0; i < GAME_WIDTH; i++){
		this.addBrick({x: i, y: GAME_HEIGHT-1});
		this.addBrick({x: i, y: GAME_HEIGHT-2});
	}
}

World.prototype.addBrick = function(pos){
	this.bricks[pos.x][pos.y] = true;
	this.bricksList.push(pos);
}

World.prototype.removeBrick = function(pos){
	this.bricks[pos.x][pos.y] = false;
	this.bricksList.remove(pos);
}

World.prototype.getGroundAt = function(x){
	var tileX = Math.floor(x/30);
	for(var tileY = GAME_HEIGHT - 1; tileY > 0; tileY--){
		if(!this.bricks[tileX][tileY]){
			return (tileY+1)*GAME_TILE_SIZE;
		}
	}
}

World.prototype.update = function(delta){
	this.entities.update(delta);
}

World.prototype.renderBricks = function(){
	for(var i = 0; i < this.bricksList.length; i++){
		var pos = this.bricksList[i];
		ctx.drawImage(IMAGE_BRICK, GAME_TILE_SIZE*pos.x, GAME_TILE_SIZE*pos.y);
	}
}

World.prototype.render = function(){
	ctx.fillStyle = '#5555ff';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	this.renderBricks();
	this.entities.render();
}
