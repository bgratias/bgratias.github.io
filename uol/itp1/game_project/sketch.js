//////////////////////////////////////////////////////////////////
//				 ITP1 Game Project Submission					//
//																//
//						Coursework 2.2							//
//																//
//						September 2021							//
//																//
//////////////////////////////////////////////////////////////////

/*
I chose to implement two extensions in my project: 
	1. Multi-level and moving platforms
	2. Sound effects and Music
The birds are the beginning of the third extension: Enemies.

I chose to generate almost all elements of the game world randomly.  This raised many challenges: designing elements to be scaleable, preventing elements from being located on top of each other, ensuring playability, etc.  It would have been much easier to make all objects static.

I also chose to add a parallax scrolling effect.  This caused many complicated interactions which I found challenging to code and conceptualize.

I learned a lot about Factory patterns and Constructor functions in this project.  I can see I still have a lot more to learn because I ran into many limitations.  In particular I found it difficult to create objects that were similar but not exactly alike.  (NearMountains vs FarMountains,  MovingPlatforms vs StaticPlatforms, etc.).  I look forward to learning better ways in the future to deal with these situations. 
*/

///////////////////////////////
//   Variable Declarations   //
///////////////////////////////

//game world
const CANVASWIDTH = 1024;
const CANVASHEIGHT = 576;
const WORLDWIDTH = 4000;
const FLOORHEIGHT = (CANVASHEIGHT * 4) / 5;
const LEVELHEIGHT = 90;
const WATERHEIGHT = -10;
const GRAVITY = 1.3;

let mountainsFar = [];
let clouds = [];
let mountainsNear = [];
let canyons = [];
let trees = [];
let birds = [];
let staticPlatforms = [];
let movingPlatforms = [];
let collectables = [];
let flagpole = {};
let scrollPos;

//player
const MOVESPEED = 5;
const PLUMMETSPEED = 20;
const SINKSPEED = 0.8;
const JUMPVELOCITY = -18;

let player = {};
let character = {};

//show object anchors for debugging
const IS_SHOW_ANCHORS = false;

///////////////////////////////
//  		PRELOAD		     //
///////////////////////////////

function preload() {
    // Asyncronous loading of resources

    //Images
    //"Heart Icon made by Vectors Market from www.flaticon.com"
    player.imgLifeHeart = loadImage("./assets/images/heart32.png");

    //music
    //Charlie Boraley - In My Mind There Is a Monster.mp3
    player.sndPlayMusic = loadSound("./assets/music/monster.mp3");
    player.sndPlayMusic.setVolume(0.04);
    player.sndPlayMusic.playMode("untilDone");

    //Sounds
    //jumps-start by Behansean https://freesound.org/s/422426/
    character.sndJump = loadSound("./assets/sounds/jump.wav");
    character.sndJump.setVolume(0.2);
    //water-splash by Soundscalpel https://freesound.org/s/110393/
    character.sndSplash = loadSound("./assets/sounds/splash.wav");
    character.sndSplash.setVolume(0.1);
    //Awww https://freesound.org
    character.sndDeath = loadSound("./assets/sounds/awww.wav");
    character.sndDeath.setVolume(0.05);
    character.sndDeath.rate(0.9);

    //Collect https://freesound.org
    player.sndCollect = loadSound("./assets/sounds/collect.wav");
    player.sndCollect.setVolume(0.03);
    //success-fanfare-trumpets by funwithsound https://freesound.org/s/456966/
    player.sndVictory = loadSound("./assets/sounds/trumpets.mp3");
    player.sndVictory.setVolume(0.2);

    //zoom-up-1-quicker-delay by chriddof https://freesound.org/s/135517/
    flagpole.sndRaiseFlag = loadSound("./assets/sounds/raiseflag.wav");
    flagpole.sndRaiseFlag.setVolume(0.1);
    flagpole.sndRaiseFlag.playMode("untilDone");
}

///////////////////////////////
//  		 SETUP		     //
///////////////////////////////

function setup() {
    // Initialize game world
    createCanvas(CANVASWIDTH, CANVASHEIGHT);

    // populate scenery arrays
    populateFarMountainsArray(15);
    populateCloudsArray(8);
    populateNearMountainsArray(6);
    populateCanyonsArray(5);
    populateTreesArray(20);
    populateBirdsArray(8);
    populateStaticPlatformsArray();
    populateMovingPlatformsArray();
    populateCollectablesArray(20);

    // initialize flagpole
    flagpole.x_pos = WORLDWIDTH;
    flagpole.y_pos = FLOORHEIGHT - 90;
    flagpole.isReached = false;
    flagpole.flagIsRaised = false;

    //initialize player
    player.lives = 3;
    player.score = 0;
    player.isPlaying = false;

    startLevel();
}

function startLevel() {
    // Reset background scrolling position
    scrollPos = 0;

    // Reset character to level start position
    character.x_pos = 200;
    character.y_pos = FLOORHEIGHT - 200;
    character.x_world = character.x_pos;
    character.y_vel = 0;
    character.isDead = false;
    character.isSinking = false;
    character.isPlummeting = false;
    character.isOnPlatform = false;
}

///////////////////////////////
//  		 DRAW		     //
///////////////////////////////

function draw() {
    drawSky();
    drawGround();
    drawFarMountains();
    drawClouds();
    drawNearMountains();

    push();
    translate(scrollPos, 0);
    drawGrass();
    drawTrees();
    drawStaticScenery();
    drawStaticPlatforms();
    drawMovingPlatforms();
    drawCanyons();
    drawCollectables();
    drawFlagpole();
    pop();

    drawScoreboard();
    drawChar();

    push();
    translate(scrollPos, 0);
    drawWater();
    drawBirds();
    pop();

    moveChar();
    updateWorldPosition();

    checkCanyons();
    checkFlagpole();
    checkPlayerDeath();
    checkCollectables();

    /////////// GAME INTERFACE SCREENS //////////

    if (!player.isPlaying) {
        gameStartScreen();
    }

    if (player.lives == 0) {
        gameOverScreen();
    }

    if (flagpole.flagIsRaised) {
        levelCompleteScreen();
    }
}

///////////////////////////////////////
// GENERATE SCENERY AND GAME OBJECTS //
///////////////////////////////////////

function populateFarMountainsArray(num) {
    // remove existing objects from array
    mountainsFar = [];
    // add new mountains to array
    for (let i = 0; i < num; i++) {
        mountainsFar.push(new MountainFar());
    }
}

function populateCloudsArray(num) {
    // remove existing objects from array
    clouds = [];
    // add new clouds to array
    for (let i = 0; i < num; i++) {
        clouds.push(new Cloud());
    }
}

function populateNearMountainsArray(num) {
    // remove existing objects from array
    mountainsNear = [];
    // add new mountains to array
    for (let i = 0; i < num; i++) {
        mountainsNear.push(new MountainNear());
    }
}

function populateCanyonsArray(num) {
    // remove existing objects from array
    canyons = [];

    // static canyons definition
    // (x_pos, width, topLevel, bottomLevel)
    staticCanyonLocations = [
        [-600, 220, 0, -1],
        [2000, 400, 0, -1],
        [2550, 500, 0, -1],
        [575, 50, 3, 1],
        [1650, 100, 3, 1],
        [3150, 100, 3, 1],
    ];

    // add static canyons to array
    for (let i = 0; i < staticCanyonLocations.length; i++) {
        canyons.push(
            new Canyon(
                staticCanyonLocations[i][0],
                staticCanyonLocations[i][1],
                staticCanyonLocations[i][2],
                staticCanyonLocations[i][3]
            )
        );
        canyons[i].setFallBottom();
        canyons[i].populateStreams();
    }

    // add random canyons to array
    for (
        let i = staticCanyonLocations.length;
        i < staticCanyonLocations.length + num;
        i++
    ) {
        //create a new canyon
        let newCanyon = new Canyon();
        //and then randomize its properties
        newCanyon.randomizeCanyon();

        //make sure we are not placing a canyon over an existing canyon
        let distFromEdge = 100;
        if (checkIsObjectOverCanyon(newCanyon, distFromEdge)) {
            i--; // decrement index and try again
        } else {
            canyons.push(newCanyon);
            newCanyon.populateStreams();
        }
    }
}

