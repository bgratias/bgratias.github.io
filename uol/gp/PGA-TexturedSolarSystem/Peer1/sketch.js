var earthImg;
var sunImg;
var moonImg;
var starsPlane;

function preload() {
    earthImg = loadImage("assets/earth.jpg");
    sunImg = loadImage("assets/sun.jpg");
    moonImg = loadImage("assets/moon.jpg");
}

function setup() {
    createCanvas(900, 600, WEBGL);
    angleMode(DEGREES);
    starsPlane = createGraphics(900, 600);

    starLocs = [];
    for (var i = 0; i < 500; i++) {
        starLocs.push([
            random(0, starsPlane.width),
            random(0, starsPlane.height),
        ]);
    }
}

function sky() {
    starsPlane.background(0);
    for (var i = 0; i < starLocs.length; i++) {
        if (random(0, 1) > 0.999) {
            starLocs[i] = [
                random(0, starsPlane.width),
                random(0, starsPlane.height),
            ];
        }
        starsPlane.ellipse(starLocs[i][0], starLocs[i][1], 2, 2);
    }
}

function draw() {
    orbitControl();
    camera(0, -height / 2, height, 0, 0, 0, 0, 1, 0);

    background(0);

    push();
    translate(0, 0, -height * 2);

    sky();

    texture(starsPlane);
    plane(width * 10, height * 10);
    pop();

    push();
    rotateY(frameCount);
    noStroke();
    texture(sunImg);
    sphere(100); // Sun

    pointLight(255, 255, 255, 0, 0, 0);
    pointLight(255, 255, 255, 0, 0, 0);

    translate(300, 0, 0);
    rotateY(frameCount);
    ambientMaterial(255, 255, 255);
    texture(earthImg);
    sphere(50); // Earth

    pop();
}
