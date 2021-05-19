/// <reference path="/Users/bgmacbook/Documents/UoL Computer Science/CM1005 - ITP1/p5.intellisense/p5.global-mode.d.ts" />

function setup()
{
	createCanvas(800, 600);
	background (0);
	frameRate(60);
}


let drawDot = 0;
let drawlineX = 0;
let drawlineY = 0;

function draw()
{
// Display my mouse coordinates
let mouseBoxX = 40;
let mouseBoxY = 8;
noStroke();
fill(0,150);
rect(mouseBoxX,mouseBoxY,50,50);
fill(255)
text("X: "+mouseX, mouseBoxX+10, mouseBoxY+17);
text("Y: "+mouseY, mouseBoxX+10, mouseBoxY+17+25);

stroke(255);
strokeWeight(drawDot);
line(drawlineX,drawlineY,mouseX,mouseY);
drawlineX = mouseX;
drawlineY = mouseY;
}

function mousePressed()
{
	drawDot = 5

}

function mouseReleased()
{
	drawDot = 0;

}

function doubleClicked()
{
	background(0);
}