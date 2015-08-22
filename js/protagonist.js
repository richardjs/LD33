'use strict';

var IMAGE_PROTAGONIST = document.getElementById('IMAGE_PROTAGONIST');

function Protagonist(){
	Entity.call(this, {
		image: IMAGE_PROTAGONIST
	});
}

Protagonist.prototype = Object.create(Entity.prototype);
Protagonist.prototype.constructor = Protagonist;
