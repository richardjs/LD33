'use strict';

var GAME_TILE_SIZE = 30;
var GAME_WIDTH = 35;
var GAME_HEIGHT = 20;

var GRAVITY = 700;

window.addEventListener('load', function(){
	window.canvas = document.createElement('canvas');
	document.body.appendChild(canvas);

	canvas.width = GAME_WIDTH*GAME_TILE_SIZE;
	canvas.height = GAME_HEIGHT*GAME_TILE_SIZE;
	
	/*
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	window.addEventListener('resize', function(){
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	});
	*/

	window.ctx = canvas.getContext('2d');

	window.world = new World();
	window.controller = new Controller();

	world.player = new Turtle();
	world.entities.push(world.player);

	for(var i = 0; i < 1; i++){
		world.entities.push(new Protagonist());
	}

	var lastTime = null;
	function frame(time){
		if(lastTime === null){
			var delta = time - lastTime;
			lastTime = time;
			requestAnimationFrame(frame);
			return;
		}

		var delta = time - lastTime;
		lastTime = time;

		while(delta > 50){
			world.update(50);
			delta -= 50;
		}
		world.update(delta);
		world.render();

		requestAnimationFrame(frame);
	}
	requestAnimationFrame(frame);
});
