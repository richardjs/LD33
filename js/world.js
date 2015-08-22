'use strict';

var IMAGE_BRICK = document.getElementById('IMAGE_BRICK');

var WORLD_PROTAGONIST_SPAWN_DELAY = 20000;
var WORLD_PROTAGONIST_MIN_SPAWN_INTERVAL = 5000;
var WORLD_PROTAGONIST_MAX_SPAWN_INTERVAL = 10000;
// Spawn more protagonists if the player's kill rate is above this fraction
var WORLD_PROTAGONIST_SPAWN_SCORE = .5;

function World(){
	this.entities = [];

	// Lookup array of bricks
	this.bricks = [];
	for(var i = 0; i < GAME_WIDTH; i++){
		this.bricks.push([]);
	}
	// List of bricks, for rendering
	this.brickList = [];

	this.protagonistSuccesses = 0;
	this.protagonistFails = 0;

	this.protagonistSpawnDelayTimer = 0;
	this.protagonistSpawnTimer = 0;
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

World.prototype.addProtagonist = function(){
	if(this.protagonistPool.length){
		this.entities.push(this.protagonistPool.pop());
	}
}

World.prototype.update = function(delta){
	this.entities.update(delta);

	if(this.protagonistPool){
		if(this.protagonistSpawnDelayTimer < WORLD_PROTAGONIST_SPAWN_DELAY){
			this.protagonistSpawnDelayTimer += delta;
		}else{
			if(this.protagonistSpawnTimer <= 0){
				if(this.protagonistSuccesses+this.protagonistFails > 0
						&& this.protagonistFails / (this.protagonistSuccesses+this.protagonistFails) > WORLD_PROTAGONIST_SPAWN_SCORE){
					var count = Math.floor(this.entities.length/3) + 1;
					console.log('spawning ' + count);
					for(var i = 0; i < count; i++){
						this.addProtagonist();
					}
				}
				this.protagonistSpawnTimer = randomRange(WORLD_PROTAGONIST_MIN_SPAWN_INTERVAL, WORLD_PROTAGONIST_MAX_SPAWN_INTERVAL);
			}
			this.protagonistSpawnTimer -= delta;
		}

		var total = this.protagonistSuccesses+this.protagonistFails;
		if(total > 50){
			this.protagonistSuccesses = 50 * this.protagonistSuccesses/total;
			this.protagonistFails = 50 * this.protagonistFails/total;
		}
	}
}

World.prototype.protagonistFinish = function(){
	this.protagonistSuccesses++;
}

World.prototype.protagonistKill = function(protagonist){
	this.protagonistFails++;
	this.entities.remove(protagonist);
	if(!this.protagonistPool){
		this.entities.push(new Protagonist());
	}else{
		this.protagonistPool.unshift(protagonist);
		this.addProtagonist();
	}
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

	var stars = [];
	for(var i = 0; i < this.entities.length; i++){
		var entity = this.entities[i];
		if(entity.star){
			stars.push(entity);
			continue;
		}
		entity.render();
	}
	stars.render();
}