function populateTreesArray(num) {
    // remove existing objects from array
    trees = [];

    // add new trees to array
    for (let i = 0; i < num; i++) {
        let newTree = new Tree();

        //make sure we are not placing a tree over a canyon
        let distFromEdge = 15;
        if (checkIsObjectOverCanyon(newTree, distFromEdge)) {
            i--; // decrement index and try again
        } else {
            trees.push(newTree);
        }
    }
}

function populateBirdsArray(num) {
    // remove existing objects from array
    birds = [];

    // Add new birds to array
    for (let i = 0; i < num; i++) {
        birds.push(new Bird(i));
    }
}

function populateStaticPlatformsArray() {
    // remove existing objects from array
    staticPlatforms = [];

    // define static platforms
    let staticPlatformLocations = [
        [400, 3, 150],
        [600, 3, 100],
        [1500, 3, 100],
        [1700, 3, 100],
        [2200, 3, 50],
        [2900, 3, 200],
        [300, 2, 250],
        [1300, 2, 200],
        [1500, 2, 100],
        [2200, 2, 100],
        [2800, 2, 200],
        [3200, 2, 100],
        [250, 1, 450],
        [900, 1, 100],
        [1400, 1, 300],
        [3000, 1, 200],
    ];

    // add platforms to array
    for (i = 0; i < staticPlatformLocations.length; i++) {
        staticPlatforms.push(
            new Platform(
                staticPlatformLocations[i][0],
                staticPlatformLocations[i][1],
                staticPlatformLocations[i][2]
            )
        );
    }
}

function populateMovingPlatformsArray() {
    // remove existing objects from array
    movingPlatforms = [];

    // define moving platforms
    //(x_limitLeft, level, len, x_limitRight, x_velocity)
    let staticMovingPlatformLocations = [
        [1800, 3, 100, 2200, 2],
        [2550, 3, 100, 2900, 3],
        [2300, 2, 100, 2650, 2],
    ];

    // add platforms to array
    for (i = 0; i < staticMovingPlatformLocations.length; i++) {
        movingPlatforms.push(
            new MovingPlatform(
                staticMovingPlatformLocations[i][0],
                staticMovingPlatformLocations[i][1],
                staticMovingPlatformLocations[i][2],
                staticMovingPlatformLocations[i][3],
                staticMovingPlatformLocations[i][4]
            )
        );
    }
}

function populateCollectablesArray(num) {
    // remove existing objects from array
    collectables = [];

    // add random collectables to array
    for (let i = 0; i < num; i++) {
        let newCollectable = new Collectable();

        // if there is a platform, hoist gem to platform level
        let platform = checkIsAtPlatform(newCollectable.x_pos);
        let platformPath = checkIsAtMovingPlatformPath(newCollectable.x_pos);
        let platform_y = 0;

        if (typeof platformPath == "object") {
            platform_y = platformPath.y_pos;
        } else if (typeof platform == "object") {
            platform_y = platform.y_pos;
        }

        if (platform_y > 0) {
            newCollectable.y_pos =
                platform_y - (FLOORHEIGHT - newCollectable.y_pos);
        }

        // and then push new gem to the array
        collectables.push(newCollectable);
    }

    // Finally add one collectable for the scoreboard
    collectables.push(new Collectable());
    collectables[num].x_pos = 40;
    collectables[num].y_pos = 31;
    collectables[num].isFound = false;
    collectables[num].alpha = 255;
}

function checkIsObjectOverCanyon(obj, distFromEdge) {
    for (let i = 0; i < canyons.length; i++) {
        if (
            obj.x_pos >
                canyons[i].x_pos - canyons[i].width / 2 - distFromEdge &&
            obj.x_pos < canyons[i].x_pos + canyons[i].width / 2 + distFromEdge
        ) {
            return true;
        }
    }
}

function checkIsAtPlatform(x_pos, y_pos = 0) {
    // check if object is above any platform
    // if no y_pos is received object is assumed to be at y_pos 0
    let platform = undefined;

    //first check the moving platforms
    for (let i = 0; i < movingPlatforms.length; i++) {
        if (
            y_pos <= movingPlatforms[i].y_pos &&
            x_pos > movingPlatforms[i].x_pos - 10 &&
            x_pos < movingPlatforms[i].x_pos + 10 + movingPlatforms[i].len
        ) {
            platform = movingPlatforms[i];
            return platform;
        }
    }

    //then check the static plaforms
    for (let i = 0; i < staticPlatforms.length; i++) {
        if (
            y_pos <= staticPlatforms[i].y_pos &&
            x_pos > staticPlatforms[i].x_pos - 10 &&
            x_pos < staticPlatforms[i].x_pos + 10 + staticPlatforms[i].len
        ) {
            platform = staticPlatforms[i];
            return platform;
        }
    }
}

function checkIsAtMovingPlatformPath(x_pos, y_pos = 0) {
    // check if x_pos of object is along the path of a moving platform
    let platform = undefined;

    for (let i = 0; i < movingPlatforms.length; i++) {
        if (
            y_pos <= movingPlatforms[i].y_pos &&
            x_pos > movingPlatforms[i].x_limitLeft &&
            x_pos < movingPlatforms[i].x_limitRight
        ) {
            platform = movingPlatforms[i];
            return platform;
        }
    }
}

//////////////////////////////////////
//  RENDER SCENERY AND GAME OBJECTS	//
//////////////////////////////////////

function drawSky() {
    // draw a gradient from top to bottom
    let top = color(255, 195, 113);
    let bottom = color(255, 95, 109);

    let lerpLevel = 0;
    let lerpIncrement = 1 / FLOORHEIGHT;

    for (let i = 0; i < FLOORHEIGHT; i++) {
        // lerpColor combines the two colours
        stroke(lerpColor(top, bottom, lerpLevel));
        line(0, i, width, i);
        lerpLevel += lerpIncrement;
    }
    noStroke();
}

function drawGround() {
    fill(139, 69, 19);
    rect(0, FLOORHEIGHT, width, height - FLOORHEIGHT);
}

function drawFarMountains() {
    for (let i = 0; i < mountainsFar.length; i++) {
        mountainsFar[i].draw();

        if (IS_SHOW_ANCHORS) {
            mountainsFar[i].showAnchor();
        }
    }
}

function drawClouds() {
    for (let i = 0; i < clouds.length; i++) {
        clouds[i].drift();
        clouds[i].draw();

        if (IS_SHOW_ANCHORS) {
            clouds[i].showAnchor();
        }
    }
}

function drawNearMountains() {
    for (let i = 0; i < mountainsNear.length; i++) {
        mountainsNear[i].draw();

        if (IS_SHOW_ANCHORS) {
            mountainsNear[i].showAnchor();
        }
    }
}

function drawGrass() {
    stroke(0, 155, 0);
    strokeWeight(3);
    strokeCap(SQUARE);

    // limit drawing to only what is visible in the viewport
    for (i = -scrollPos; i < width - scrollPos; i += 2) {
        // vary the length of the grass using perlin noise
        // Credit to Dan Shiffman of 'The Coding Train' YouTube Channel
        // for the idea to use perlin noise to render a "smooth" randomness
        yOffset = 10 + noise(i * 0.02) * 50;
        line(i, FLOORHEIGHT, i, FLOORHEIGHT + yOffset);
    }
    noStroke();
}

