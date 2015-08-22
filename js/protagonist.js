'use strict';

var IMAGE_PROTAGONIST = document.getElementById('IMAGE_PROTAGONIST');

function Protagonist(){
	Entity.call(this, {
		image: IMAGE_PROTAGONIST
	});

	this.velocity.x = 200;
}

Protagonist.prototype = Object.create(Entity.prototype);
Protagonist.prototype.constructor = Protagonist;
