//////////////////////////////////////////////////////////////////
//				    Graphics Programming    					//
//																//
//				 Midterm Coursework Project 2					//
//					Asteroid Game Clone							//
//						October 2022							//
//																//
//////////////////////////////////////////////////////////////////

//////////////////////////////////////
//   Global Variable Declarations   //
//////////////////////////////////////

let spaceship = {};
let spaceshipImg;

let asteroids = [];
let asteroidImg;

let atmosphereLoc;
let atmosphereSize;

let earthLoc;
let earthSize;
let earthImg;

let starLocs = [];

let explosions = [];

let score;
let gameIsOver = false;

///////////////////////////////
//  		PRELOAD		     //
///////////////////////////////

function preload() {
    // Planet Earth from subpng.com
    // uploaded by Tyetrufclow and Free for personal use
    earthImg = loadImage(
        "./assets/kisspng-earth-stock-photography-royalty-free-5afae8f3d0d835.2471670415263930758554.png"
    );

    // Moon Cartoon Asteroid from subpng.com
    // uploaded by Mnbjjudb and Free for personal use
    asteroidImg = loadImage(
        "./assets/kisspng-2013-russian-meteor-event-meteoroid-asteroid-meteo-5aeef1f875d090.2536211915256089524826.png"
    );

    // Sky Cartoon from subpng.com
    // uploaded by Sudxfnwwakai and Free for personal use
    spaceshipImg = loadImage(
        "./assets/kisspng-computer-icons-spacecraft-rocket-launch-clip-art-spaceship-free-5b526763f05d77.6996195115321270759845.png"
    );
}

///////////////////////////////
//  		 SETUP		     //
///////////////////////////////

function setup() {
    createCanvas(1200, 800);
    imageMode(CENTER);

    // set location and size of atmosphere
    atmosphereLoc = new createVector(width / 2, height * 2.9);
    atmosphereSize = new createVector(width * 3, width * 3);

    // set location and size of planet earth
    earthLoc = new createVector(width / 2, height * 3.1);
    earthSize = new createVector(width * 3, width * 3);

    startGame();
}

///////////////////////////////////////////////////
// start or restart the game
function startGame() {
    spaceship = new Spaceship();
    asteroids = new AsteroidSystem();
    score = 0;
    gameIsOver = false;
}

///////////////////////////////
//  		 DRAW		     //
///////////////////////////////

function draw() {
    background(0);

    drawStarfield();
    asteroids.run(score);
    checkCollisions(spaceship, asteroids);
    drawScoreboard();
    if (!gameIsOver) spaceship.run();
    drawEarth();
    if (gameIsOver) gameOver();
    drawExplosions();
}

///////////////////////////////
//      Helper Functions     //
///////////////////////////////

// create and draw a starlit sky
function drawStarfield() {
    // add new stars to fill array
    while (starLocs.length < 300) {
        starLocs.push(new createVector(random(width), random(height)));
    }

    // draw the stars
    push();
    stroke(255);
    for (let i = 0; i < starLocs.length; i++) {
        rect(starLocs[i].x, starLocs[i].y, 2, 2);
    }
    pop();

    // randomly remove stars to create a twinkle effect
    if (random(1) < 0.3) starLocs.splice(int(random(starLocs.length)), 1);
}

// draw the scoreboard
function drawScoreboard() {
    push();
    fill(255);
    stroke(0);
    strokeWeight(2);
    textSize(30);
    textAlign(RIGHT);
    text("SCORE:  " + score + "  ", width, 40);
    pop();
}

// draw earth and its atmosphere
function drawEarth() {
    noStroke();

    //draw atmosphere
    fill(0, 0, 255, 50);
    ellipse(
        atmosphereLoc.x,
        atmosphereLoc.y,
        atmosphereSize.x,
        atmosphereSize.y
    );

    //draw spinning earth
    push();
    translate(earthLoc.x, earthLoc.y);
    rotate(radians((millis() / 3000) % 360));
    image(earthImg, 0, 0, earthSize.x * 1.47, earthSize.y * 1.1);
    pop();
}

