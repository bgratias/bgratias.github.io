var points;
var font;
function preload() {
    font = loadFont("assets/Calistoga-Regular.ttf");
}

//////////////////////////////////////////////////////////////////////
function setup() {
    createCanvas(900, 400);
    background(0);

    points = font.textToPoints("c o d e", 50, 300, 300, {
        sampleFactor: 0.3,
        simplifyThreshold: 0,
    });
}

//////////////////////////////////////////////////////////////////////
function draw() {
    // Bonus 4
    let alpha = map(mouseY, 0, height, 5, 25);
    fill(0, alpha);
    rect(0, 0, width, height);

    noStroke();

    // Bonus 1
    let amt = map(mouseX, 0, width, 0, 80);

    for (let i = 0; i < points.length; i++) {
        let point = points[i];

        let nX = noise(frameCount / 100 + point.x + point.y);
        let x = map(nX, 0, 1, -amt, amt);

        let nY = noise(frameCount / 100 + point.x + point.y + 5);
        let y = map(nY, 0, 1, -amt, amt);

        // Bonus 2
        let r = map(nX, 0, 1, 0, 255);
        let g = map(nY, 0, 1, 0, 255);

        let nZ = noise(frameCount / 100 + point.x + point.y + 10);
        let b = map(nZ, 0, 1, 0, 255);
        fill(r, g, b, 150);

        // Bonus 3
        let nS = noise(frameCount / 100 + point.x + point.y + 7);
        let size = map(nS, 0, 1, 1, 30);

        ellipse(point.x + x, point.y + y, size);
    }
}
