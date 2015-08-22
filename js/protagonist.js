'use strict';

var IMAGE_PROTAGONIST = document.getElementById('IMAGE_PROTAGONIST');
var IMAGE_PROTAGONIST_WALK = document.getElementById('IMAGE_PROTAGONIST_WALK');

var PROTAGONIST_VELOCITY_MIN = 125;
var PROTAGONIST_VELOCITY_MAX = 250;
var PROTAGONIST_JUMP_VELOCITY_MIN = 300;
var PROTAGONIST_JUMP_VELOCITY_MAX = 500;
var PROTAGONIST_JUMP_DISTANCE_MIN = 60;
var PROTAGONIST_JUMP_DISTANCE_MAX = 350

var PROTAGONIST_ANIMATION_MAX_INTERVAL = 250;
var PROTAGONIST_ANIMATION_MIN_INTERVAL = 50;

var PROTAGONIST_RANDOM_JUMP_INTERVAL = 250;

function Protagonist(){
	Entity.call(this, {
		image: IMAGE_PROTAGONIST,
	});
	this.pos = this.getStartPos();

	this.moveSpeed = randomRange(PROTAGONIST_VELOCITY_MIN, PROTAGONIST_VELOCITY_MAX);

	this.jumpVelocity = randomRange(PROTAGONIST_JUMP_VELOCITY_MIN, PROTAGONIST_JUMP_VELOCITY_MAX);
	this.jumpDistance = randomRange(PROTAGONIST_JUMP_DISTANCE_MIN, PROTAGONIST_JUMP_DISTANCE_MAX);
	this.randomJumpChance = Math.random()/4;
	this.randomJumpTimer = 0;

	this.animationInterval = PROTAGONIST_ANIMATION_MAX_INTERVAL - ((PROTAGONIST_ANIMATION_MAX_INTERVAL - PROTAGONIST_ANIMATION_MIN_INTERVAL) * (this.moveSpeed - PROTAGONIST_VELOCITY_MIN)/(PROTAGONIST_VELOCITY_MAX - PROTAGONIST_VELOCITY_MIN));
	this.animationTimer = this.animationInterval;
}

Protagonist.prototype = Object.create(Entity.prototype);
Protagonist.prototype.constructor = Protagonist;

Protagonist.prototype.getStartPos = function(){
	return {x: -3*GAME_TILE_SIZE, y: world.getGroundAt(0) - this.image.height/2};
}

Protagonist.prototype.update = function(delta){
	this.velocity.x = this.moveSpeed;

	Entity.prototype.update.call(this, delta);

	// Jumping

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

	if(this.velocity.x === 0){
		this.jump(this.jumpVelocity);
	}

	// Collision detection

	if(Math.abs(playerDistance) < this.image.width/2 + world.player.image.width/2){
		var yDistance = Math.abs(this.pos.y - world.player.pos.y);
		if(yDistance < this.image.height/2 + world.player.image.height/2){
			this.kill();
		}
	}

	// Made it across

	if(this.pos.x -  this.image.width/2 > canvas.width){
		world.protagonistFinish();
		this.pos = this.getStartPos();
		this.velocity.y = 0;
	}

	// Animation
	
	if(this.animationTimer < 0){
		if(this.image === IMAGE_PROTAGONIST){
			this.image = IMAGE_PROTAGONIST_WALK;
		}else{
			this.image = IMAGE_PROTAGONIST;
		}
		this.animationTimer += this.animationInterval;
	}
	this.animationTimer -= delta;

	if(!this.onGround()){
		this.image = IMAGE_PROTAGONIST_WALK;
	}else{
		if(this.velocity.x === 0){
			this.image = IMAGE_PROTAGONIST;
		}
	}
}

Protagonist.prototype.kill = function(){
	world.entities.remove(this);
	world.protagonistKill();
}
