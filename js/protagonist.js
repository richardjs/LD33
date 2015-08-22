'use strict';

var IMAGE_PROTAGONIST = document.getElementById('IMAGE_PROTAGONIST');

var PROTAGONIST_VELOCITY_MIN = 125;
var PROTAGONIST_VELOCITY_MAX = 250;
var PROTAGONIST_JUMP_VELOCITY_MIN = 300;
var PROTAGONIST_JUMP_VELOCITY_MAX = 500;
var PROTAGONIST_JUMP_DISTANCE_MIN = 25;
var PROTAGONIST_JUMP_DISTANCE_MAX = 350

var PROTAGONIST_RANDOM_JUMP_INTERVAL = 250;

function Protagonist(){
	Entity.call(this, {
		pos: {x: -3*GAME_TILE_SIZE, y: world.getGroundAt(0)},
		image: IMAGE_PROTAGONIST
	});

	this.velocity.x = randomRange(PROTAGONIST_VELOCITY_MIN, PROTAGONIST_VELOCITY_MAX);

	this.jumpVelocity = randomRange(PROTAGONIST_JUMP_VELOCITY_MIN, PROTAGONIST_JUMP_VELOCITY_MAX);
	this.jumpDistance = randomRange(PROTAGONIST_JUMP_DISTANCE_MIN, PROTAGONIST_JUMP_DISTANCE_MAX);
	this.randomJumpChance = Math.random()/4;
	this.randomJumpTimer = 0;
}

Protagonist.prototype = Object.create(Entity.prototype);
Protagonist.prototype.constructor = Protagonist;

Protagonist.prototype.update = function(delta){
	Entity.prototype.update.call(this, delta);

	var playerDistance = world.player.pos.x - this.pos.x;
	if(playerDistance > 0 && playerDistance < this.jumpDistance){
		this.jump(this.jumpVelocity);
	}

	if(this.randomJumpTimer <= 0){
		if(Math.random() < this.randomJumpChance){
			this.jump(this.jumpVelocity);
		}
		this.randomJumpTimer += PROTAGONIST_RANDOM_JUMP_INTERVAL;
	}
	this.randomJumpTimer -= delta;

	if(Math.abs(playerDistance) < this.image.width/2 + world.player.image.width/2){
		var yDistance = Math.abs(this.pos.y - world.player.pos.y);
		if(yDistance < this.image.height/2 + world.player.image.height/2){
			this.kill();
		}
	}

	if(this.pos.x -  this.image.width/2 > canvas.width){
		world.entities.remove(this);
		world.protagonistFinish();
	}
}

Protagonist.prototype.kill = function(){
	world.entities.remove(this);
	world.protagonistKill();
}
