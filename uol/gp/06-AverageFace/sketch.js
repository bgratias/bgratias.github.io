//////////////////////////////////////////////////////////////////
//				    Graphics Programming    					//
//																//
//				 Final Coursework Project 6			    		//
//					    Average Face 							//
//						January 2023							//
//																//
//////////////////////////////////////////////////////////////////

///////////////////////////////
//   Variable Declarations   //
///////////////////////////////

let numOfImages = 30;

let imgs = [];
let avgImg, lerpFace;

let slider1, slider2;

let displayImage = 0;
let lerpValue = 1;

///////////////////////////////
//  	    PRELOAD		     //
///////////////////////////////

function preload() {
    // load in faces
    for (i = 0; i < numOfImages; i++) {
        let filename = "assets/" + i + ".jpg";
        imgs[i] = loadImage(filename);
    }
}

///////////////////////////////
//  		 SETUP		     //
///////////////////////////////

function setup() {
    createCanvas(imgs[0].width * 2, imgs[0].height);
    pixelDensity(1);

    // create an empty buffer for the new images
    avgImg = createGraphics(imgs[0].width, imgs[0].height);
    lerpFace = createGraphics(imgs[0].width, imgs[0].height);

    createSliders();
}

///////////////////////////////
//  		 DRAW		     //
///////////////////////////////

function draw() {
    background(125);

    // display an original image
    image(imgs[displayImage], 0, 0);

    // Load pixel arrays
    for (i = 0; i < numOfImages; i++) {
        imgs[i].loadPixels();
    }
    avgImg.loadPixels();
    lerpFace.loadPixels();

    // Extract face array pixel values
    for (let y = 0; y <= imgs[0].height; y++) {
        for (let x = 0; x <= imgs[0].width; x++) {
            // get pixel x y coordinate index
            let index = (imgs[0].width * y + x) * 4;

            // write red to avgImg pixel
            avgImg.pixels[index + 0] = 255;
            avgImg.pixels[index + 1] = 0;
            avgImg.pixels[index + 2] = 0;
            avgImg.pixels[index + 3] = 255;

            // get total pixel value
            let sumR = 0,
                sumG = 0,
                sumB = 0;
            for (i = 0; i < numOfImages; i++) {
                sumR += imgs[i].pixels[index + 0];
                sumG += imgs[i].pixels[index + 1];
                sumB += imgs[i].pixels[index + 2];
            }

            // write average face pixel value
            avgImg.pixels[index + 0] = sumR / numOfImages;
            avgImg.pixels[index + 1] = sumG / numOfImages;
            avgImg.pixels[index + 2] = sumB / numOfImages;
            avgImg.pixels[index + 3] = 255;

            // write lerped face pixel value
            lerpFace.pixels[index + 0] = lerp(
                imgs[displayImage].pixels[index + 0],
                avgImg.pixels[index + 0],
                lerpValue
            );
            lerpFace.pixels[index + 1] = lerp(
                imgs[displayImage].pixels[index + 1],
                avgImg.pixels[index + 1],
                lerpValue
            );
            lerpFace.pixels[index + 2] = lerp(
                imgs[displayImage].pixels[index + 2],
                avgImg.pixels[index + 2],
                lerpValue
            );
            lerpFace.pixels[index + 3] = lerp(
                imgs[displayImage].pixels[index + 3],
                avgImg.pixels[index + 3],
                lerpValue
            );
        }
    }
    // update images
    avgImg.updatePixels(0, 0, imgs[0].width, imgs[0].height);
    lerpFace.updatePixels(0, 0, imgs[0].width, imgs[0].height);

    // draw lerp face
    translate(imgs[0].width, 0);
    image(lerpFace, 0, 0);

    noLoop();
}

///////////////////////////////
//      Helper Functions     //
///////////////////////////////

function createSliders() {
    // Sliders Container
    sliderDIV = createDiv();
    sliderDIV.style("width", imgs[0].width * 2 + "px");
    sliderDIV.style("height", "50px");
    sliderDIV.style("display", "flex");
    sliderDIV.style("margin", "auto");
    sliderDIV.style("margin-top", "2em");

    // Left Slider
    leftDIV = createDiv();
    leftDIV.style("width", "50%");
    leftDIV.parent(sliderDIV);

    slider1 = createSlider(0, numOfImages - 1, 0);
    slider1.style("width", "250px");
    slider1.style("display", "block");
    slider1.style("margin", "auto");
    slider1.parent(leftDIV);

    // Right Slider
    rightDIV = createDiv();
    rightDIV.style("width", "50%");
    rightDIV.parent(sliderDIV);

    slider2 = createSlider(0, 1, 1, 0);
    slider2.style("width", "250px");
    slider2.style("display", "block");
    slider2.style("margin", "auto");
    slider2.parent(rightDIV);
}

function mouseDragged() {
    // update slider values
    displayImage = slider1.value();
    lerpValue = slider2.value();
    loop();
}
