'use strict';

function Controller(){
	this.buttons = {};

	window.addEventListener('keydown', function(event){
		volumeSlider.blur();
		switch(event.which){
			case 37:
			case 65:
			case 81:
				this.buttons['left'] = true;
				break;
			case 39:
			case 68:
				this.buttons['right'] = true;
				break;
			case 32:
			case 38:
			case 87:
			case 90:
				this.buttons['jump'] = true;
				break;
			case 80:
				this.buttons.paused = !this.buttons.paused;
				break;
			case 13:
				this.buttons.paused = true;
				if(!window.shownInstructions){
					showInstructions();
					window.shownInstructions = true;
				}else if(typeof(world) === 'undefined' || world.finished || confirm('Are you sure you want to go to a new level?')){
					start()
				}
		}
	}.bind(this));

	window.addEventListener('keyup', function(event){
		switch(event.which){
			case 37:
			case 65:
			case 81:
				this.buttons['left'] = false;
				break;
			case 39:
			case 68:
				this.buttons['right'] = false;
				break;
			case 32:
			case 38:
			case 87:
			case 90:
				this.buttons['jump'] = false;
				break;
		}
	}.bind(this));
}
