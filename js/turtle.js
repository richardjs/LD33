'use strict';

var IMAGE_TURTLE = document.getElementById('IMAGE_TURTLE');

var TURTLE_SPEED = 125;
var TURTLE_JUMP = 350;
var TURTLE_FALL_THRESHOLD = 1000;

function Turtle(){
	this.flipImage = false;
	Entity.call(this, {
		image: IMAGE_TURTLE
	});
	this.pos = this.getStartPos();
}

Turtle.prototype = Object.create(Entity.prototype);
Turtle.prototype.constructor = Turtle;

Turtle.prototype.getStartPos = function(){
	var startX = canvas.width/2;
	while(world.getGroundAt(startX) === canvas.height - 1){
		startX += GAME_TILE_SIZE;
	}
	return {x: startX, y: world.getGroundAt(startX) - this.image.height/2}
}

Turtle.prototype.update = function(delta){
	// Move left and right
	this.velocity.x = 0;
	if(controller.buttons.left){
		this.velocity.x = -TURTLE_SPEED;
		this.flipImage = false;
	}
	if(controller.buttons.right){
		this.velocity.x = TURTLE_SPEED;
		this.flipImage = true;
	}

	// Jump
	if(controller.buttons.jump){
		this.jump(TURTLE_JUMP);
	}

	Entity.prototype.update.call(this, delta);

	// Falling death
	if(this.pos.y - this.image.height/2 > canvas.height + TURTLE_FALL_THRESHOLD){
		this.pos = this.getStartPos();	
		this.velocity = {x: 0, y: 0};
	}

	if(this.pos.x - this.image.width/2 < 0){
		this.pos.x = this.image.width/2
	}
	if(this.pos.x + this.image.width/2 > canvas.width){
		this.pos.x = canvas.width - this.image.width/2;
	}
}