function drawTrees() {
    for (let i = 0; i < trees.length; i++) {
        trees[i].draw();

        if (IS_SHOW_ANCHORS) {
            trees[i].showAnchor();
        }
    }
}

function drawBirds() {
    for (let i = 0; i < birds.length; i++) {
        birds[i].fly();
        birds[i].draw();

        if (IS_SHOW_ANCHORS) {
            birds[i].showAnchor();
        }
    }
}

function drawStaticScenery() {
    // I planned that there would be more static scenery
    drawSignPost(-275);
}

function drawSignPost(x_pos) {
    if (isNotInViewport(x_pos, 1)) {
        return;
    }

    fill(230, 130, 30);
    rect(x_pos, FLOORHEIGHT, -5, -100);
    fill(210, 110, 20);
    rect(x_pos, FLOORHEIGHT, 5, -100);
    fill(228, 128, 31);
    quad(
        x_pos - 25,
        FLOORHEIGHT - 85,
        x_pos + 25,
        FLOORHEIGHT - 90,
        x_pos + 28,
        FLOORHEIGHT - 70,
        x_pos - 23,
        FLOORHEIGHT - 65
    );
    triangle(
        x_pos + 25,
        FLOORHEIGHT - 90,
        x_pos + 35,
        FLOORHEIGHT - 80,
        x_pos + 28,
        FLOORHEIGHT - 70
    );
    fill(210, 110, 20);
    quad(
        x_pos - 25,
        FLOORHEIGHT - 65,
        x_pos + 25,
        FLOORHEIGHT - 65,
        x_pos + 25,
        FLOORHEIGHT - 45,
        x_pos - 25,
        FLOORHEIGHT - 45
    );
    triangle(
        x_pos + 25,
        FLOORHEIGHT - 65,
        x_pos + 35,
        FLOORHEIGHT - 55,
        x_pos + 25,
        FLOORHEIGHT - 45
    );
    fill(0);
    textSize(15);
    textAlign(CENTER);
    push();
    translate(x_pos, FLOORHEIGHT - 74);
    rotate(-0.1);
    text("wrong", 0, 0);
    pop();
    text("way", x_pos, FLOORHEIGHT - 52);
}

function drawCanyons() {
    for (let i = 0; i < canyons.length; i++) {
        canyons[i].draw();

        if (IS_SHOW_ANCHORS) {
            canyons[i].showAnchor();
        }
    }
}

function drawStaticPlatforms() {
    for (let i = 0; i < staticPlatforms.length; i++) {
        staticPlatforms[i].draw();

        if (IS_SHOW_ANCHORS) {
            staticPlatforms[i].showAnchor();
        }
    }
}

function drawMovingPlatforms() {
    for (let i = 0; i < movingPlatforms.length; i++) {
        movingPlatforms[i].move();
        movingPlatforms[i].draw();

        if (IS_SHOW_ANCHORS) {
            movingPlatforms[i].showAnchor();
        }
    }
}

function drawCollectables() {
    for (let i = 0; i < collectables.length - 1; i++) {
        if (collectables[i].isFound == false) {
            collectables[i].draw();
        } else if (collectables[i].alpha > 0) {
            collectables[i].raise();
            collectables[i].draw();
        }

        if (IS_SHOW_ANCHORS) {
            collectables[i].showAnchor();
        }
    }
}

function drawFlagpole() {
    let parallax = 1;
    if (isNotInViewport(flagpole.x_pos, parallax)) {
        return;
    }

    //draw flagpole
    fill(100, 100, 100);
    rect(flagpole.x_pos - 5, FLOORHEIGHT - 205, 10, 205);
    ellipse(flagpole.x_pos, FLOORHEIGHT - 210, 20, 20);

    //draw flag
    fill(255, 215, 0);
    quad(
        flagpole.x_pos,
        flagpole.y_pos + 5,
        flagpole.x_pos + 5,
        flagpole.y_pos + flagpole.waveOffset,
        flagpole.x_pos + 5,
        flagpole.y_pos + 50 + flagpole.waveOffset,
        flagpole.x_pos,
        flagpole.y_pos + 55
    );

    waveFlag();

    if (flagpole.isReached) {
        raiseFlag();
    }

    if (IS_SHOW_ANCHORS) {
        fill(255, 0, 0);
        ellipse(flagpole.x_pos, FLOORHEIGHT, 10, 10);
    }
}

function drawWater() {
    for (let i = 0; i < canyons.length; i++) {
        canyons[i].drawWaterfall();
    }
}

function isNotInViewport(x_posLeft, parallax = 1, length = 0) {
    //In an effort to reduce computational overhead,
    //all drawing functions first call this function
    //and only objects visible to the player are drawn.

    //Setting viewport extra wide on both sides of screen
    //Ensures wide objects do not "pop" onto the screen suddenly
    let viewportLeftSide = -120;
    let viewportRightSide = width + 120;

    if (
        x_posLeft + length + scrollPos * parallax > viewportLeftSide &&
        x_posLeft + scrollPos * parallax < viewportRightSide
    ) {
        return false;
    } else {
        return true;
    }
}

////////////////////////////////////
//      RENDER GAME INTERFACE	  //
////////////////////////////////////

function drawScoreboard() {
    push();
    scale(0.8);
    collectables[collectables.length - 1].drawGem();
    pop();

    fill(0);
    textSize(30);
    textAlign(LEFT);
    text(player.score, 55, 40);

    for (let i = 0; i < player.lives; i++) {
        image(player.imgLifeHeart, width - 130 + i * 40, 16);
    }
}

function gameOverScreen() {
    fill(209, 59, 59);
    textSize(100);
    textAlign(CENTER);
    text("Game Over", width / 2, height / 2);
    textSize(30);
    text("Press Esc to Continue", width / 2, height / 2 + 50);
}

function gameStartScreen() {
    drawSky();
    drawGround();
    drawGrass();

    fill(209, 59, 59);
    textAlign(CENTER);
    textSize(60);
    text("Press Jump to Begin", width / 2, height / 5);

    fill(120);
    stroke(120);
    strokeWeight(0);
    textSize(20);
    push();
    translate(width / 2 - 80, height / 2);
    noFill();
    strokeWeight(1);
    rect(0, 0, 50, 50, 10);
    fill(120);
    triangle(6, 25, 26, 10, 26, 40);
    rect(26, 18, 14, 14);
    pop();
    text("Move Right", width / 2 - 180, height / 2 + 35);

    push();
    translate(width / 2 + 80, height / 2 + 50);
    rotate(PI);
    noFill();
    strokeWeight(1);
    rect(0, 0, 50, 50, 10);
    fill(120);
    triangle(6, 25, 26, 10, 26, 40);
    rect(26, 18, 14, 14);
    pop();
    text("Move Left", width / 2 + 180, height / 2 + 35);

    push();
    translate(width / 2 + 25, height / 2 - 60);
    rotate((2 * PI) / 4);
    noFill();
    strokeWeight(1);
    rect(0, 0, 50, 50, 10);
    fill(120);
    triangle(6, 25, 26, 10, 26, 40);
    rect(26, 18, 14, 14);
    pop();
    text("Jump", width / 2, height / 2 - 80);

    push();
    translate(width / 2 - 100, (height * 3) / 4 - 80);
    noFill();
    strokeWeight(1);
    rect(0, 0, 200, 50, 10);
    pop();
    text("Jump", width / 2, (height * 3) / 4);

    character.x_pos = 100;
    character.y_pos = FLOORHEIGHT;
    character.isInTheAir = false;
    drawChar();

    player.sndPlayMusic.stop();
}

