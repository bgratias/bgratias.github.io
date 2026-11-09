//////////////////////////////////////////////////////////////////
//				        Graphics Programming    	            //
//								      						    //
//				      Final Coursework Project 7			    //
//					      Instagram Filter   				    //
//						    January 2023	    				//
//														        //
//////////////////////////////////////////////////////////////////

///////////////////////////////
//   Variable Declarations   //
///////////////////////////////

let imgIn;
let chooseFilter = 0;
let isBorder = true;

///////////////////////////////
//  	    PRELOAD		     //
///////////////////////////////

function preload() {
    // Image of Husky, Creative commons from Wikipedia:
    // https://en.wikipedia.org/wiki/Dog#/media/File:Siberian_Husky_pho.jpg
    imgIn = loadImage("assets/husky.jpg");
}

///////////////////////////////
//  	    SETUP		     //
///////////////////////////////

function setup() {
    createCanvas(imgIn.width * 2, imgIn.height);
    imgIn.loadPixels();
    createDOMobjects();
}

///////////////////////////////
//  	    DRAW		     //
///////////////////////////////

function draw() {
    background(125);
    image(imgIn, 0, 0);
    let filterName;

    switch (chooseFilter) {
        case 1:
            image(greyscaleFilter(imgIn, isBorder), imgIn.width, 0);
            filterName = "Greyscale Filter";
            break;
        case 2:
            image(edgeDetectionFilter(imgIn, isBorder), imgIn.width, 0);
            filterName = "Edge Detection Filter";
            break;
        case 3:
            image(inversionFilter(imgIn, isBorder), imgIn.width, 0);
            filterName = "Inversion Filter";
            break;
        default:
            image(earlyBirdFilter(imgIn, isBorder), imgIn.width, 0);
            filterName = "Early Bird Filter";
            break;
    }
    rightDIV.html("<h2>" + filterName + "</h2>");

    noLoop();
}

///////////////////////////////
//           Filters         //
///////////////////////////////

function earlyBirdFilter(img, isBorder) {
    let resultImg;
    let blurMatrix = [
        [1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64],
        [1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64],
        [1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64],
        [1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64],
        [1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64],
        [1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64],
        [1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64],
        [1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64],
    ];
    resultImg = sepiaFilter(img);
    resultImg = darkCorners(resultImg);
    resultImg = radialBlurFilter(resultImg, blurMatrix);
    if (isBorder) resultImg = borderFilter(resultImg);

    return resultImg;
}

function greyscaleFilter(img, isBorder) {
    let resultImg;
    let blurMatrix = [
        [1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64],
        [1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64],
        [1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64],
        [1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64],
        [1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64],
        [1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64],
        [1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64],
        [1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64],
    ];
    resultImg = greyFilter(img);
    resultImg = darkCorners(resultImg);
    resultImg = radialBlurFilter(resultImg, blurMatrix);
    if (isBorder) resultImg = borderFilter(resultImg);

    return resultImg;
}

function edgeDetectionFilter(img, isBorder) {
    let resultImg;
    let xMatrix = [
        [-1, -2, -1],
        [0, 0, 0],
        [1, 2, 1],
    ];
    let yMatrix = [
        [-1, 0, 1],
        [-2, 0, 2],
        [-1, 0, 1],
    ];
    resultImg = greyFilter(img);
    resultImg = edgeDetection(resultImg, xMatrix, yMatrix);
    if (isBorder) resultImg = borderFilter(resultImg);

    return resultImg;
}

function inversionFilter(img, isBorder) {
    let resultImg;

    resultImg = invertFilter(img);
    if (isBorder) resultImg = borderFilter(resultImg);

    return resultImg;
}

///////////////////////////////
//      Filter Components    //
///////////////////////////////

function sepiaFilter(img) {
    // initialize output image
    let imgOut = createImage(img.width, img.height);
    imgOut.loadPixels();

    // read every pixel
    for (let x = 0; x < img.width; x++) {
        for (let y = 0; y < img.height; y++) {
            // calculate pixel index in the pixel array
            let index = (x + y * img.width) * 4;

            // read pixel values
            let r = img.pixels[index + 0];
            let g = img.pixels[index + 1];
            let b = img.pixels[index + 2];
            let a = img.pixels[index + 3];

            // store adjusted values to pixel
            imgOut.pixels[index + 0] = r * 0.393 + g * 0.769 + b * 0.189;
            imgOut.pixels[index + 1] = r * 0.349 + g * 0.686 + b * 0.168;
            imgOut.pixels[index + 2] = r * 0.272 + g * 0.534 + b * 0.131;
            imgOut.pixels[index + 3] = a;
        }
    }
    // update image with changed pixel array
    imgOut.updatePixels();

    return imgOut;
}

