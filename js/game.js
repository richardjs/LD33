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
	
	window.ctx = canvas.getContext('2d');

	var iterations = 0;
	do{
		window.world = new World();
		generateLevel();

		// Test level
		for(var i = 0; i < 100; i++){
			world.entities.push(new Protagonist());
		}
		for(var t = 0; t < 5*60*1000; t += 50){
			world.update(50);
		}
		for(var i = 0; i < world.entities.length; i++){
				world.entities[i].reset();
		}
		world.protagonistSuccesses = 0;
		world.protagonistFails = 0;
		var elapsed = 0;
		while(world.protagonistSuccesses + world.protagonistFails < 1000){
			world.update(50);
			elapsed += 50;
			if(elapsed > 10*60*1000){
				console.log('could\'t finish evaluating world');
				break;
			}
		}
		
		iterations++;
		if(iterations > 50){
			console.log('cutting level generation short');
			break;
		}
	}while(world.protagonistSuccesses/(world.protagonistSuccesses+world.protagonistFails) < .9);
	for(var i = 0; i < world.entities.length; i++){
			world.entities[i].reset();
	}
	world.protagonistPool = world.entities;
	world.entities = [];
	world.protagonistSuccesses = 0;
	world.protagonistFails = 0;

	window.controller = new Controller();

	world.player = new Turtle();
	world.entities.push(world.player);
	world.addProtagonist();

	var lastTime = null;
	function frame(time){
		if(lastTime === null){
			var delta = time - lastTime;
			lastTime = time
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

		ctx.fillStyle = 'black';
		ctx.font = '30pt veranda';
		ctx.fillText(
			world.protagonistSuccesses / (world.protagonistSuccesses+world.protagonistFails),
			10, 30
		);

		requestAnimationFrame(frame);
	}
	requestAnimationFrame(frame);
});