function levelCompleteScreen() {
    fill(209, 59, 59);
    textSize(80);
    textAlign(CENTER);
    text("Level Complete", width / 2, height / 3);
    textSize(30);
    text("Press Esc to Continue", width / 2, height / 2 + 30);
}

///////////////////////////////
//        KEY CAPTURE        //
///////////////////////////////

function keyPressed() {
    if (player.isPlaying) {
        //Escape key - RESET
        if (keyCode == 27) {
            setup();
        }

        //prevents character from moving in these game states
        if (
            character.isPlummeting ||
            character.isSinking ||
            flagpole.isReached
        ) {
            return;
        }

        //Left Arrow Key
        if (keyCode == 37) {
            character.isLeft = true;
        }

        //Right Arrow key
        if (keyCode == 39) {
            character.isRight = true;
        }

        //Up Arrow or Space Bar
        if (keyCode == 38 || keyCode == 32) {
            if (character.y_pos == FLOORHEIGHT || character.isOnPlatform) {
                character.isJumping = true;
                character.sndJump.play(0, 1, 0.3, 0.18);
            }
        }
    } else if (keyCode == 38 || keyCode == 32) {
        // Start the game
        player.isPlaying = true;
        player.sndPlayMusic.loop();
        character.y_pos = 0;
    }
}

function keyReleased() {
    //Left Arrow Key
    if (key == "A" || keyCode == 37) {
        character.isLeft = false;
    }
    //Right Arrow Key
    if (key == "D" || keyCode == 39) {
        character.isRight = false;
    }
}

////////////////////////////////////
//      RENDER GAME CHARACTER     //
////////////////////////////////////

function drawChar() {
    if (character.isLeft && character.isInTheAir) {
        //DRAW Character jumping-left
        fill(147, 112, 219);
        ellipse(character.x_pos, character.y_pos - 22, 25, 28); //body
        ellipse(character.x_pos - 8, character.y_pos - 6, 10, 15); //feet
        ellipse(character.x_pos + 8, character.y_pos - 6, 10, 15);
        quad(
            character.x_pos - 5,
            character.y_pos - 51,
            character.x_pos,
            character.y_pos - 51 + 25,
            character.x_pos - 4,
            character.y_pos - 51 + 25,
            character.x_pos - 4 - 5,
            character.y_pos - 51
        ); //antenna
        ellipse(character.x_pos - 9, character.y_pos - 52, 12, 12); //eye
        fill(255);
        ellipse(character.x_pos - 12, character.y_pos - 52, 3, 8);
        stroke(0);
        strokeWeight(1.2);
        point(character.x_pos - 13, character.y_pos - 53);
        noStroke();
    } else if (character.isRight && character.isInTheAir) {
        //DRAW Character jumping-right
        fill(147, 112, 219);
        ellipse(character.x_pos, character.y_pos - 22, 25, 28); //body
        ellipse(character.x_pos - 8, character.y_pos - 6, 10, 15); //feet
        ellipse(character.x_pos + 8, character.y_pos - 6, 10, 15);
        quad(
            character.x_pos - 2 + 5,
            character.y_pos - 51,
            character.x_pos - 2,
            character.y_pos - 51 + 25,
            character.x_pos - 2 + 4,
            character.y_pos - 51 + 25,
            character.x_pos - 2 + 4 + 5,
            character.y_pos - 51
        ); //antenna
        ellipse(character.x_pos + 9, character.y_pos - 52, 12, 12); //eye
        fill(255);
        ellipse(character.x_pos + 12, character.y_pos - 52, 3, 8);
        stroke(0);
        strokeWeight(1.2);
        point(character.x_pos + 13, character.y_pos - 53);
        noStroke();
    } else if (character.isLeft) {
        //DRAW Character walking left
        fill(147, 112, 219);
        ellipse(character.x_pos, character.y_pos - 17, 25, 25); //body
        ellipse(character.x_pos - 11, character.y_pos - 3, 15, 10); //lead foot
        ellipse(character.x_pos + 10, character.y_pos - 3, 15, 10); //trail foot
        rect(character.x_pos - 2, character.y_pos - 45, 4, 25); //antenna
        ellipse(character.x_pos - 4, character.y_pos - 45, 12, 12); //eye
        fill(255);
        ellipse(character.x_pos - 7, character.y_pos - 45, 3, 8);
        stroke(0);
        strokeWeight(1.2);
        point(character.x_pos - 8, character.y_pos - 45);
        noStroke();
    } else if (character.isRight) {
        //DRAW Character walking right
        fill(147, 112, 219);
        ellipse(character.x_pos, character.y_pos - 17, 25, 25); //body
        ellipse(character.x_pos - 10, character.y_pos - 3, 15, 10); //trail foot
        ellipse(character.x_pos + 11, character.y_pos - 3, 15, 10); //lead foot
        rect(character.x_pos - 2, character.y_pos - 45, 4, 25); //antenna
        ellipse(character.x_pos + 4, character.y_pos - 45, 12, 12); //eye
        fill(255);
        ellipse(character.x_pos + 7, character.y_pos - 45, 3, 8);
        stroke(0);
        strokeWeight(1.2);
        point(character.x_pos + 8, character.y_pos - 45);
        noStroke();
    } else if (
        character.isInTheAir ||
        character.isPlummeting ||
        character.isSinking
    ) {
        //DRAW Character jumping facing forwards
        fill(147, 112, 219);
        ellipse(character.x_pos, character.y_pos - 22, 28, 28); //body
        ellipse(character.x_pos - 8, character.y_pos - 6, 10, 15); //feet
        ellipse(character.x_pos + 8, character.y_pos - 6, 10, 15);
        rect(character.x_pos - 10, character.y_pos - 51, 4, 25); //antenna
        rect(character.x_pos + 6, character.y_pos - 51, 4, 25);
        ellipse(character.x_pos - 8, character.y_pos - 51, 12, 12); //eyes
        ellipse(character.x_pos + 8, character.y_pos - 51, 12, 12);
        fill(255);
        ellipse(character.x_pos - 8, character.y_pos - 51, 9, 9);
        ellipse(character.x_pos + 8, character.y_pos - 51, 9, 9);
        stroke(0);
        strokeWeight(2);
        point(character.x_pos - 8, character.y_pos - 52);
        point(character.x_pos + 8, character.y_pos - 52);
        noStroke();
    } else {
        //DRAW Character standing facing forwards
        fill(147, 112, 219);
        ellipse(character.x_pos, character.y_pos - 18, 30, 25); //body
        ellipse(character.x_pos - 8, character.y_pos - 3, 15, 10); //feet
        ellipse(character.x_pos + 8, character.y_pos - 3, 15, 10);
        rect(character.x_pos - 10, character.y_pos - 45, 4, 25); //antenna
        rect(character.x_pos + 6, character.y_pos - 45, 4, 25);
        ellipse(character.x_pos - 8, character.y_pos - 45, 12, 12); //eyes
        ellipse(character.x_pos + 8, character.y_pos - 45, 12, 12);
        fill(255);
        ellipse(character.x_pos - 8, character.y_pos - 45, 7, 7);
        ellipse(character.x_pos + 8, character.y_pos - 45, 7, 7);
        stroke(0);
        strokeWeight(2);
        point(character.x_pos - 8, character.y_pos - 45);
        point(character.x_pos + 8, character.y_pos - 45);
        noStroke();

        //every 10 to 14 seconds call eyes to blink
        if ((millis() / 1000) % 14 > 10) {
            charBlink();
        }
    }
    //Draw Game Character Anchor point for debugging
    if (IS_SHOW_ANCHORS) {
        fill(255, 0, 0);
        ellipse(character.x_pos, character.y_pos, 10, 10);
    }
}