function darkCorners(img) {
    // initialize output image
    let imgOut = createImage(img.width, img.height);
    imgOut.loadPixels();

    // read every pixel
    for (let x = 0; x < img.width; x++) {
        for (let y = 0; y < img.height; y++) {
            // calc pixel distance to image center
            let distFromCenter = dist(x, y, img.width / 2, img.height / 2);
            let maxDist = dist(0, 0, img.width / 2, img.height / 2);

            // adjust luminance based on distance
            let dynLum = 1;
            if (distFromCenter >= 450) {
                distFromCenter = constrain(distFromCenter, 450, maxDist);
                dynLum = map(distFromCenter, 450, maxDist, 0.4, 0);
            } else if (distFromCenter >= 300) {
                distFromCenter = constrain(distFromCenter, 300, 450);
                dynLum = map(distFromCenter, 300, 450, 1, 0.4);
            }

            // calculate pixel index in the pixel array
            let index = (x + y * img.width) * 4;

            // read pixel values
            let r = img.pixels[index + 0];
            let g = img.pixels[index + 1];
            let b = img.pixels[index + 2];
            let a = img.pixels[index + 3];

            // store adjusted values to pixel array
            imgOut.pixels[index + 0] = r * dynLum;
            imgOut.pixels[index + 1] = g * dynLum;
            imgOut.pixels[index + 2] = b * dynLum;
            imgOut.pixels[index + 3] = a;
        }
    }
    // update image with changed pixel array
    imgOut.updatePixels();

    return imgOut;
}

function radialBlurFilter(img, matrix) {
    // initialize output image
    let imgOut = createImage(img.width, img.height);
    imgOut.loadPixels();

    // read every pixel
    for (let x = 0; x < img.width; x++) {
        for (let y = 0; y < img.height; y++) {
            // calculate distance of pixel to mouse
            let distFromMouse = dist(x, y, mouseX, mouseY);

            // adjust blur based on distance
            distFromMouse = constrain(distFromMouse, 100, 300);
            dynBlur = map(distFromMouse, 100, 300, 0, 1);

            // run the pixel thru convolution
            let c = convolution(x, y, matrix, img);

            // caculate pixel index in the pixel array
            let index = (x + y * img.width) * 4;

            // read pixel values from pixel array
            let r = img.pixels[index + 0];
            let g = img.pixels[index + 1];
            let b = img.pixels[index + 2];
            let a = img.pixels[index + 3];

            // apply convolution results to pixel array
            imgOut.pixels[index + 0] = c[0] * dynBlur + r * (1 - dynBlur);
            imgOut.pixels[index + 1] = c[1] * dynBlur + g * (1 - dynBlur);
            imgOut.pixels[index + 2] = c[2] * dynBlur + b * (1 - dynBlur);
            imgOut.pixels[index + 3] = a;
        }
    }
    // update image with changed pixel array
    imgOut.updatePixels();

    return imgOut;
}

function borderFilter(img) {
    let border = {
        width: 20,
        radius: 50,
        colour: color(255, 255, 255, 255),
    };

    // create buffer with image
    let buffer = createGraphics(img.width, img.height);
    buffer.image(img, 0, 0);

    // add border
    buffer.noFill();
    buffer.stroke(border.colour);
    buffer.strokeWeight(border.width);
    // round inside corners
    buffer.rect(
        border.width / 2,
        border.width / 2,
        img.width - border.width,
        img.height - border.width,
        border.radius
    );
    // square outside corners
    buffer.rect(
        border.width / 2,
        border.width / 2,
        img.width - border.width,
        img.height - border.width
    );

    return buffer;
}

function greyFilter(img) {
    // initialize output image
    let imgOut = createImage(img.width, img.height);
    imgOut.loadPixels();

    // read every pixel
    for (let x = 0; x < img.width; x++) {
        for (let y = 0; y < img.height; y++) {
            // calculate pixel index in the pixel array
            let index = (x + y * img.width) * 4;

            // read pixel values
            let r = img.pixels[index + 0];
            let g = img.pixels[index + 1];
            let b = img.pixels[index + 2];
            let a = img.pixels[index + 3];
            let grey = r * 0.299 + g * 0.587 + b * 0.114;

            // store adjusted values to pixel
            imgOut.pixels[index + 0] = grey;
            imgOut.pixels[index + 1] = grey;
            imgOut.pixels[index + 2] = grey;
            imgOut.pixels[index + 3] = a;
        }
    }
    // update image with changed pixel array
    imgOut.updatePixels();

    return imgOut;
}

