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
    let alpha = map(mouseY, 0, height, 0, 40);
    fill(0, alpha);
    rect(0, 0, width, height);

    push();
    noStroke();
    for (i = 0; i < points.length; i++) {
        let colour = lerpColor(
            color(255, 0, 0),
            color(0, 0, 255),
            noise(frameCount * 0.05 + i * 0.01)
        );
        fill(colour);
        let amt = map(mouseX, 0, width, 0, 80);
        let nX = map(
            noise(frameCount * 0.05 + points[i].x + points[i].y),
            0,
            1,
            -amt,
            amt
        );
        let nY = map(
            noise(frameCount * 0.05 - points[i].x - points[i].y),
            0,
            1,
            -amt,
            amt
        );
        particleSize = map(noise(frameCount * 0.01), 0, 1, 1, 20);
        ellipse(points[i].x + nX, points[i].y + nY, particleSize);
    }
    pop();
}
