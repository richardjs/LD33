'use strict';

var IMAGE_PROTAGONIST = document.getElementById('IMAGE_PROTAGONIST');

var PROTAGONIST_VELOCITY_MIN = 125;
var PROTAGONIST_VELOCITY_MAX = 250;
var PROTAGONIST_JUMP_VELOCITY_MIN = 300;
var PROTAGONIST_JUMP_VELOCITY_MAX = 500;
var PROTAGONIST_JUMP_DISTANCE_MIN = 25;
var PROTAGONIST_JUMP_DISTANCE_MAX = 350

function Protagonist(){
	Entity.call(this, {
		pos: {x: -3*GAME_TILE_SIZE, y: world.getGroundAt(0)},
		image: IMAGE_PROTAGONIST
	});

	this.velocity.x = randomRange(PROTAGONIST_VELOCITY_MIN, PROTAGONIST_VELOCITY_MAX);

	this.jumpVelocity = randomRange(PROTAGONIST_JUMP_VELOCITY_MIN, PROTAGONIST_JUMP_VELOCITY_MAX);
	this.jumpDistance = randomRange(PROTAGONIST_JUMP_DISTANCE_MIN, PROTAGONIST_JUMP_DISTANCE_MAX);
}

Protagonist.prototype = Object.create(Entity.prototype);
Protagonist.prototype.constructor = Protagonist;

Protagonist.prototype.update = function(delta){
	Entity.prototype.update.call(this, delta);

	var playerDistance = world.player.pos.x - this.pos.x;
	if(playerDistance > 0 && playerDistance < this.jumpDistance){
		this.jump(this.jumpVelocity);
	}

	if(this.pos.x -  this.image.width/2 > canvas.width){
		world.entities.remove(this);
		world.protagonistFinish();
	}
}
