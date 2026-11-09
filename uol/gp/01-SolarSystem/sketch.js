//////////////////////////////////////////////////////////////////
//				    Graphics Programming    					//
//																//
//				 Midterm Coursework Project 1					//
//						Solar System							//
//						October 2022							//
//																//
//////////////////////////////////////////////////////////////////

///////////////////////////////
//   Variable Declarations   //
///////////////////////////////

let speed;
let speedModifier = 400; // miliseconds per day

let starfield = [];

// celestial bodies
let sun = {};
let earth = {};
let moon = {};
let asteroid = {};

///////////////////////////////
//  		 SETUP		     //
///////////////////////////////

function setup() {
    createCanvas(900, 900);
    fill(255);
    stroke(255);
    textSize(20);

    populateStarfield(100);

    sun = {
        colour: color(255, 150, 0),
        diameter: 200,
        rotationPeriod: 15, // rotations per year
        rotAngle: 0,
    };

    earth = {
        colour: color(0, 0, 255),
        diameter: 80,
        orbit: 300,
        orbPeriod: 1, // one orbit per year
        orbAngle: 0,
        rotationPeriod: 365, // rotations per year
        rotAngle: 0,
    };

    moon = {
        colour: color(255, 255, 255),
        diameter: 30,
        orbit: 100,
        orbPeriod: 12.5, // orbits per year
        orbAngle: 0,
    };

    asteroid = {
        colour: color(100, 100, 100),
        diameter: 15,
        orbit: 25,
        orbPeriod: 35, // orbits per year
        orbAngle: 0,
    };
}

///////////////////////////////
//  		 DRAW		     //
///////////////////////////////

function draw() {
    background(0);

    drawStarfield();

    // set the animation rate
    speed = millis() / speedModifier;
    text("Day:  " + floor(speed), width - 150, 30);

    // center point for the simulation
    translate(width / 2, height / 2);

    drawSun();
    drawEarth();
    drawMoon();
    push();
    drawAsteroid();
    pop();
    drawBodyShadow(moon);
}

///////////////////////////////
//      Helper Functions     //
///////////////////////////////

function populateStarfield(numStars) {
    // generate random stars and add to starfield array
    for (let i = 0; i < numStars; i++) {
        starfield.push({
            xPos: random(0, width),
            yPos: random(0, height),
            magnitude: abs(randomGaussian(0, 2)),
        });
    }
}

function drawStarfield() {
    push();
    for (let i = 0; i < starfield.length; i++) {
        strokeWeight(starfield[i].magnitude);
        point(starfield[i].xPos, starfield[i].yPos);
    }
    pop();
}

function drawSun() {
    // rotate the sun
    sun.rotAngle = (degreesPerDay(sun.rotationPeriod) * speed) % 360;

    push();
    rotate(radians(sun.rotAngle));
    drawCelestialObj(color(255, 150, 0), sun.diameter);
    pop();
}

function drawEarth() {
    // locate the earth in its orbit relative to the sun
    earth.orbAngle = (degreesPerDay(earth.orbPeriod) * speed) % 360;
    rotate(radians(earth.orbAngle));
    translate(earth.orbit, 0);

    // rotate the earth
    earth.rotAngle = (degreesPerDay(earth.rotationPeriod) * speed) % 360;
    push();
    rotate(radians(earth.rotAngle));
    drawCelestialObj(earth.colour, earth.diameter);
    pop();

    // add the earth's shadow
    drawSunShadow(earth.diameter);
}

function drawMoon() {
    // rotate the moon
    moon.orbAngle = (degreesPerDay(moon.orbPeriod) * speed) % 360;
    rotate(radians(moon.orbAngle) * -1);

    // locate the moon in its orbit relative to the earth
    translate(moon.orbit, 0);
    drawCelestialObj(moon.colour, moon.diameter, 3);
}

function drawAsteroid() {
    // rotate the asteroid
    asteroid.orbAngle = (degreesPerDay(asteroid.orbPeriod) * speed) % 360;
    rotate(radians(asteroid.orbAngle));

    // locate the asteroid in its orbit relative to the moon
    translate(asteroid.orbit, 0);
    drawCelestialObj(asteroid.colour, asteroid.diameter, 2);

    // add the asteroid's shadow
    rotate(radians(moon.orbAngle));
    rotate(radians(asteroid.orbAngle) * -1);
    drawSunShadow(asteroid.diameter);
}

function drawCelestialObj(colour, size, strokeSize = 5) {
    // draw a celestial body
    push();
    strokeWeight(strokeSize);
    fill(colour);
    stroke(0);
    ellipse(0, 0, size, size);
    line(0, 0, size / 2, 0);
    pop();
}

function drawSunShadow(diameter) {
    // draw sun's shadow on a celestial body
    push();
    noStroke();
    fill(0, 0, 0, 180);
    arc(0, 0, diameter, diameter, -HALF_PI, HALF_PI);
    pop();
}

function drawBodyShadow(celestialObj) {
    // draw a shadow extending from a body away from the sun
    push();
    rotate(radians(celestialObj.orbAngle));
    noStroke();
    fill(0, 0, 0, 180);
    rect(0, -celestialObj.diameter / 2, 40, celestialObj.diameter);
    pop();
}

function degreesPerDay(rotationPeriod) {
    return (360 * rotationPeriod) / 365;
}
