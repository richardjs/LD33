'use strict';

var LEVEL_MIN_HEIGHT = 2
var LEVEL_MAX_HEIGHT = 12
var LEVEL_MAX_CHANGE = 2
var LEVEL_CHANGE_BEGIN_CHANCE = .25;
var LEVEL_CHANGE_CONTINUE_CHANCE = .75;
var LEVEL_CHANGE_REVERSE_CHANCE = 0;
var LEVEL_RANDOM_PLACE_CHANCE = .025;
var LEVEL_PIT_CHANCE = .1;
var LEVEL_PIT_MIN_WIDTH = 2;
var LEVEL_PIT_MAX_WIDTH = 4;

function generateLevel(){
	// Build hills
	var height = randomRange(LEVEL_MIN_HEIGHT, LEVEL_MAX_HEIGHT);
	var changeDir = 0;
	
	for(var x = 0; x < GAME_WIDTH; x++){
		for(var y = GAME_HEIGHT - height; y < GAME_HEIGHT; y++){
			world.addBrick({x: x, y: y});
		}

		var lastHeight = height;
		height += changeDir * randomRange(1, LEVEL_MAX_CHANGE);
		if(height > LEVEL_MAX_HEIGHT || height < LEVEL_MIN_HEIGHT){
			changeDir = 0;
			height = lastHeight;
		}

		if(changeDir === 0){
			if(Math.random() < LEVEL_CHANGE_BEGIN_CHANCE){
				changeDir = randomSign();
			}
		}else{
			if(Math.random() >= LEVEL_CHANGE_CONTINUE_CHANCE){
				changeDir = 0;
			}else{
				if(Math.random() < LEVEL_CHANGE_REVERSE_CHANCE){
					changeDir *= -1;
				}
			}
		}
	}

	// Random placement
	for(var x = 0; x < GAME_WIDTH; x++){
		for(var y = 0; y < GAME_HEIGHT; y++){
			if(Math.random() < LEVEL_RANDOM_PLACE_CHANCE){
				//world.addBrick({x: x, y: y});
			}
		}
	}

	// Dig pits
	for(var x = 1; x < GAME_WIDTH - 1 - LEVEL_PIT_MIN_WIDTH; x++){
		if(Math.random() < LEVEL_PIT_CHANCE){
			var width = randomRange(LEVEL_PIT_MIN_WIDTH, LEVEL_PIT_MAX_WIDTH);
			for(var wx = x; wx < x + width; wx++){
				if(wx === GAME_WIDTH - 1){
					break;
				}

				for(var y = 0; y < GAME_HEIGHT; y++){
					if(world.brickAt(wx, y)){
						world.removeBrick({x: wx, y: y});
					}
				}
			}
			x += width;	
		}
	}
}
