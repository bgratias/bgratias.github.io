//Constructor for the horde
function Horde() {
	//an array of zombies
	this.zombies = [];

	//call each zombies drawing code and update it's location ready to be drawn again
	this.drawZombies = function() {
		for (var i = 0; i < this.zombies.length; i++) {
			this.zombies[i].draw();
			this.zombies[i].updateLocation();
		}
	}

	//add n zombies to the horde
	this.addZombies = function(n) {
		for (var i = 0; i < n; i++) {
			this.zombies.push(new zombie(random(20, height - 50)))
		}
	}
	
	this.checkZombiesClick = function(clickX, clickY){
		
		for (var i = 0; i < this.zombies.length; i++) {
			this.zombies[i].clicked(clickX, clickY);
			if(this.zombies[i].health <= 0){
				this.zombies.splice(i,1);
				this.addZombies(1);
			}
		}
	}
}