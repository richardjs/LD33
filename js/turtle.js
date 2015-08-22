'use strict';

function Turtle(){
	this.pos = {
		x: 0,
		y: 0
	}

	this.image = document.getElementById('IMAGE_TURTLE');
}

Turtle.prototype.update = function(delta){
	this.pos.y += 10*delta/1000;
}

Turtle.prototype.render = function(){
	ctx.drawImage(this.image, this.pos.x, this.pos.y);
}
