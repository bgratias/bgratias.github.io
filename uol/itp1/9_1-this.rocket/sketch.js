/// <reference path="/Users/bgmacbook/Documents/UoL Computer Science/ITP1/p5.intellisense/p5.global-mode.d.ts" />

var rocket; 
var baseLine;

function setup()
{
    createCanvas(800, 600);
    
    baseLine = height - 100
	let GRAVITY = createVector(0,4);

    rocket = {
		vpos: createVector(width/2,baseLine),
		vTHRUST_VEL: createVector(0,-10),
		vProjectile: createVector(15,0),
		vPROJECTILE_VEL: createVector(0,-20),
        thrust: false, 
        moveLeft: false,
        moveRight: false,
		shoot: false,
		draw: function(){
			fill(180)
			beginShape();
				vertex(this.vpos.x + 5, this.vpos.y + 60);
				vertex(this.vpos.x + 5, this.vpos.y + 20);
				vertex(this.vpos.x + 15, this.vpos.y);
				vertex(this.vpos.x + 25, this.vpos.y + 20);
				vertex(this.vpos.x + 25, this.vpos.y + 60);
			endShape(CLOSE);
			fill(255);
			ellipse(this.vpos.x + 15, this.vpos.y + 30, 10);
			
			fill(255, 0, 0);
			beginShape();
				vertex(this.vpos.x -5, this.vpos.y + 60);
				vertex(this.vpos.x + 5, this.vpos.y + 40);
				vertex(this.vpos.x + 5, this.vpos.y + 60);
			endShape(CLOSE);
			
			beginShape();
				vertex(this.vpos.x + 35, this.vpos.y + 60);
				vertex(this.vpos.x + 25, this.vpos.y + 40);
				vertex(this.vpos.x + 25, this.vpos.y + 60);
			endShape(CLOSE);
			
			if (this.thrust){
				fill(255, 150, 0);
				beginShape();
					vertex(this.vpos.x + 10, this.vpos.y + 60);
					vertex(this.vpos.x + 13, this.vpos.y + 80);
					vertex(this.vpos.x + 15, this.vpos.y + 70);
					vertex(this.vpos.x + 18, this.vpos.y + 80);
					vertex(this.vpos.x + 20, this.vpos.y + 60);
				endShape(CLOSE);
			}
		},
		move: function(){
			if (this.thrust && this.vpos.y > 0){
				this.vpos.add(this.vTHRUST_VEL);
				this.vpos.add(GRAVITY);
			}else if (this.vpos.y < baseLine){
				this.vpos.add(GRAVITY);
			}
		
			if (this.moveLeft && this.vpos.x > 0 && this.vpos.y != baseLine){
				this.vpos.x -= 3;
			}
		
			if (this.moveRight && this.vpos.x < width && this.vpos.y != baseLine){
				this.vpos.x += 3;
			}		
		},
		drawProjectile: function(){
			fill(255,0,0);
			ellipse(this.vProjectile.x,this.vProjectile.y,10);
		},
		moveProjectile: function(){
			this.vProjectile.add(this.vPROJECTILE_VEL);
			this.vProjectile.add(GRAVITY);
		},
		reloadProjectile: function(){
			this.vProjectile.x = 15;
			this.vProjectile.y = 0;
		},
		checkProjectile: function(){
			if(this.vProjectile.y < 0){
				rocket.shoot = false;
			}
		}
    }
}
function draw()
{
    background(10);
    rocket.move();
	rocket.draw();

	if(rocket.shoot){
		rocket.moveProjectile();
		rocket.drawProjectile();
		rocket.checkProjectile();
	} 
}

function keyPressed()
{
	if (key == "W"){
		rocket.thrust = true;
	}

	if (key == "A"){
		rocket.moveLeft = true;
	}

	if (key == "D"){
		rocket.moveRight = true;
	}

	if(key == "F"){
		rocket.reloadProjectile();
		rocket.vProjectile.add(rocket.vpos);
		rocket.shoot = true;
    }
}

function keyReleased()
{
    if(key == "W"){
	   rocket.thrust = false;
    }
    
    if(key == "A"){
	   rocket.moveLeft = false;
    }
    
    if(key == "D")
    {
	   rocket.moveRight = false;
    }
	
}