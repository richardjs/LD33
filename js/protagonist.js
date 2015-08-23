'use strict';

var IMAGE_PROTAGONIST = document.getElementById('IMAGE_PROTAGONIST');
var IMAGE_PROTAGONIST_WALK = document.getElementById('IMAGE_PROTAGONIST_WALK');
var IMAGE_PROTAGONIST_STAR = document.getElementById('IMAGE_PROTAGONIST_STAR');
var IMAGE_PROTAGONIST_WALK_STAR = document.getElementById('IMAGE_PROTAGONIST_WALK_STAR');
var IMAGE_PROTAGONIST_DEATH = document.getElementById('IMAGE_PROTAGONIST_DEATH');

var PROTAGONIST_VELOCITY_MIN = 50;
var PROTAGONIST_VELOCITY_MAX = 225;
var PROTAGONIST_JUMP_VELOCITY_MIN = 275;
var PROTAGONIST_JUMP_VELOCITY_MAX = 550;
var PROTAGONIST_JUMP_DISTANCE_MIN = 60;
var PROTAGONIST_JUMP_DISTANCE_MAX = 350

var PROTAGONIST_ANIMATION_MIN_INTERVAL = 50;
var PROTAGONIST_ANIMATION_MAX_INTERVAL = 250;

var PROTAGONIST_STAR_CHANCE = .15;
var PROTAGONIST_STAR_BOOST = 100;
var PROTAGONIST_STAR_FLASH_INTERVAL = 250;

var PROTAGONIST_RANDOM_JUMP_INTERVAL = 250;

var PROTAGONIST_STUCK_DELAY = 10*1000;

function Protagonist(){
	Entity.call(this, {
		image: IMAGE_PROTAGONIST,
	});
	this.reset();
	this.moveSpeed = randomRange(PROTAGONIST_VELOCITY_MIN, PROTAGONIST_VELOCITY_MAX);

	this.jumpVelocity = randomRange(PROTAGONIST_JUMP_VELOCITY_MIN, PROTAGONIST_JUMP_VELOCITY_MAX);
	this.jumpDistance = randomRange(PROTAGONIST_JUMP_DISTANCE_MIN, PROTAGONIST_JUMP_DISTANCE_MAX);
	this.randomJumpChance = Math.random()/4;
	this.randomJumpTimer = 0;

	this.animationInterval = PROTAGONIST_ANIMATION_MAX_INTERVAL - ((PROTAGONIST_ANIMATION_MAX_INTERVAL - PROTAGONIST_ANIMATION_MIN_INTERVAL) * (this.moveSpeed - PROTAGONIST_VELOCITY_MIN)/(PROTAGONIST_VELOCITY_MAX - PROTAGONIST_VELOCITY_MIN));
	this.animationTimer = this.animationInterval;

	this.stuckTimer = 0;
}

Protagonist.prototype = Object.create(Entity.prototype);
Protagonist.prototype.constructor = Protagonist;

Protagonist.prototype.getStartPos = function(){
	return {x: -3*GAME_TILE_SIZE, y: world.getGroundAt(0) - this.image.height/2};
}

Protagonist.prototype.reset = function(){
	this.pos = this.getStartPos();
	this.velocity.y = 0;

	this.star = false;
	if(Math.random() < PROTAGONIST_STAR_CHANCE){
		this.star = true;
		this.starFlashTimer = 0;
	}

	this.dead = false;
	this.collideBricks = true;
}

Protagonist.prototype.update = function(delta){
	if(!this.dead){
		this.velocity.x = this.moveSpeed;
	}
	if(this.star){
		this.velocity.x += PROTAGONIST_STAR_BOOST;
	}

	Entity.prototype.update.call(this, delta);

	// Falling death
	if(this.pos.y - this.image.height/2 > canvas.height){
		this.kill();
	}

	if(this.dead){
		return;
	}

	// Jumping

	if(world.player){
		var playerDistance = world.player.pos.x - this.pos.x;
		if(playerDistance > 0 && playerDistance < this.jumpDistance && !this.star){
			this.jump(this.jumpVelocity);
		}
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

	if(world.getGroundAt(this.pos.x + GAME_TILE_SIZE) === canvas.height - 1){
		this.jump(this.jumpVelocity);
	}

	// Collision detection
	if(world.player && !world.player.dead){
		if(Math.abs(playerDistance) < this.image.width/2 + world.player.image.width/2){
			var yDistance = Math.abs(this.pos.y - world.player.pos.y);
			if(yDistance < this.image.height/2 + world.player.image.height/2){
				if(!this.star){
					if(this.pos.y + this.image.height/4 < world.player.pos.y - world.player.image.height/2
							&& this.velocity.y > 0){
						world.player.die();
						this.velocity.y = -this.jumpVelocity;
					}else{
						this.die();
						return;
					}
				}else{
					world.player.die();
				}
			}
		}
	}

	// Stuck Death
	if(this.velocity.x = 0){
		this.stuckTimer += delta;
		if(this.stuckTimer > PROTAGONIST_STUCK_DELAY){
			this.kill();
		}
	}else{
		this.stuckTimer = 0;
	}

	// Made it across
	if(this.pos.x -  this.image.width/2 > canvas.width){
		if(!this.star){
			world.protagonistFinish();
		}
		this.reset();
	}

	// Animation
	
	if(this.animationTimer < 0){
		if(this.image === IMAGE_PROTAGONIST || this.image === IMAGE_PROTAGONIST_STAR){
			this.image = IMAGE_PROTAGONIST_WALK;
		}else{
			this.image = IMAGE_PROTAGONIST;
		}
		this.animationTimer += this.animationInterval;
	}
	this.animationTimer -= delta;

	if(!this.onGround()){
		this.image = IMAGE_PROTAGONIST_WALK;
	}

	if(this.star){// && this.starFlashTimer < 0){
		if(this.image === IMAGE_PROTAGONIST) this.image = IMAGE_PROTAGONIST_STAR;
		if(this.image === IMAGE_PROTAGONIST_WALK) this.image = IMAGE_PROTAGONIST_WALK_STAR;
	}
	if(this.starFlashTimer < -PROTAGONIST_STAR_FLASH_INTERVAL){
		this.starFlashTimer += 2*PROTAGONIST_STAR_FLASH_INTERVAL;
	}
	this.starFlashTimer -= delta;
}

Protagonist.prototype.die = function(){
	this.dead = true;
	this.velocity.x = 0;
	this.velocity.y = -this.jumpVelocity;
	this.image = IMAGE_PROTAGONIST_DEATH;
	this.collideBricks = false;

	world.score += GAME_PROTAGONIST_KILL_POINTS + GAME_PROTAGONIST_KILL_CHAIN_BONUS*world.killChain;
	world.killChain++;
}

Protagonist.prototype.kill = function(){
	world.protagonistKill(this);
	this.reset();
}
