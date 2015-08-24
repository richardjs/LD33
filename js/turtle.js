'use strict';

var IMAGE_TURTLE = document.getElementById('IMAGE_TURTLE');
var IMAGE_TURTLE_DEAD = document.getElementById('IMAGE_TURTLE_DEAD');
var IMAGE_TURTLE_RIGHT = document.getElementById('IMAGE_TURTLE_RIGHT');
var IMAGE_TURTLE_RIGHT_DEAD = document.getElementById('IMAGE_TURTLE_RIGHT_DEAD');
var IMAGE_TURTLE_WALK = document.getElementById('IMAGE_TURTLE_WALK');
var IMAGE_TURTLE_WALK_DEAD = document.getElementById('IMAGE_TURTLE_WALK_DEAD');
var IMAGE_TURTLE_WALK_RIGHT = document.getElementById('IMAGE_TURTLE_WALK_RIGHT');
var IMAGE_TURTLE_WALK_RIGHT_DEAD = document.getElementById('IMAGE_TURTLE_WALK_RIGHT_DEAD');

var TURTLE_SPEED = 125;
var TURTLE_JUMP = 350;
var TURTLE_FALL_THRESHOLD = 1000;
var TURTLE_INVINCIBILITY_TIME = 1500;

var TURTLE_ANIMATION_INTERVAL = 100;

function Turtle(){
	this.flipImage = false;
	Entity.call(this, {
		image: IMAGE_TURTLE,
	});
	this.pos = this.getStartPos();

	this.animationTimer = 0;
	this.invincibilityTimer = 0;
}

Turtle.prototype = Object.create(Entity.prototype);
Turtle.prototype.constructor = Turtle;

Turtle.prototype.getStartPos = function(){
	var startX = 3*canvas.width/4;
	while(world.getGroundAt(startX) === canvas.height - 1){
		startX += GAME_TILE_SIZE;
	}
	return {x: startX, y: world.getGroundAt(startX) - this.image.height/2}
}

Turtle.prototype.update = function(delta){
	// Move left and right
	if(!this.dead){
		this.velocity.x = 0;
		if(controller.buttons.left){
			this.velocity.x = -TURTLE_SPEED;
			this.flipImage = false;
		} if(controller.buttons.right){
			this.velocity.x = TURTLE_SPEED;
			this.flipImage = true;
		}

		// Jump
		if(controller.buttons.jump){
			this.jump(TURTLE_JUMP);
		}
	}

	Entity.prototype.update.call(this, delta);

	if(this.invincibilityTimer > 0){
		this.invincibilityTimer -= delta;
	}

	// Falling death
	if(this.pos.y - this.image.height/2 > canvas.height + TURTLE_FALL_THRESHOLD){
		this.kill();
	}

	if(this.pos.x - this.image.width/2 < 0){
		this.pos.x = this.image.width/2
	}
	if(this.pos.x + this.image.width/2 > canvas.width){
		this.pos.x = canvas.width - this.image.width/2;
	}

	// Animation
	
	if(this.dead){
		return;
	}

	if(this.velocity.x < 0){
		this.image = IMAGE_TURTLE;
	}else if(this.velocity.x > 0){
		this.image = IMAGE_TURTLE_RIGHT;
	}else{
		if(this.image === IMAGE_TURTLE_WALK){
			this.image = IMAGE_TURTLE;
		}else if(this.image === IMAGE_TURTLE_WALK_RIGHT){
			this.image = IMAGE_TURTLE_RIGHT;
		}
	}
	if((this.animationTimer < 0 && (controller.buttons.left || controller.buttons.right)) || !this.onGround()){
		if(this.image === IMAGE_TURTLE){
			this.image = IMAGE_TURTLE_WALK;
		}else{
			this.image = IMAGE_TURTLE_WALK_RIGHT;
		}
	}

	this.animationTimer -= delta;
	if(this.animationTimer < -TURTLE_ANIMATION_INTERVAL){
		this.animationTimer += 2*TURTLE_ANIMATION_INTERVAL;
	}
}

Turtle.prototype.die = function(){
	if(this.invincibilityTimer > 0){
		return;
	}

	this.dead = true;
	this.velocity.x = 0;
	this.velocity.y = -TURTLE_JUMP;
	this.collideBricks = false;

	switch(this.image){
		case IMAGE_TURTLE:
			this.image = IMAGE_TURTLE_DEAD;
			break;
		case IMAGE_TURTLE_WALK:
			this.image = IMAGE_TURTLE_WALK_DEAD;
			break;
		case IMAGE_TURTLE_RIGHT:
			this.image = IMAGE_TURTLE_RIGHT_DEAD;
			break;
		case IMAGE_TURTLE_WALK_RIGHT:
			this.image = IMAGE_TURTLE_WALK_RIGHT_DEAD;
			break;
	}

	dadunk.play();
}

Turtle.prototype.kill = function() {
	this.dead = false;
	this.collideBricks = true;
	this.pos = this.getStartPos();
	this.velocity = {x: 0, y: 0};
	this.invincibilityTimer = TURTLE_INVINCIBILITY_TIME;
	world.score -= GAME_TURTLE_DEATH_PENALTY;
	world.killChain = 0;
	this.image = IMAGE_TURTLE;
}
