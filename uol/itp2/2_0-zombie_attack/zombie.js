//constructor for the Zombies
function zombie(y) {
	//initial x so all zombies start to the left of the screen
	this.x = -10;
	this.y = y;
	//set a random speed
	this.speed = random(0.2, 0.5);
	this.health = 100;
	this.wasHit = false;

	let healthyColour = color(0,255,0);
	let unhealthyColour = color(255,0,0);

	//draw the zombie to the screen
	this.draw = function() {
		push();
		//arms
		fill(128, 0, 128);
		rect(this.x - 10, this.y - 50, 65, 15);
		rect(this.x - 10, this.y + 35, 65, 15);
		//shoulders
		rect(this.x - 20, this.y - 50, 35, 100, 10);
		//head
		if(this.wasHit){
			fill(255,0,0);
			this.wasHit=false;
		}else{
			fill(50);
		}
		ellipse(this.x, this.y, 50);
		//healthbar
		fill(lerpColor(unhealthyColour, healthyColour, this.health/100))
		rect(this.x-25, this.y-30, this.health/2, 4)
		pop();
	}

	//update the zombies x location as it lumbers across the screen
	this.updateLocation = function() {
		this.x += this.speed;
	}

	this.clicked = function(clickX,clickY){
		let headDist = dist(clickX, clickY, this.x, this.y);
		if(headDist<25){
			this.health = this.health - random(5,40);
			this.wasHit = true;
		}
	}
}