function moveChar() {
    if (character.isLeft) {
        moveCharX(-MOVESPEED);
    } else if (character.isRight) {
        moveCharX(MOVESPEED);
    }

    if (character.isJumping) {
        console.log("Jump!");
        character.y_pos -= 3;
        character.y_vel = JUMPVELOCITY;
        character.isJumping = false;
    }

    if (checkIsOnPlatform()) {
        //stop falling
        character.isInTheAir = false;
        character.y_vel = 0;

        //which platorm is it
        let platform = checkIsAtPlatform(character.x_world, character.y_pos);
        //If platform has velocity then move char with platform
        if (platform.x_velocity != undefined) {
            moveCharX(platform.x_velocity);
        }
    } else if (character.y_pos < FLOORHEIGHT) {
        //Character is falling.  Where do we fall to?
        let fallTo = undefined;

        //Either the floor or to a platform
        let platform = checkIsAtPlatform(character.x_world, character.y_pos);
        if (typeof platform == "object") {
            fallTo = platform.y_pos;
        } else {
            fallTo = FLOORHEIGHT;
        }

        //Don't fall past the ground
        character.y_pos = min((character.y_pos += character.y_vel), fallTo);
        character.y_vel += GRAVITY; // Gravity accelleration

        //Are we still in the air or did we land at our destination?
        character.isInTheAir = character.y_pos < fallTo;
    }

    if (character.isPlummeting) {
        character.y_pos += PLUMMETSPEED; // Plummet falls faster
        character.y_pos = min(
            (character.y_pos += character.y_vel),
            FLOORHEIGHT - WATERHEIGHT
        );
        character.y_vel += GRAVITY; // Gravity accelleration
    }

    if (character.isSinking && character.y_pos < height + 60) {
        character.y_pos += SINKSPEED; // Sink slowly
    }
}

function moveCharX(velocity) {
    if (velocity < 0) {
        //move Left
        if (character.x_pos > width * 0.2) {
            character.x_pos += velocity; // Move Character
        } else {
            scrollPos -= velocity; // Move World
        }
    } else {
        //move Right
        if (character.x_pos < width * 0.8) {
            character.x_pos += velocity; // Move Character
        } else {
            scrollPos -= velocity; // Move World
        }
    }
}

function updateWorldPosition() {
    character.x_world = character.x_pos - scrollPos;
}

//////////////////////////////////
//   CHARACTER INTERACTIONS		//
//////////////////////////////////

function checkCanyons() {
    for (let i = 0; i < canyons.length; i++) {
        if (
            abs(character.x_world - canyons[i].x_pos) <
                canyons[i].width / 2 - 5 &&
            canyons[i].y_pos == FLOORHEIGHT
        ) {
            if (character.y_pos == FLOORHEIGHT) {
                character.isPlummeting = true;
                console.log("Plummeting...");
                character.sndDeath.play(0.5);

                // stop player from moving character as he falls down the canyon
                character.isLeft = false;
                character.isRight = false;

                //Move Char left or right toward center of canyon before plummeting
                //So he doesn't get drawn half inside and half outside the water
                moveCharX(
                    constrain(canyons[i].x_pos - character.x_world, -8, 8)
                );

                character.sndSplash.play(0, 1, 0.2, 0.18);
            } else if (character.y_pos == FLOORHEIGHT - WATERHEIGHT) {
                //Once character hits the water transition to sinking
                character.isPlummeting = false;
                character.isSinking = true;
                console.log("Sinking...");
            }
        }
    }
}

function checkCollectables() {
    for (let i = 0; i < collectables.length - 1; i++) {
        if (collectables[i].isFound == false) {
            if (
                dist(
                    character.x_world,
                    character.y_pos,
                    collectables[i].x_pos,
                    collectables[i].y_pos
                ) < 50
            ) {
                player.sndCollect.play();
                collectables[i].isFound = true;
                console.log("Collectable found!");
                player.score++;
            }
        }
    }
}

function checkIsOnPlatform() {
    //first check if char is above any platform
    let platform = checkIsAtPlatform(character.x_world, character.y_pos);

    //if a platform is returned check if y_pos shows us ON the platform
    if (typeof platform == "object" && character.y_pos == platform.y_pos) {
        character.isOnPlatform = true;
    } else {
        character.isOnPlatform = false;
    }
    return character.isOnPlatform;
}

function checkFlagpole() {
    if (abs(character.x_world - flagpole.x_pos) < 10) {
        flagpole.isReached = true;
        console.log("Flagpole Reached!");
    }
}

function checkPlayerDeath() {
    if (character.y_pos > height - 30 && character.isDead == false) {
        character.isDead = true;
        player.lives--;
        console.log("player.lives = " + player.lives);
        if (player.lives > 0) {
            startLevel();
        }
    }
}

//////////////////////////////////////
//     ENVIRONMENTAL ANIMATIONS		//
//////////////////////////////////////

function charBlink() {
    //blink once every 2 seconds

    // I initially used framecount then later I
    // refactored to work based on milliseconds
    // since I found framerate could be unpredictable.
    let index = (millis() / 1000) % 2;

    //close and reopen eyelids
    if (index > 1.9) {
        fill(147, 112, 219);
        arc(
            character.x_pos - 8,
            character.y_pos - 45,
            7,
            7,
            (7 * PI) / 6,
            (11 * PI) / 6,
            CHORD
        );
        arc(
            character.x_pos - 8,
            character.y_pos - 45,
            7,
            7,
            PI / 6,
            (5 * PI) / 6,
            CHORD
        );
        arc(
            character.x_pos + 8,
            character.y_pos - 45,
            7,
            7,
            (7 * PI) / 6,
            (11 * PI) / 6,
            CHORD
        );
        arc(
            character.x_pos + 8,
            character.y_pos - 45,
            7,
            7,
            PI / 6,
            (5 * PI) / 6,
            CHORD
        );
        char_isBlink = false;
    } else if (index > 1.84) {
        fill(147, 112, 219);
        arc(character.x_pos - 8, character.y_pos - 45, 7, 7, PI, 0, CHORD);
        arc(character.x_pos - 8, character.y_pos - 45, 7, 7, 0, PI, CHORD);
        arc(character.x_pos + 8, character.y_pos - 45, 7, 7, PI, 0, CHORD);
        arc(character.x_pos + 8, character.y_pos - 45, 7, 7, 0, PI, CHORD);
    } else if (index > 1.78) {
        fill(147, 112, 219);
        arc(
            character.x_pos - 8,
            character.y_pos - 45,
            7,
            7,
            (7 * PI) / 6,
            (11 * PI) / 6,
            CHORD
        );
        arc(
            character.x_pos - 8,
            character.y_pos - 45,
            7,
            7,
            PI / 6,
            (5 * PI) / 6,
            CHORD
        );
        arc(
            character.x_pos + 8,
            character.y_pos - 45,
            7,
            7,
            (7 * PI) / 6,
            (11 * PI) / 6,
            CHORD
        );
        arc(
            character.x_pos + 8,
            character.y_pos - 45,
            7,
            7,
            PI / 6,
            (5 * PI) / 6,
            CHORD
        );
    } else if (index > 1.72) {
        fill(147, 112, 219);
        arc(
            character.x_pos - 8,
            character.y_pos - 45,
            7,
            7,
            (5 * PI) / 4,
            (7 * PI) / 4,
            CHORD
        );
        arc(
            character.x_pos - 8,
            character.y_pos - 45,
            7,
            7,
            PI / 4,
            (3 * PI) / 4,
            CHORD
        );
        arc(
            character.x_pos + 8,
            character.y_pos - 45,
            7,
            7,
            (5 * PI) / 4,
            (7 * PI) / 4,
            CHORD
        );
        arc(
            character.x_pos + 8,
            character.y_pos - 45,
            7,
            7,
            PI / 4,
            (3 * PI) / 4,
            CHORD
        );
    }
}

