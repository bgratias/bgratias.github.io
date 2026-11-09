//////////////////////////////////////////////////////////////////
//				    Graphics Programming    					//
//																//
//				 Midterm Coursework Project 3					//
//					     Angry Birds  							//
//						November 2022							//
//																//
//////////////////////////////////////////////////////////////////

///////////////////////////////
//   Variable Declarations   //
///////////////////////////////

var Engine = Matter.Engine;
var Render = Matter.Render;
var World = Matter.World;
var Bodies = Matter.Bodies;
var Body = Matter.Body;
var Constraint = Matter.Constraint;
var Mouse = Matter.Mouse;
var MouseConstraint = Matter.MouseConstraint;

var engine;
var propeller;
var boxes = [];
var birds = [];
var colors = [];
var ground;
var slingshotBird, slingshotConstraint;
var angle = 0;
var angleSpeed = 0;
var canvas;
var numBoxes;
let numSeconds = 60;
let gameOn = true;

///////////////////////////////
//  		 SETUP		     //
///////////////////////////////

function setup() {
    canvas = createCanvas(1000, 600);
    engine = Engine.create(); // create an engine

    setupGround();
    setupPropeller();
    setupTower();
    setupSlingshot();
    setupMouseInteraction();
    setInterval(countdown, 1000);
}

///////////////////////////////
//  		 DRAW		     //
///////////////////////////////

function draw() {
    background(0);

    Engine.update(engine);

    drawGround();
    drawPropeller();
    drawTower();
    drawBirds();
    drawSlingshot();
    drawScoreboard();
    if (numBoxes == 0 || numSeconds == 0) {
        gameOn = false;
        drawGameOver();
    }
}

///////////////////////////////
//      Helper Functions     //
///////////////////////////////

////////////////////////////////////////////////////////////
// use arrow keys to control propeller
function keyPressed() {
    if (gameOn && keyCode == LEFT_ARROW) {
        //when the left arrow is pressed, the angle speed is incremented by 0.01
        angleSpeed += 0.01;
    } else if (gameOn && keyCode == RIGHT_ARROW) {
        //opposite when the right arrow is pressed.
        angleSpeed -= 0.01;
    }
}

////////////////////////////////////////////////////////////
function keyTyped() {
    //if 'b' create a new bird to use with propeller
    if (gameOn && key === "b") {
        setupBird();
    }

    //if 'r' reset the slingshot
    if (gameOn && key === "r") {
        removeFromWorld(slingshotBird);
        removeFromWorld(slingshotConstraint);
        setupSlingshot();
    }
}
////////////////////////////////////////////////////////////
// draw scoreboard and instructions
function drawScoreboard() {
    push();
    fill(255);

    // scoreboard
    textSize(30);
    text(numSeconds + " seconds Remaining", textSize(), textSize() * 1.5);
    textAlign(RIGHT);
    numBoxes = boxes.bodies.length;
    text("Boxes remaining " + numBoxes, width - textSize(), textSize() * 1.5);

    // instructions
    textAlign(LEFT);
    textSize(20);
    text("press 'b' to add a new bird", textSize(), 80);
    text("press arrows to spin propeller", textSize(), 80 + textSize() * 1.2);
    pop();
}

////////////////////////////////////////////////////////////
// draw gameover screen
function drawGameOver() {
    push();
    if (numSeconds > 0) {
        // Draw win screen
        textSize(70);
        fill(255, 0, 0);
        textAlign(CENTER);
        text("You Win!", width / 2, height / 2);
        World.remove(engine.world, mouseConstraint);
    } else {
        // Draw lose screen
        textSize(70);
        fill(255, 0, 0);
        textAlign(CENTER);
        text("Game Over!", width / 2, height / 2);
        World.remove(engine.world, mouseConstraint);
    }
    pop();
}

////////////////////////////////////////////////////////////
// decrement timer to 0 seconds
function countdown() {
    if (numSeconds > 0 && gameOn) numSeconds--;
}

//**********************************************************************
//  HELPER FUNCTIONS - DO NOT WRITE BELOW THIS line
//**********************************************************************

////////////////////////////////////////////////////////////
// if mouse is released destroy slingshot constraint so that
// slingshot bird can fly off
function mouseReleased() {
    setTimeout(() => {
        slingshotConstraint.bodyB = null;
        slingshotConstraint.pointA = { x: 0, y: 0 };
    }, 100);
}
////////////////////////////////////////////////////////////
//tells you if a body is off-screen
function isOffScreen(body) {
    var pos = body.position;
    return pos.y > height || pos.x < 0 || pos.x > width;
}
////////////////////////////////////////////////////////////
//removes a body from the physics world
function removeFromWorld(body) {
    World.remove(engine.world, body);
}
////////////////////////////////////////////////////////////
function drawVertices(vertices) {
    beginShape();
    for (var i = 0; i < vertices.length; i++) {
        vertex(vertices[i].x, vertices[i].y);
    }
    endShape(CLOSE);
}
////////////////////////////////////////////////////////////
function drawConstraint(constraint) {
    push();
    var offsetA = constraint.pointA;
    var posA = { x: 0, y: 0 };
    if (constraint.bodyA) {
        posA = constraint.bodyA.position;
    }
    var offsetB = constraint.pointB;
    var posB = { x: 0, y: 0 };
    if (constraint.bodyB) {
        posB = constraint.bodyB.position;
    }
    strokeWeight(5);
    stroke(255);
    line(
        posA.x + offsetA.x,
        posA.y + offsetA.y,
        posB.x + offsetB.x,
        posB.y + offsetB.y
    );
    pop();
}
