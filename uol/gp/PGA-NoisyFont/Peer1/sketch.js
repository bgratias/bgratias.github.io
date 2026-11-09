var points;
var font;
var amt;

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

    // fading of the rect is mapped to mouseY with fading slow (5) at top and fast (10) at the bottom
    let fillParam = map(mouseY, 0, height, 5, 10);

    fill(0, fillParam);
    rect(0,0,width,height);
    
    // maps the amount of movement to mouseX
    amt = map(mouseX, 0, width, 0, 80);
    // maps the width of the stroke from 1 at the top to 0 at bottom
    strokeWidth = map(mouseY, 0, height, 1, 0);

    // maps the greenness of the ellipses to mouseY
    var green = map(mouseY, 0, height, 60, 0);

    // **** Your code here ****

    for (let i = 0; i < points.length; i++)
    { 
      // scales the frameCount
      let frames = frameCount * 0.03;
      frames = frames + points[i].x + points[i].y;

      let nX= noise(frames);
      let offsetX = map(nX, 0, 1, -amt, amt);
      // couples the redness of the ellipses with nX
      let red = map(nX, 0, 1, 50, 255);

      let nY = noise(frames + 0.8);
      let offsetY = map(nY, 0, 1, -amt, amt);
      // couples the blueness of the ellipses with nY
      let blue = map(nY, 0, 1, 50, 255);

      // creates a different noise variable, nZ uncoupled from nX and nY
      let nZ = noise(frames + 2.2);
      // varies the size of the ellipses from 2 to 10 depending on nZ
      let size = map(nZ, 0, 1, 4, 12);

      stroke(0);
      strokeWeight(strokeWidth);
      fill(red, green, blue, points[i].alpha);
      push();
        // translate by new location (point's coords + offsets)
        translate(points[i].x + offsetX, points[i].y + offsetY);
        ellipse(0, 0, size, size);
      pop();

    }
}