function waveFlag() {
    stroke(255, 215, 0);
    strokeWeight(3);

    //Credit to Simon and Edward's ITP1 Handl Microsession on using sin() technique

    //There is some tearing that occurs between the quad which attaches
    //to the flagpole and the fabric of the flag which is manipulated by the
    //sine function. I don't quite understand why this happens since they
    //both are drawn to the same pixel and I was unable to correct it.

    for (let i = 0; i < 75; i += 2) {
        line(
            flagpole.x_pos + 5 + i,
            flagpole.y_pos + flagpole.waveOffset,
            flagpole.x_pos + 5 + i,
            flagpole.y_pos + 50 + flagpole.waveOffset
        );

        flagpole.waveOffset = map(
            sin(radians((frameCount + i) * 5)),
            -1,
            1,
            0,
            10
        );
    }
    noStroke();
}

function raiseFlag() {
    //incrementally raise the flag on each iteration
    if (flagpole.y_pos > FLOORHEIGHT - 200) {
        flagpole.y_pos -= 2.5;

        //prevent sound from playing repeatedly
        if (flagpole.sndRaiseFlag.isPlaying() == false) {
            flagpole.sndRaiseFlag.play(0, 0.9, 0.1, 0.1);
        }

        //once flag reaches the top, play the fanfare
    } else if (flagpole.flagIsRaised == false) {
        player.sndPlayMusic.stop();
        flagpole.sndRaiseFlag.stop();

        player.sndVictory.play();

        //prevent character from moving
        character.isRight = false;
        character.isLeft = false;
        flagpole.flagIsRaised = true;
    }
}

//////////////////////////////////////
//          CONSTRUCTORS			//
//////////////////////////////////////

function MountainFar() {
    const PARALLAX = 0.2; // horiz motion in comparison to scroll rate
    const MOUNTAINSHADOW = 0.6; // percentage of each mountain not in shadow
    const MOUNTAINSNOW = 0.4; // percentage of each mountain covered by snow
    const HAZEALPHA = 200; // alpha value of distance haze

    //where to start the mountains and
    //where to end the mountains
    //note: the width of the world is affected by the value for parallax
    const START = -100;
    const END = WORLDWIDTH + width - WORLDWIDTH * (1 - PARALLAX);

    this.x_pos = int(random(START, END));
    this.height = int(random(200, 350));
    this.width = int(random(250, 400));

    this.draw = function () {
        // only draw object if is visible to the player
        if (
            isNotInViewport(this.x_pos - this.width / 2, PARALLAX, this.width)
        ) {
            return;
        }

        // push and pop required for parallax effect
        push();
        this.parallax();
        this.drawMountain();
        this.drawSnowcap();
        this.drawShadow();
        this.drawHaze();
        pop();
    };

    this.drawMountain = function () {
        fill(180);
        triangle(
            this.x_pos,
            FLOORHEIGHT - this.height,
            this.x_pos + this.width / 2,
            FLOORHEIGHT,
            this.x_pos - this.width / 2,
            FLOORHEIGHT
        );
        triangle(
            this.x_pos - this.width / 2,
            FLOORHEIGHT,
            this.x_pos,
            FLOORHEIGHT - this.height,
            this.x_pos + this.width / 2,
            FLOORHEIGHT
        );
    };

    this.drawSnowcap = function () {
        fill(255);
        beginShape();
        vertex(
            this.x_pos - (this.width / 2) * MOUNTAINSNOW,
            FLOORHEIGHT - this.height * (1 - MOUNTAINSNOW)
        );
        vertex(this.x_pos, FLOORHEIGHT - this.height);
        vertex(
            this.x_pos + (this.width / 2) * MOUNTAINSNOW,
            FLOORHEIGHT - this.height * (1 - MOUNTAINSNOW)
        );
        vertex(
            this.x_pos -
                (this.width / 2) * MOUNTAINSNOW * 0.65 +
                this.width * MOUNTAINSHADOW * MOUNTAINSNOW * 0.65,
            FLOORHEIGHT - this.height + MOUNTAINSNOW * 0.65 * this.height
        );
        endShape(CLOSE);
    };

    this.drawShadow = function () {
        fill(100, 100);
        triangle(
            this.x_pos - this.width / 2 + MOUNTAINSHADOW * this.width,
            FLOORHEIGHT,
            this.x_pos,
            FLOORHEIGHT - this.height,
            this.x_pos + this.width / 2,
            FLOORHEIGHT
        );
    };

    this.drawHaze = function () {
        //distance haze
        fill(150, 150, 240, HAZEALPHA);
        triangle(
            this.x_pos,
            FLOORHEIGHT - this.height,
            this.x_pos + this.width / 2,
            FLOORHEIGHT,
            this.x_pos - this.width / 2,
            FLOORHEIGHT
        );
    };

    this.showAnchor = function () {
        fill(255, 0, 0);
        ellipse(this.x_pos, FLOORHEIGHT, 10, 10);
    };

    this.parallax = function () {
        //parallax effect scrolls distant objects less than close objects
        translate(scrollPos * (PARALLAX % 1), 0);
    };
}

function Cloud() {
    const PARALLAX = 0.2;
    const GREYCLOUDOFFSET = 8;
    const DRIFTSPEED = 0.15;

    const START = -600;
    const END = WORLDWIDTH + width - WORLDWIDTH * (1 - PARALLAX);

    this.x_pos = int(random(START, END));
    this.y_pos = int(random(20, FLOORHEIGHT - 200));
    this.scale = random(0.5, 1.5);

    this.draw = function () {
        // only draw object if is visible to the player
        if (isNotInViewport(this.x_pos, PARALLAX)) {
            return;
        }

        // push and pop required for parallax effect
        push();
        this.parallax();
        this.drawCloud();
        pop();
    };

    this.drawCloud = function () {
        // first draw offset grey cloud
        fill(150);
        for (let j = GREYCLOUDOFFSET; j >= 0; j -= GREYCLOUDOFFSET) {
            rect(
                this.x_pos - 50 * this.scale + j,
                this.y_pos + j,
                100 * this.scale,
                30 * this.scale
            );
            ellipse(
                this.x_pos - 50 * this.scale + j,
                this.y_pos + j,
                60 * this.scale,
                60 * this.scale
            );
            ellipse(
                this.x_pos + 50 * this.scale + j,
                this.y_pos + j,
                60 * this.scale,
                60 * this.scale
            );
            ellipse(
                this.x_pos + j,
                this.y_pos - 20 * this.scale + j,
                80 * this.scale,
                80 * this.scale
            );

            // then draw white cloud on top
            fill(255);
        }
    };

    this.showAnchor = function () {
        fill(255, 0, 0);
        ellipse(this.x_pos, this.y_pos, 10, 10);
    };

    this.drift = function () {
        //move the cloud accross the world
        this.x_pos += DRIFTSPEED;

        //wrap cloud back to start if it has reached the end of the world
        if (this.x_pos > END) {
            this.x_pos = START;
        }
    };

    this.parallax = function () {
        //parallax effect scrolls distant objects less than close objects
        translate(scrollPos * (PARALLAX % 1), 0);
    };
}