// end the game and display "Game Over"
function gameOver() {
    fill(255);
    stroke(0);
    strokeWeight(2);
    textAlign(CENTER);
    textSize(80);
    text("GAME OVER", width / 2, height / 2);
    textSize(40);
    text("Press ESC to start again", width / 2, height * 0.6);
}

// checks for all types of collisions
function checkCollisions(spaceship, asteroids) {
    //spaceship-2-asteroid collisions
    for (i = 0; i < asteroids.locations.length; i++) {
        if (
            isInside(
                spaceship.location,
                spaceship.size * 0.8,
                asteroids.locations[i],
                asteroids.diams[i]
            )
        ) {
            createExplosion(spaceship.location);
            // move the spaceship offscreen
            spaceship.location.y = -100;
            gameIsOver = true;
        }
    }

    //asteroid-2-earth collisions
    for (i = 0; i < asteroids.locations.length; i++) {
        if (
            isInside(
                asteroids.locations[i],
                asteroids.diams[i],
                earthLoc,
                earthSize.x
            )
        ) {
            createExplosion(asteroids.locations[i]);
            asteroids.destroy(i);
            // move the spaceship offscreen
            spaceship.location.y = -100;
            gameIsOver = true;
        }
    }

    //spaceship-2-earth collisions
    if (isInside(spaceship.location, spaceship.size, earthLoc, earthSize.x)) {
        createExplosion(spaceship.location);
        // move the spaceship offscreen
        spaceship.location.y = -100;
        gameIsOver = true;
    }

    //asteroid-2-atmosphere collisions
    for (i = 0; i < asteroids.locations.length; i++) {
        if (
            isInside(asteroids.locations[i], 0, atmosphereLoc, atmosphereSize.x)
        ) {
            asteroids.setNearEarth(i);
        }
    }

    //spaceship-2-atmosphere collisions
    if (
        isInside(
            spaceship.location,
            spaceship.size,
            atmosphereLoc,
            atmosphereSize.x
        )
    )
        spaceship.setNearEarth();

    //bullet-2-asteroid collisions
    for (i = spaceship.bulletSys.bullets.length - 1; i >= 0; i--) {
        for (j = asteroids.locations.length - 1; j >= 0; j--) {
            if (
                isInside(
                    asteroids.locations[j],
                    asteroids.diams[j],
                    spaceship.bulletSys.bullets[i],
                    spaceship.bulletSys.diam
                )
            ) {
                // add a new explosion
                createExplosion(asteroids.locations[j]);

                // remove the asteroid and the bullet
                asteroids.destroy(j);
                spaceship.bulletSys.destroy(i);

                score += 1;

                // move on to the next bullet
                break;
            }
        }
    }
}

//check if there's collision between object A and object B
function isInside(locA, sizeA, locB, sizeB) {
    let distance = dist(locA.x, locA.y, locB.x, locB.y);
    let collisionDist = (sizeA + sizeB) / 2;
    return distance < collisionDist;
}

// add a new explosion to the array of explosions on screen
function createExplosion(location) {
    // add an empty array to the end of the explosions array
    let newestExplosion = explosions.length;
    explosions[newestExplosion] = [];

    // add new explosion particles to the empty array
    while (explosions[newestExplosion].length < 200) {
        let velocity = new createVector(random(-1, 1), random(-1, 1));
        explosions[newestExplosion].push(
            new Particle(location.x, location.y, velocity.x, velocity.y, 2, 5)
        );
    }
}

// draw all explosions in the explosions array
function drawExplosions() {
    for (let i = explosions.length - 1; i >= 0; i--) {
        // draw the particles in each explosion
        for (let j = explosions[i].length - 1; j >= 0; j--) {
            explosions[i][j].render();
            // remove particles that have decayed
            if (explosions[i][j].age <= 0) explosions[i].splice(j, 1);
        }

        // if there are no remaining particles, remove the explosion
        if (explosions[i].length == 0) explosions.splice(i, 1);
    }
}

// check for keypresses
function keyPressed() {
    if (keyIsPressed && keyCode === 32 && !gameIsOver) {
        // if spacebar is pressed, fire!
        spaceship.fire();
    }
    if (keyIsPressed && keyCode == ESCAPE) {
        startGame();
    }
}
