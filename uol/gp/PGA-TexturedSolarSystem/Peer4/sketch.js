let sunTexture;
let earthTexture;
let moonTexture;

let graphics;

let starLocs = [];

function preload() {
    sunTexture = loadImage("assets/sun.jpg");
    earthTexture = loadImage("assets/earth.jpg");
    moonTexture = loadImage("assets/moon.jpg");
}

function setup() {
    createCanvas(900, 900, WEBGL);

    noStroke();

    graphics = createGraphics(900, 900);
    graphics.noStroke();

    for (let i = 0; i < 200; i++) {
        starLocs.push({ x: random(graphics.width), y: random(graphics.width) });
    }
}

function draw() {
    camera(0, -300, height, 0, 0, 0, 0, 1, 0);
    perspective(radians(51), width / height);

    background(0);

    sky();

    let rotation = radians(frameCount);

    //this structure describe the whole solar system and can have arbitary number of celestial objects and satellites
    let solarSystem = {
        orbitRadius: 0, //SUN
        radius: 85,
        texture: sunTexture,
        rotationAroundOwnAxis_X: 0,
        rotationAroundOwnAxis_Y: rotation / 3,
        rotationAroundOwnAxis_Z: 0,
        rotationAroundParent: 0,
        emitsLight: true,
        satellites: [
            {
                orbitRadius: 200, //EARTH
                radius: 35,
                texture: earthTexture,
                rotationAroundOwnAxis_X: rotation / 2,
                rotationAroundOwnAxis_Y: rotation / 2,
                rotationAroundOwnAxis_Z: 0,
                rotationAroundParent: rotation,
                emitsLight: false,
                satellites: [
                    {
                        orbitRadius: 100, //MOON 2
                        radius: 22,
                        texture: moonTexture,
                        rotationAroundOwnAxis_X: 0,
                        rotationAroundOwnAxis_Y: 0,
                        rotationAroundOwnAxis_Z: 0,
                        rotationAroundParent: -1.75 * rotation,
                        emitsLight: false,
                        satellites: [],
                    },
                ],
            },
        ],
    };

    drawCelestialSystem(solarSystem);
}

function drawCelestialSystem(celestialSystem) {
    translate(celestialSystem.orbitRadius, celestialSystem.orbitRadius);

    push();
    rotateX(celestialSystem.rotationAroundOwnAxis_X);
    rotateY(celestialSystem.rotationAroundOwnAxis_Y);
    rotateZ(celestialSystem.rotationAroundOwnAxis_Z);

    drawCelestialObject(
        celestialSystem.texture,
        celestialSystem.radius,
        celestialSystem.emitsLight
    );

    rotateX(-celestialSystem.rotationAroundOwnAxis_X);
    rotateY(-celestialSystem.rotationAroundOwnAxis_Y);
    rotateZ(-celestialSystem.rotationAroundOwnAxis_Z);

    celestialSystem.satellites.forEach((satellite) => {
        push();
        rotate(satellite.rotationAroundParent);
        drawCelestialSystem(satellite);
        pop();
    });
    pop();
}

function drawCelestialObject(celestialObjectTexture, radius, emitsLight) {
    texture(celestialObjectTexture);
    sphere(radius, 20, 20);

    if (emitsLight) {
        pointLight(255, 255, 255, 0, 0, 0);
        pointLight(255, 255, 255, 0, 0, 0);
    }
}

function sky() {
    graphics.background(0);
    graphics.fill(255, 255, 255);
    starLocs.forEach((starLoc) => {
        if (random(1000) < 2) {
            starLoc.x = random(graphics.width);
            starLoc.y = random(graphics.width);
        }
        graphics.ellipse(starLoc.x, starLoc.y, 5, 5);
    });

    texture(graphics);
    rotateX(atan(300 / height));
    plane(width, height);
}
