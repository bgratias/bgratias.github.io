/// <reference path="/Users/bgmacbook/Documents/UoL Computer Science/CM1005 - ITP1/p5.intellisense/p5.global-mode.d.ts" />

var groundHeight;
var mountain1;
var mountain2;
var cloud;
var tree;
var star;
var moon;
var sun;
var darkness;

function setup()
{
	createCanvas(800, 600);
	//set the groundHeight proportional to the canvas size
	groundHeight = (height / 3) * 2;

	//initalise the mountain objects with properties to help draw them to the canvas
	mountain1 = {
		x: 400,
		y: groundHeight,
		height: 320,
		width: 230
	};
	mountain2 = {
		x: 550,
		y: groundHeight,
		height: 200,
		width: 130
	};

	//initalise the tree object
	tree = {
		x: 150,
		y: groundHeight + 20,
		trunkWidth: 40,
		trunkHeight: 150,
		canopyWidth: 120,
		canopyHeight: 100
	};

    //initalise the sun 
	sun = {
		x: 150,
		y: 30,
		diameter: 80,
		colour: 0,
		drop: 0
	};
    
    //TASK: intialise a moon object with an extra property for brightness
	moon = {
		x: 650,
		y: 70,
		diameter: 80,
		brightness: 0
	};
	

	//set the initial darkness
	darkness = 0;

	// initialize the stars
	star = {
		x: 0,
		y: 0,
		count: 0,
		total: 50
	};

	// initialize the clouds
	cloud = {
		x:-150,
		y:100,
		rate: .9
	}


}



function draw()
{
	//TASK: update the values for the moons brightness, the sun's position and the darkness.
	//You can either map this to the mouse's location (i.e. the futher left the mouse is the more daylight) or you can just change the values gradually over time.
	moon.brightness = map(mouseX,0,width,0,255)
	darkness = map(min(mouseX,width),0,width,0,180)
	sun.drop = map(min(mouseX,width),0,width,sun.y,groundHeight+sun.diameter);

	//draw the sky
	background(150, 200, 255);
	noStroke();

	//Stars
	push();
	for (; star.count < star.total; star.count++) {
		star.x=random(0,width)
		star.y=random(0,groundHeight);
		stroke(255);
		strokeWeight(3);
		point(star.x,star.y);
	}
	pop();

	//draw the sun
	fill(255, 255, 0);
	ellipse(sun.x+sun.drop*.7, sun.y+sun.drop, sun.diameter);    
	
	//draw the ground and make it green
	fill(70, 200, 0);
	rect(0, groundHeight, width, height - groundHeight);

	//draw the mountains
	fill(120);
	triangle(mountain1.x, mountain1.y,
		mountain1.x + mountain1.width, mountain1.y,
		mountain1.x + (mountain1.width / 2), mountain1.y - mountain1.height);

	triangle(mountain2.x, mountain2.y,
		mountain2.x + mountain2.width, mountain2.y,
		mountain2.x + (mountain2.width / 2), mountain2.y - mountain2.height);
    
    //TASK: You can draw the tree yourself
	fill(139,69,19);
	rect(tree.x-tree.trunkWidth/2,tree.y-tree.trunkHeight,tree.trunkWidth,tree.trunkHeight);
	fill(0,100,0)
	ellipse(tree.x,tree.y-tree.trunkHeight,tree.canopyWidth,tree.canopyHeight)

	//TASK: make the scene dark by drawing a rectangle that covers the whole canvas.
	//Use the alpha value of fill to determine how dark to make it
	fill(0,darkness);
	rect(0,0,width,height);

    //TASK: you'll need to draw the moon too. Make sure you use brightness to adjust the colour
	fill(255,moon.brightness);
	ellipse(moon.x, moon.y, moon.diameter);
	// fill(150,200,255);
	// noStroke();
	// ellipse(moon.x-20, moon.y+10, moon.diameter);
	// fill(0,darkness);
	// ellipse(moon.x-20, moon.y+10, moon.diameter);


	//cloud
	fill(map(darkness,0,255,255,200),map(darkness,0,255,255,200))
	ellipse(cloud.x,cloud.y,100,80)
	ellipse(cloud.x+50,cloud.y-10,70,70)
	ellipse(cloud.x+100,cloud.y,80,80)
	cloud.x=cloud.x+cloud.rate;
	
	console.log(y);
}