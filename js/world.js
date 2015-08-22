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
	this.brickList = [];
}

World.prototype.addBrick = function(pos){
	this.bricks[pos.x][pos.y] = true;
	this.brickList.push(pos);
}

World.prototype.removeBrick = function(pos){
	this.bricks[pos.x][pos.y] = false;
	var newList = [];
	for(var i = 0; i < this.brickList.length; i++){
		if(this.brickList[i].x !== pos.x || this.brickList[i].y !== pos.y){
			newList.push(this.brickList[i]);
		}
	}
	this.brickList = newList;
}

World.prototype.brickAt = function(x, y){
	if(x < 0) x = 0;
	if(x >= GAME_WIDTH) x = GAME_WIDTH - 1;
	if(y < 0) y = 0;
	if(y >= GAME_HEIGHT) y = GAME_HEIGHT - 1;
	return this.bricks[x][y];
}

World.prototype.getGroundAt = function(x){
	var tileX = Math.floor(x/30);
	for(var tileY = GAME_HEIGHT - 1; tileY > 0; tileY--){
		if(!this.brickAt(tileX, tileY)){
			return (tileY+1)*GAME_TILE_SIZE - 1;
		}
	}
}

World.prototype.update = function(delta){
	this.entities.update(delta);
}

World.prototype.protagonistFinish = function(){
	//world.entities.push(new Protagonist());
}

World.prototype.protagonistKill = function(){
	world.entities.push(new Protagonist());
}

World.prototype.renderBricks = function(){
	for(var i = 0; i < this.brickList.length; i++){
		var pos = this.brickList[i];
		ctx.drawImage(IMAGE_BRICK, GAME_TILE_SIZE*pos.x, GAME_TILE_SIZE*pos.y);
	}
}

World.prototype.render = function(){
	ctx.fillStyle = '#5555ff';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	this.renderBricks();
	this.entities.render();
}