function edgeDetection(img, xMatrix, yMatrix) {
    // initialize output image
    let imgOut = createImage(img.width, img.height);
    imgOut.loadPixels();

    let matrixMaxValue = (1 + 2 + 1) * 255;

    // read every pixel
    for (let x = 0; x < img.width; x++) {
        for (let y = 0; y < img.height; y++) {
            // caculate pixel index in the pixel array
            let index = (img.width * y + x) * 4;

            // run the pixel thru convolutions
            let cX = convolution(x, y, xMatrix, img);
            let cY = convolution(x, y, yMatrix, img);

            // turn convolution value into pixel value
            cX = map(abs(cX[0]), 0, matrixMaxValue, 0, 255);
            cY = map(abs(cY[0]), 0, matrixMaxValue, 0, 255);
            let combinedValue = cX + cY;

            // apply convolution results to pixel array
            imgOut.pixels[index + 0] = combinedValue;
            imgOut.pixels[index + 1] = combinedValue;
            imgOut.pixels[index + 2] = combinedValue;
            imgOut.pixels[index + 3] = 255;
        }
    }
    // update image with changed pixel array
    imgOut.updatePixels();

    return imgOut;
}

function invertFilter(img) {
    // initialize output image
    let imgOut = createImage(img.width, img.height);
    imgOut.loadPixels();

    // read every pixel
    for (let x = 0; x < img.width; x++) {
        for (let y = 0; y < img.height; y++) {
            // calculate pixel index in the pixel array
            let index = (x + y * img.width) * 4;

            // read pixel values
            let r = img.pixels[index + 0];
            let g = img.pixels[index + 1];
            let b = img.pixels[index + 2];
            let a = img.pixels[index + 3];

            // store adjusted values to pixel
            imgOut.pixels[index + 0] = 255 - r;
            imgOut.pixels[index + 1] = 255 - g;
            imgOut.pixels[index + 2] = 255 - b;
            imgOut.pixels[index + 3] = a;
        }
    }
    // update image with changed pixel array
    imgOut.updatePixels();

    return imgOut;
}

///////////////////////////////
//      Helper Functions     //
///////////////////////////////

function mousePressed() {
    loop();
}

function keyPressed() {
    if (key == "b" || key == "B") {
        isBorder = !isBorder;
    } else {
        chooseFilter++;
        if (chooseFilter > 3) chooseFilter = 0;
    }

    loop();
}

function convolution(x, y, matrix, img) {
    let totalRed = 0.0;
    let totalGreen = 0.0;
    let totalBlue = 0.0;

    let offset = floor(matrix.length / 2);

    // convolution matrix loop
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[0].length; j++) {
            // Get pixel loc within convolution matrix
            let xloc = x + i - offset;
            let yloc = y + j - offset;
            let index = (img.width * yloc + xloc) * 4;

            // ensure we don't address a pixel that doesn't exist
            index = constrain(index, 0, img.pixels.length - 4);

            // multiply all values with the mask and sum up
            totalRed += img.pixels[index + 0] * matrix[i][j];
            totalGreen += img.pixels[index + 1] * matrix[i][j];
            totalBlue += img.pixels[index + 2] * matrix[i][j];
        }
    }
    // return the new pixel color
    return [totalRed, totalGreen, totalBlue];
}

function createDOMobjects() {
    // Container
    containerDiv = createDiv();
    containerDiv.style("width", imgIn.width * 2 + "px");
    containerDiv.style("height", "10em");
    containerDiv.style("display", "flex");
    containerDiv.style("margin", "auto");
    containerDiv.style("margin-top", "2em");

    // Left Image
    leftDIV = createDiv();
    leftDIV.style("width", "50%");
    leftDIV.style("color", "white");
    leftDIV.style("text-align", "CENTER");
    leftDIV.style("font-size", "1.5em");
    leftDIV.parent(containerDiv);
    leftDIV.html(
        "<H3>Press any key to change filter</H3><p>Press 'B' to toggle border<p>"
    );

    // Right Image
    rightDIV = createDiv();
    rightDIV.style("width", "50%");
    rightDIV.style("color", "white");
    rightDIV.style("text-align", "CENTER");
    rightDIV.style("font-size", "1.5em");
    rightDIV.parent(containerDiv);
}
