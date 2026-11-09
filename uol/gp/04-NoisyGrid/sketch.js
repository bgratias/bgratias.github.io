//////////////////////////////////////////////////////////////////
//				    Graphics Programming    					//
//																//
//				 Midterm Coursework Project 4					//
//					     Noisy Grid 							//
//						December 2022							//
//																//
//////////////////////////////////////////////////////////////////

///////////////////////////////
//   Variable Declarations   //
///////////////////////////////

var stepSize = 20;
var gridSize = 25;
var animRate;
let gridLoc = {};
let guageLoc = {};

///////////////////////////////
//  		 SETUP		     //
///////////////////////////////

function setup() {
    createCanvas(800, 800);
    textSize(20);
    textAlign(CENTER);
    noStroke();

    gridLoc.x = (width - stepSize * gridSize) / 2;
    gridLoc.y = (height - stepSize * gridSize) / 2;
    guageLoc.x = width / 2;
    guageLoc.y = height - 80;
}

///////////////////////////////
//  		 DRAW		     //
///////////////////////////////

function draw() {
    background(0);

    readAnimSpeed();

    drawColorGrid();
    drawCompassGrid();
    drawTitle();
    drawSpeedGuage();
}

///////////////////////////////////////////////////////////////////////
// use the location of the mouse to control the animation speed
function readAnimSpeed() {
    // limit mouse X position to grid location
    let mousePosX = min(max(mouseX, gridLoc.x), width - gridLoc.x);

    // map limited mouse X position to control animation speed
    animRate = map(mousePosX, gridLoc.x, width - gridLoc.x, 20, 200);
}

///////////////////////////////////////////////////////////////////////
function drawColorGrid() {
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            // calculate the noise value
            let noiseValue = noise(i / 30, j / 30, frameCount / animRate);

            // turn noise value into a colour
            let lColour = lerpColor(
                color(255, 0, 255),
                color(0, 255, 0),
                noiseValue
            );

            // draw the grid box
            fill(lColour);
            rect(
                gridLoc.x + j * stepSize,
                gridLoc.y + i * stepSize,
                stepSize,
                stepSize
            );
        }
    }
}

///////////////////////////////////////////////////////////////////////
function drawCompassGrid() {
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            // calculate the noise value
            let noiseValue = noise(i / 30, j / 30, frameCount / animRate);

            push();
            stroke(50);
            fill(50);

            // translate to center of square
            translate(
                gridLoc.x + (j + 0.5) * stepSize,
                gridLoc.y + (i + 0.5) * stepSize
            );

            // rotate to compass direction
            let compassDegrees = map(noiseValue, 0, 1, 0, 720);
            rotate(radians(compassDegrees));

            // draw the compass line
            strokeWeight(5 * noiseValue);
            line(0, -stepSize / 2, 0, stepSize / 2);

            // draw the pivot
            noStroke();
            ellipse(0, 0, 10 * noiseValue);

            pop();
        }
    }
}

///////////////////////////////////////////////////////////////////////
function drawTitle() {
    // cycle colours using sine function
    let colourChange = sin(frameCount / 50);
    let titleColour = lerpColor(
        color(255, 0, 255),
        color(0, 255, 0),
        colourChange
    );

    // draw title
    fill(titleColour);
    textSize(70);
    text("Aurora", width / 2, 100);
}

///////////////////////////////////////////////////////////////////////
function drawSpeedGuage() {
    // draw speed guage text
    textSize(25);
    text("Speed", guageLoc.x, guageLoc.y + 35);
    textSize(15);
    text("Slow", guageLoc.x - 80, guageLoc.y);
    text("Fast", guageLoc.x + 80, guageLoc.y);

    // calculate angle of guage indicator
    let guageDegrees = map(animRate, 20, 200, 0, -180);

    // draw the speed guage
    push();
    translate(guageLoc.x, guageLoc.y);
    rotate(radians(guageDegrees));
    rect(0, -1, 40, 2);
    ellipse(0, 0, 8);
    triangle(40, 5, 40, -5, 50, 0);
    pop();
}
