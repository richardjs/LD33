'use strict';

function Controller(){
	this.buttons = {};

	window.addEventListener('keydown', function(event){
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
		}
	}.bind(this));
}
