//////////////////////////////////////////////////////////////////
//				        Graphics Programming    	            //
//								      						    //
//				      Final Coursework Project 8			    //
//					        Webcam Piano    				    //
//						    February 2023	    				//
//														        //
//////////////////////////////////////////////////////////////////

///////////////////////////////
//   Variable Declarations   //
///////////////////////////////

let video;

let currImg;
let prevImg;
let diffImg;

let thresholdSlider;
let threshold;

let grid;
let pops = [];

///////////////////////////////
//  	    SETUP		     //
///////////////////////////////

function setup() {
    createCanvas(640 * 2, 480);
    pixelDensity(1);

    rectMode(CENTER);
    colorMode(HSB, 360, 100, 100, 255);
    noStroke();

    // capture video from WebCam
    video = createCapture(VIDEO);
    video.hide();

    // create "piano" grid
    grid = new Grid(640, 480);

    createDOMobjects();
}

///////////////////////////////
//  	    DRAW		     //
///////////////////////////////

function draw() {
    background(0);
    image(video, 0, 0);

    // capture threshold slider value
    threshold = thresholdSlider.value() * -1;

    // capture video frame into current image
    currImg = createImage(video.width, video.height);
    currImg.copy(
        video,
        0,
        0,
        video.width,
        video.height,
        0,
        0,
        video.width,
        video.height
    );
    currImg.resize(video.width / 4, 0);
    currImg.filter(BLUR, 3);

    // create diferential image
    diffImg = createImage(currImg.width, currImg.height);
    if (typeof prevImg !== "undefined") {
        updateDiffImg();
    }
    image(diffImg, 640, 0);

    // copy current video frame into previous
    prevImg = createImage(currImg.width, currImg.height);
    prevImg.copy(
        currImg,
        0,
        0,
        currImg.width,
        currImg.height,
        0,
        0,
        currImg.width,
        currImg.height
    );

    // add the piano grid circles
    grid.run(diffImg);

    // draw the poppers
    pops.forEach((popper, index) => {
        popper.draw();
        popper.grow();
        // remove expired poppers
        if (popper.alpha <= 0) {
            pops.splice(index, 1);
        }
    });
}

///////////////////////////////
//      Helper Functions     //
///////////////////////////////

function updateDiffImg() {
    currImg.loadPixels();
    prevImg.loadPixels();
    diffImg.loadPixels();

    // read every pixel
    for (let x = 0; x < currImg.width; x += 1) {
        for (let y = 0; y < currImg.height; y += 1) {
            // calculate pixel index in the pixel array
            let index = (x + y * currImg.width) * 4;

            // capture current image pixels
            let redSource = currImg.pixels[index + 0];
            let greenSource = currImg.pixels[index + 1];
            let blueSource = currImg.pixels[index + 2];

            // capture previous image pixels
            let redBack = prevImg.pixels[index + 0];
            let greenBack = prevImg.pixels[index + 1];
            let blueBack = prevImg.pixels[index + 2];

            // calculate the colour diference
            let d = distSquared(
                redSource,
                greenSource,
                blueSource,
                redBack,
                greenBack,
                blueBack
            );

            // set pixel to black if diference exceeds threshold
            if (d > threshold * threshold) {
                diffImg.pixels[index + 0] = 0;
                diffImg.pixels[index + 1] = 0;
                diffImg.pixels[index + 2] = 0;
                diffImg.pixels[index + 3] = 255;
            } else {
                diffImg.pixels[index + 0] = 255;
                diffImg.pixels[index + 1] = 255;
                diffImg.pixels[index + 2] = 255;
                diffImg.pixels[index + 3] = 255;
            }
        }
    }
    diffImg.updatePixels();
}

function createDOMobjects() {
    leftDIV = createDiv();
    leftDIV.style("width", "50%");
    leftDIV.style("padding", "1em");
    leftDIV.style("color", "white");
    leftDIV.style("font-size", "1.5em");
    leftDIV.html("<p>Motion detection sensitivity:<p>");

    thresholdSlider = createSlider(-200, 0, -60);
    thresholdSlider.style("width", "50%");
    thresholdSlider.parent(leftDIV);
}

// faster method for calculating color similarity which does not calculate root
function distSquared(r1, g1, b1, r2, g2, b2) {
    return (
        (r2 - r1) * (r2 - r1) + (g2 - g1) * (g2 - g1) + (b2 - b1) * (b2 - b1)
    );
}
