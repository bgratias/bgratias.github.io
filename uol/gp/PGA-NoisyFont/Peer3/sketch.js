var points;
var font;
var amt;
var color;
var size;
var trail;

function preload() {
    font = loadFont('assets/Calistoga-Regular.ttf');
}

//////////////////////////////////////////////////////////////////////
function setup() {
    createCanvas(900, 400);
    background(0);

    points = font.textToPoints('c o d e', 50, 300, 300, {
        sampleFactor: .3,
        simplifyThreshold: 0
    });
}

//////////////////////////////////////////////////////////////////////
function draw() {
    var trail = map(mouseY, 0, height, 1, 10);
    fill(0, trail);
    rect(0, 0, width, height);

    // **** Your code here ****
    for (i = 0; i < points.length; i++) {
        var amt = map(mouseX, 0, width, 0, 80);
        var color = map(mouseX, 0, width, 0, 255);
        var size = map(mouseX, 0, width, 5, 12);
        
        var nX = noise(points[i].x + points[i].y + (frameCount * 0.008));
        var locX = map(nX, 0, 1, -amt, amt);
        
        var nY = noise(points[i].x + points[i].y + (frameCount * 0.008) + 5);
        var locY = map(nY, 0, 1, -amt, amt);
        
        fill(color, 0, 255);
        noStroke();
        ellipse(points[i].x + locX, points[i].y + locY, size);
    }
}