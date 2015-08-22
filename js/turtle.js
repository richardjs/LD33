'use strict';

var IMAGE_TURTLE = document.getElementById('IMAGE_TURTLE');

var TURTLE_SPEED = 100;

function Turtle(){
	this.image = IMAGE_TURTLE;
	this.flipImage = false;
	Entity.call(this, {
		pos: {x: 140, y: 0},
		image: IMAGE_TURTLE
	});
}

Turtle.prototype = Object.create(Entity.prototype);
Turtle.prototype.constructor = Turtle;

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
		var testY = Math.floor((this.pos.y + this.image.height/2 + 1)/GAME_TILE_SIZE);
		if(world.bricks[Math.floor(this.pos.x/GAME_TILE_SIZE)][testY]){
			this.velocity.y = -350;
		}
	}

	Entity.prototype.update.call(this, delta);

	if(this.pos.x - this.image.width/2 < 0){
		this.pos.x = this.image.width/2
	}
	if(this.pos.x + this.image.width/2 > canvas.width){
		this.pos.x = canvas.width - this.image.width/2;
	}
}