function MountainNear() {
    // There is so much common code between the MountainFar constructor and the
    // MountainNear constructor, I know this could be programmed better.

    // I believe the best way to deal with this would have been to create a
    // parent constructor that used a MountainFar constructor and a
    // MountainNear constructor.

    // I also learned about building a class that could inherit properties from
    // another class which I think would be useful here.

    // Unfortunately, both these techniques are a little beyond my skill level.
    // I look forward to ITP2 to learn about how I might best deal with this situation.

    const PARALLAX = 0.6;
    const MOUNTAINSHADOW = 0.6; // percentage of each mountain not in shadow
    const MOUNTAINSNOW = 0.4; // percentage of each mountain covered by snow

    const START = -100;
    const END = WORLDWIDTH + width - WORLDWIDTH * (1 - PARALLAX);

    this.x_pos = int(random(START, END));
    this.height = int(random(200, 400));
    this.width = int(random(250, 600));

    this.draw = function () {
        if (isNotInViewport(this.x_pos - this.width, PARALLAX, this.width)) {
            return;
        }

        push();
        this.parallax();
        this.drawMountain();
        this.drawSnowcap();
        this.drawShadow();
        pop();
    };

    this.drawMountain = function () {
        fill(180);
        triangle(
            this.x_pos,
            FLOORHEIGHT - this.height,
            this.x_pos + this.width / 2,
            FLOORHEIGHT,
            this.x_pos - this.width / 2,
            FLOORHEIGHT
        );
        triangle(
            this.x_pos - this.width / 2,
            FLOORHEIGHT,
            this.x_pos,
            FLOORHEIGHT - this.height,
            this.x_pos + this.width / 2,
            FLOORHEIGHT
        );
    };

    this.drawSnowcap = function () {
        fill(255);
        beginShape();
        vertex(
            this.x_pos - (this.width / 2) * MOUNTAINSNOW,
            FLOORHEIGHT - this.height * (1 - MOUNTAINSNOW)
        );
        vertex(this.x_pos, FLOORHEIGHT - this.height); //peak
        vertex(
            this.x_pos + (this.width / 2) * MOUNTAINSNOW,
            FLOORHEIGHT - this.height * (1 - MOUNTAINSNOW)
        );
        vertex(
            this.x_pos -
                (this.width / 2) * MOUNTAINSNOW * 0.65 +
                this.width * MOUNTAINSHADOW * MOUNTAINSNOW * 0.65,
            FLOORHEIGHT - this.height + MOUNTAINSNOW * 0.65 * this.height
        );
        endShape(CLOSE);
    };

    this.drawShadow = function () {
        fill(100, 100);
        triangle(
            this.x_pos - this.width / 2 + MOUNTAINSHADOW * this.width,
            FLOORHEIGHT,
            this.x_pos,
            FLOORHEIGHT - this.height,
            this.x_pos + this.width / 2,
            FLOORHEIGHT
        );
    };

    this.showAnchor = function () {
        fill(255, 0, 0);
        ellipse(this.x_pos, FLOORHEIGHT, 10, 10);
    };

    this.parallax = function () {
        translate(scrollPos * (PARALLAX % 1), 0);
    };
}

function Tree() {
    // Parallax of 1 means NO parallax effect
    // however, we retain this functionality for future levels
    // A forest level might have multiple layers of trees with different parallax values
    const PARALLAX = 1;

    const START = -100;
    const END = WORLDWIDTH + width - WORLDWIDTH * (1 - PARALLAX);

    this.x_pos = int(random(START, END));
    this.scale = random(0.7, 1.5);

    this.draw = function () {
        if (isNotInViewport(this.x_pos, PARALLAX)) {
            return;
        }

        push();
        this.parallax();
        this.drawTree();
        pop();
    };

    this.drawTree = function () {
        fill(191, 91, 33);
        rect(
            this.x_pos - 12 * this.scale,
            FLOORHEIGHT,
            24 * this.scale,
            -90 * this.scale
        );
        fill(103, 191, 90);
        ellipse(
            this.x_pos - 30 * this.scale,
            FLOORHEIGHT - 112 * this.scale,
            100 * this.scale,
            100 * this.scale
        );
        ellipse(
            this.x_pos + 35 * this.scale,
            FLOORHEIGHT - 122 * this.scale,
            90 * this.scale,
            90 * this.scale
        );
        ellipse(
            this.x_pos,
            FLOORHEIGHT - 165 * this.scale,
            105 * this.scale,
            85 * this.scale
        );
        ellipse(
            this.x_pos + 5 * this.scale,
            FLOORHEIGHT - 75 * this.scale,
            60 * this.scale,
            50 * this.scale
        );
    };

    this.showAnchor = function () {
        fill(255, 0, 0);
        ellipse(this.x_pos, FLOORHEIGHT, 10, 10);
    };

    this.parallax = function () {
        translate(scrollPos * (PARALLAX % 1), 0);
    };
}

function Bird(index) {
    const START = -600;
    const END = WORLDWIDTH + width;

    this.x_pos = int(random(START, END));
    this.y_pos = int(random(10, FLOORHEIGHT - 200));

    // we use index to uniquely identify each bird.
    // this index is used to calculate a unique seed position for perlin noise generation.
    // Is there a better way? This seems wasteful. There is probably a way each bird could determine
    // its own position in the array, or some other unique identifier, but I couldn't find it.
    this.index = index;

    // set random starting wing position for each bird
    // so that they are not all flapping simultaneously
    this.wing_pos = int(random(250, 600));

    //random velocity -5 to -1 or 1 to 5, exclude zero velocity
    this.velocity = random([-1, 1]) * int(random(1, 5));

    this.draw = function () {
        if (isNotInViewport(this.x_pos)) {
            return;
        }

        push();

        //translate to bird position
        translate(this.x_pos, this.y_pos);

        //rotate bird based on its direction of flight
        if (this.velocity > 0) {
            rotate(PI);
        }

        this.drawBird();
        this.drawWings();

        pop();
    };

    this.drawBird = function () {
        fill(255, 140, 0);
        triangle(-8, 0, -3, -2, -3, 2);
        fill(60);
        ellipse(0, 0, 7, 7);
        ellipse(12, 00, 22, 8);
    };

    this.drawWings = function () {
        //Credit to Simon and Edward's ITP1 Handl Microsession
        //using Sine function to set wing position
        let w = sin(millis() / 200 + this.wing_pos);
        quad(4, 0, 12, w * 18, 20, w * 21, 19, 0);
    };

    this.fly = function () {
        this.x_pos += this.velocity;

        // when bird reaches the edge of the level it reverses direction
        if (this.x_pos > END || this.x_pos < START) {
            this.velocity *= -1;
        }

        // Use perlin noise generator to smoothly randomize bird Y movement
        // Credit to Dan Shiffman of 'The Coding Train' YouTube Channel
        // for the technique of using perlin noise to create "smooth" randomness
        let yOffset = noise((this.index * 100 + frameCount) / 500);
        this.y_pos = map(yOffset, 0, 1, 0, FLOORHEIGHT - 200);
    };

    this.showAnchor = function () {
        fill(255, 0, 0);
        ellipse(this.x_pos, this.y_pos, 10, 10);
    };
}

