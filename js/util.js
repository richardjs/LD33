'use strict';

Array.prototype.update = function(delta){
	for(var i = 0; i < this.length; i++){
		this[i].update(delta);
	};
}

Array.prototype.render = function(){
	for(var i = 0; i < this.length; i++){
		this[i].render();
	};
}

Array.prototype.remove = function(obj){
	this.splice(this.indexOf(obj), 1);
}

function randomRange(min, max){
	return Math.floor(Math.random() * (max-min)) + min
}

function randomSign(){
	if(Math.random() < .5){
		return -1;
	}else{
		return 1;
	}
}
