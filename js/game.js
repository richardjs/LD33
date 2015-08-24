'use strict';

var IMAGE_START = document.getElementById('IMAGE_START');
var IMAGE_INSTRUCTIONS = document.getElementById('IMAGE_INSTRUCTIONS');
//var IMAGE_GENERATING = document.getElementById('IMAGE_GENERATING');
var IMAGE_HIGHSCORES = document.getElementById('IMAGE_HIGHSCORES');

var GAME_TILE_SIZE = 30;
var GAME_WIDTH = 35;
var GAME_HEIGHT = 20;

var GRAVITY = 800;

var GAME_PROTAGONISTS = 5;
var GAME_PROTAGONISTS_TO_KILL = 100;

var GAME_PROTAGONIST_KILL_POINTS = 1000
var GAME_PROTAGONIST_KILL_CHAIN_BONUS = 500;
var GAME_PROTAGONIST_FINISH_PENALTY = 100;
var GAME_TURTLE_DEATH_PENALTY = 500;

window.addEventListener('load', function(){
	window.canvas = document.getElementById('screen');

	canvas.width = GAME_WIDTH*GAME_TILE_SIZE;
	canvas.height = GAME_HEIGHT*GAME_TILE_SIZE;

	var margin = (window.innerHeight - canvas.height) / 3;
		canvas.style.margin = margin + "px auto 10px auto";
	window.addEventListener('resize', function(){
		var margin = (window.innerHeight - canvas.height) / 3;
		canvas.style.margin = margin + "px auto 10px auto";
	});
	
	window.ctx = canvas.getContext('2d');

	window.shownInstructions = false;
	window.controller = new Controller();

	if(!localStorage.getItem('scores')){
		localStorage.setItem('scores', JSON.stringify([
			{name: 'Jacsn', score: 1275900},
			{name: 'Josh', score: 587600},
			{name: 'Brock', score: 446000},
			{name: 'Victor', score: 305600},
			{name: 'Richard', score: 271300},
			{name: 'Garrett', score: 260000},
			{name: 'Nick', score: 226900},
			{name: 'Stuart', score: 221500},
			{name: 'Stephen', score: 137000},
			{name: 'Mareo', score: 75900}
		]));
	}

	var volumeControl = document.getElementById('volumeControl');
	window.volumeSlider = document.getElementById('volumeSlider');
	volumeControl.style.marginLeft = canvas.getBoundingClientRect().left + 'px';
	window.addEventListener('resize', function(){
		volumeControl.style.marginLeft = canvas.getBoundingClientRect().left + 'px';
	});

	Howler.volume(volumeSlider.value);
	volumeControl.addEventListener('input', function(){
		Howler.volume(volumeSlider.value);
	});
	volumeSlider.addEventListener('focus', function(){
		canvas.focus();
	});

	window.music = new Howl({
		urls: ['music/turtlerag.ogg', 'music/turtlerag.m4a'],
		loop: true
	});

	if(typeof(window.musicPlaying) === 'undefined'){
		music.play();
		window.musicPlaying = true;
	}

	window.wah = new Howl({
		urls: ['sfx/wah.ogg']
	});
	window.dadunk = new Howl({
		urls: ['sfx/dadunk.ogg']
	});

	ctx.drawImage(IMAGE_START, 0, 0);
});

function start(){
	//ctx.drawImage(IMAGE_GENERATING, 0, 0);

	var iterations = 0;
	do{
		if(typeof(animationFrame) !== 'undefined'){
			cancelAnimationFrame(animationFrame);
		}
		window.animationFrame = null;
		
		window.world = new World();
		generateLevel();

		// Test level
		for(var i = 0; i < GAME_PROTAGONISTS; i++){
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
		while(elapsed < 10*60*1000){
			world.update(50);
			elapsed += 50;
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
	world.score = 0;
	world.killChain = 0;

	if(typeof(window.controller) === 'undefined'){
		window.controller = new Controller();
	}else{
		controller.buttons = {};
	}

	world.player = new Turtle();
	world.entities.push(world.player);
	world.addProtagonist();

	var lastTime = null;
	function frame(time){
		if(lastTime === null){
			var delta = time - lastTime;
			lastTime = time
			animationFrame = requestAnimationFrame(frame);
			return;
		}

		var delta = time - lastTime;
		lastTime = time;

		if(controller.buttons.paused){
			ctx.fillStyle = 'white';
			ctx.font = '20px monospace';
			ctx.textAlign = 'center';
			ctx.fillText('*PAUSED*', canvas.width/2, 40);
			animationFrame = requestAnimationFrame(frame);
			return;
		}

		while(delta > 50){
			world.update(50);
			delta -= 50;
		}
		world.update(delta);
		world.render();

		/*
		ctx.fillStyle = 'black';
		ctx.font = '30pt veranda';
		ctx.fillText(
			world.protagonistSuccesses / (world.protagonistSuccesses+world.protagonistFails),
			10, 30
		);
		*/

		ctx.fillStyle = 'white';
		ctx.font = '20px monospace';
		ctx.textAlign = 'right';

		ctx.fillText('Score: ' + world.score, canvas.width - 15, 20);

		var protagonistsRemaining = GAME_PROTAGONISTS_TO_KILL - world.protagonistsKilled;
		ctx.fillText(protagonistsRemaining + ' remaining', canvas.width - 15, 40);
		
		if(!world.finished){
			animationFrame = requestAnimationFrame(frame);
		}else{
			var scores = JSON.parse(localStorage.getItem('scores'));
			var highScore = false;
			if(scores.length < 10){
				highScore = true;
			}else{
				for(var i = 0; i < scores.length; i++){
					if(world.score > scores[i].score){
						highScore = true;
						break;
					}
				}
			}
			if(highScore){
				var name = prompt('High score! What is your name?');
				var added = false;
				for(var i = 0; i < scores.length; i++){
					if(world.score > scores[i].score){
						scores.splice(i, 0, {name: name, score: world.score});
						added = true;
						break;
					}
				}
				if(!added){
					scores.push({name: name, score: world.score});
				}
				scores = scores.slice(0, 10);
				localStorage.setItem('scores', JSON.stringify(scores));
			}
			showHighScores();
		}
	}
	animationFrame = requestAnimationFrame(frame);
}

function showInstructions(){
	ctx.drawImage(IMAGE_INSTRUCTIONS, 0, 0);
}

function showHighScores(){
	ctx.drawImage(IMAGE_HIGHSCORES, 0, 0);

	var scores = JSON.parse(localStorage.getItem('scores'));

	for(var i = 0; i < scores.length; i++){
		var score = scores[i];

		ctx.fillStyle = '#558855';
		ctx.font = '20px monospace';
		ctx.textAlign = 'right';
		ctx.fillText(score.score, 135, 260 + 25*i);
		ctx.textAlign = 'left';
		ctx.fillText(score.name, 150, 260 + 25*i);
	}

	ctx.fillStyle = '#fe0000';
	ctx.textAlign = 'right';
	ctx.fillText(world.score, 135, 260+25*scores.length);
	ctx.textAlign = 'left';
	ctx.fillText('Your score', 150, 260+25*scores.length);
}