function Canyon(x_pos, width, topLevel, bottomLevel) {
    const START = 300;
    const END = WORLDWIDTH - 300;
    const WATERSPEED = 2;

    this.x_pos = x_pos;
    this.y_pos = FLOORHEIGHT - topLevel * LEVELHEIGHT;
    this.width = width;
    this.floorPos = bottomLevel;
    this.streams = [];

    //Some canyons are static and are created with values passed into the constructor
    //Random canyons are created with no values,
    //then this function is run to add randomized values
    this.randomizeCanyon = function () {
        this.x_pos = int(random(START, END));
        this.y_pos = FLOORHEIGHT;
        this.width = int(random(45, 90));
        this.floorPos = height;
    };

    this.setFallBottom = function () {
        if (this.floorPos < 0) {
            this.floorPos = height;
        } else {
            this.floorPos = FLOORHEIGHT - this.floorPos * LEVELHEIGHT;
        }
    };

    //Create random rivlets of water in an array for each canyon
    this.populateStreams = function () {
        for (let i = 0; i < this.width / 4; i++) {
            let x = int(random(5, this.width - 5));
            let y = int(random(this.y_pos - WATERHEIGHT, this.floorPos));
            let len = int(random(5, 20));

            this.streams.push({ x: x, y: y, len: len });
        }
    };

    this.draw = function () {
        if (isNotInViewport(this.x_pos - this.width / 2, 1, this.width)) {
            return;
        }

        fill(0, 206, 209);
        rect(
            this.x_pos - this.width / 2,
            this.y_pos,
            this.width,
            this.floorPos - this.y_pos
        );
    };

    this.drawWaterfall = function () {
        if (isNotInViewport(this.x_pos - this.width / 2, 1, this.width)) {
            return;
        }

        fill(0, 206, 209, 150);
        rect(
            this.x_pos - this.width / 2,
            this.y_pos - WATERHEIGHT,
            this.width,
            this.floorPos - this.y_pos + WATERHEIGHT
        );

        this.drawStreams();
    };

    this.drawStreams = function () {
        stroke(224, 255, 255);
        strokeWeight(2);

        for (let i = 0; i < this.streams.length; i++) {
            this.updateStream(this.streams[i]);

            let x = this.x_pos - this.width / 2 + this.streams[i].x;
            let y = this.streams[i].y;
            let len = this.streams[i].len;

            //draw each stream but do not go past the bottom of the falls
            line(x, y, x, min(y + len, this.floorPos - 1));

            //whatever portion of the stream is past the bottom, draw at the top
            amtPastFloor = y + len - this.floorPos - 1;
            if (amtPastFloor > 0) {
                line(
                    x,
                    this.y_pos - WATERHEIGHT,
                    x,
                    this.y_pos - WATERHEIGHT + amtPastFloor
                );
            }
        }
        noStroke();
    };

    this.updateStream = function (stream) {
        stream.y += WATERSPEED;
        if (stream.y > this.floorPos - 1) {
            stream.y = this.y_pos - WATERHEIGHT;
        }
    };

    this.showAnchor = function () {
        fill(255, 0, 0);
        rectMode(CENTER);
        rect(this.x_pos, this.y_pos, this.width, 3);
        ellipse(this.x_pos, this.y_pos, 10, 10);
        rectMode(CORNER);
    };
}

function Collectable() {
    const SCALE = 0.8;
    const GRIDRES = 40;

    const START = 250;
    const END = WORLDWIDTH - 400;

    // use GRIDRES multiplier to arange gems on a grid
    this.x_pos = START + int(random(0, (END - START) / GRIDRES)) * GRIDRES;

    // randomly choose one of 3 levels to arrange gems vertically
    this.y_pos = FLOORHEIGHT - int(random(1, 3.99)) * GRIDRES;

    this.isFound = false;

    // when a gem is found it will gradually fade away
    // intial alpha value is 100% visible
    this.alpha = 255;

    this.draw = function () {
        if (isNotInViewport(this.x_pos)) {
            return;
        }
        this.drawGem();
    };

    this.drawGem = function () {
        fill(255, 215, 0, this.alpha);

        triangle(
            this.x_pos,
            this.y_pos - 10 * SCALE,
            this.x_pos + 10 * SCALE,
            this.y_pos,
            this.x_pos - 10 * SCALE,
            this.y_pos
        );
        triangle(
            this.x_pos - 10 * SCALE,
            this.y_pos + 1 * SCALE,
            this.x_pos,
            this.y_pos + 25 * SCALE,
            this.x_pos + 10 * SCALE,
            this.y_pos + 1 * SCALE
        );
        triangle(
            this.x_pos - 11 * SCALE,
            this.y_pos - 1 * SCALE,
            this.x_pos - 1 * SCALE,
            this.y_pos - 11 * SCALE,
            this.x_pos - 13 * SCALE,
            this.y_pos - 9 * SCALE
        );
        triangle(
            this.x_pos - 12 * SCALE,
            this.y_pos,
            this.x_pos - 14 * SCALE,
            this.y_pos - 8 * SCALE,
            this.x_pos - 20 * SCALE,
            this.y_pos - 2 * SCALE
        );
        triangle(
            this.x_pos - 12 * SCALE,
            this.y_pos + 1 * SCALE,
            this.x_pos - 20 * SCALE,
            this.y_pos - 1 * SCALE,
            this.x_pos - 2 * SCALE,
            this.y_pos + 24 * SCALE
        );
        triangle(
            this.x_pos + 11 * SCALE,
            this.y_pos - 1 * SCALE,
            this.x_pos + 1 * SCALE,
            this.y_pos - 11 * SCALE,
            this.x_pos + 13 * SCALE,
            this.y_pos - 9 * SCALE
        );
        triangle(
            this.x_pos + 12 * SCALE,
            this.y_pos,
            this.x_pos + 14 * SCALE,
            this.y_pos - 8 * SCALE,
            this.x_pos + 20 * SCALE,
            this.y_pos - 2 * SCALE
        );
        triangle(
            this.x_pos + 12 * SCALE,
            this.y_pos + 1 * SCALE,
            this.x_pos + 20 * SCALE,
            this.y_pos - 1 * SCALE,
            this.x_pos + 2 * SCALE,
            this.y_pos + 24 * SCALE
        );
    };

    this.raise = function () {
        this.alpha -= 5;
        this.y_pos -= 5;
    };

    this.showAnchor = function () {
        fill(255, 0, 0);
        ellipse(this.x_pos, this.y_pos, 10, 10);
    };
}

function Platform(x_pos, level, len) {
    this.x_pos = x_pos;
    this.y_pos = FLOORHEIGHT - level * LEVELHEIGHT;
    this.len = len;

    this.draw = function () {
        if (isNotInViewport(this.x_pos, 1, this.len)) {
            return;
        }

        fill(139, 69, 19);
        rect(this.x_pos, this.y_pos, this.len, FLOORHEIGHT - this.y_pos);
        this.drawGrass();
    };

    this.drawGrass = function () {
        stroke(0, 155, 0);
        strokeWeight(5);
        strokeCap(SQUARE);

        // vary the length of the grass using perlin noise
        // Credit to Dan Shiffman of 'The Coding Train' YouTube Channel
        // for the idea to use perlin noise to render a "smooth" randomness
        for (i = -3; i < this.len + 3; i += 2) {
            yOffset = noise(this.x_pos + this.y_pos + i * 0.03) * 30;
            line(
                this.x_pos + i,
                this.y_pos,
                this.x_pos + i,
                this.y_pos + yOffset
            );
        }
        noStroke();
    };

    this.showAnchor = function () {
        fill(255, 0, 0);
        ellipse(this.x_pos, this.y_pos, 10, 10);
    };
}

function MovingPlatform(x_limitLeft, level, len, x_limitRight, x_velocity) {
    this.x_pos = x_limitLeft;
    this.y_pos = FLOORHEIGHT - level * LEVELHEIGHT;
    this.x_limitLeft = x_limitLeft;
    this.x_limitRight = x_limitRight;
    this.len = len;
    this.x_velocity = x_velocity;

    this.draw = function () {
        if (isNotInViewport(this.x_pos, 1, this.len)) {
            return;
        }

        fill(139, 69, 19);
        rect(this.x_pos, this.y_pos, this.len, 10);
    };

    this.move = function () {
        this.x_pos = this.x_pos += this.x_velocity;

        if (
            this.x_pos + this.len > this.x_limitRight ||
            this.x_pos < this.x_limitLeft
        ) {
            this.x_velocity *= -1;
        }
    };

    this.showAnchor = function () {
        fill(255, 0, 0);
        ellipse(this.x_pos, this.y_pos, 10, 10);
    };
}
