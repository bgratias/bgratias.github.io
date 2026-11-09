// PGA:  Textured Solar System

// declare variables
let speed;

let starfield = [];
let starfieldBuffer;

let textureSun;
let textureEarth;
let textureMoon;

function preload() {
    textureSun = loadImage("assets/sun.jpg");
    textureEarth = loadImage("assets/earth.jpg");
    textureMoon = loadImage("assets/moon.jpg");
}

function setup() {
    createCanvas(1600, 900, WEBGL);

    angleMode(DEGREES);
    smooth();
    noStroke();

    starfieldBuffer = createGraphics(width * 2, height * 2);

    camera = createCamera();
    camera.setPosition(0, -500, height * 1.2);
    camera.lookAt(0, 0, 0);
    perspective(50, width / height);
}

function draw() {
    background(0);
    speed = millis() / 40;

    orbitControl(2, 2);

    updateStarfield(200);
    drawStarfield();

    drawSun();
    ambientLight(15);
    drawEarth();
    drawMoon();
}

function drawSun() {
    // draw sun
    push();
    rotateY(-speed / 4); // spin the sun
    texture(textureSun);
    sphere(150);
    pop();

    // add 2 points of light (for enough brightness)
    pointLight(255, 255, 255, 0, 0, 0);
    pointLight(255, 255, 255, 0, 0, 0);
}

function drawEarth() {
    // move into orbit
    rotateY(-speed);
    translate(width / 3, 0);
    rotateY(speed);

    // tilt planet
    rotateZ(23.5);

    // draw axis
    push();
    noStroke();
    ambientLight(200);
    ambientMaterial(255, 0, 0);
    cylinder(1, 160);
    pop();

    // draw planet
    push();
    rotateY(-speed * 10); // spin the planet
    texture(textureEarth);
    sphere(60);
    pop();
}

function drawMoon() {
    // move into orbit
    rotateY(-speed * 3);
    translate(100, 0);

    // draw moon
    push();
    rotateY(speed * 3); // spin the moon
    texture(textureMoon);
    sphere(20);
    pop();
}

function updateStarfield(numStars) {
    // generate random stars and add to starfield array
    while (starfield.length < numStars) {
        starfield.push({
            xPos: random(0, starfieldBuffer.width),
            yPos: random(0, starfieldBuffer.height),
            magnitude: abs(randomGaussian(0, 4)) + 1,
            bloom: 0,
        });
    }

    // render the starfield
    starfieldBuffer.background(0);
    for (let i = 0; i < starfield.length; i++) {
        // bloom a random star for "twinkle effect"
        if (random() < 0.0003) {
            starfield[i].bloom = 180;
        }
        let addMag = 0;
        if (starfield[i].bloom) {
            addMag = 15 * sin(starfield[i].bloom);
            starfield[i].bloom -= 5;
        }

        // add stars
        starfieldBuffer.rect(
            starfield[i].xPos,
            starfield[i].yPos,
            starfield[i].magnitude + addMag
        );
    }
}

function drawStarfield() {
    push();
    // locate behind solar system
    translate(0, 300, -600);
    // tilt to correspond to camera angle
    rotateX(25);
    // draw the starfield
    texture(starfieldBuffer);
    plane(starfieldBuffer.width, starfieldBuffer.height);
    pop();
}
