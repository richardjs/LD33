'use strict';

var IMAGE_PROTAGONIST = document.getElementById('IMAGE_PROTAGONIST');

function Protagonist(){
	Entity.call(this, {
		pos: {x: -50, y: world.getGroundAt(0)},
		image: IMAGE_PROTAGONIST
	});

	this.velocity.x = 200;
}

Protagonist.prototype = Object.create(Entity.prototype);
Protagonist.prototype.constructor = Protagonist;

Protagonist.prototype.update = function(delta){
	Entity.prototype.update.call(this, delta);

	var playerDistance = world.player.pos.x - this.pos.x;
	if(playerDistance > 0 && playerDistance < 200){
		this.jump(450);
	}
}
