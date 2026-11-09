//////////////////////////////////////////////////////////////////
//				    Graphics Programming    					//
//																//
//				  Final Coursework Project 5					//
//					    3D Sin Games 							//
//						December 2022							//
//																//
//////////////////////////////////////////////////////////////////

///////////////////////////////
//   Variable Declarations   //
///////////////////////////////

let boxes = [];

let confLocs = [];
let confTheta = [];

let slider1, slider2, slider3;
let label1, label2, label3;

///////////////////////////////
//  		 SETUP		     //
///////////////////////////////

function setup() {
    createCanvas(900, 800, WEBGL);
    angleMode(DEGREES);
    smooth();
    // Rubric Step 2:
    // normalMaterial();
    stroke(0);
    strokeWeight(2);

    camera = createCamera(800, -600, 800, 0, 0, 0, 0, 1, 0);

    createBoxes(17, 17);
    createConfetti(200);
    createSliders();
}

///////////////////////////////
//  		 DRAW		     //
///////////////////////////////

function draw() {
    // get slider values
    let cameraHeight = slider1.value();
    let cameraDist = slider2.value();
    let annimDivisor = slider3.value() / 10;

    speed = millis() / annimDivisor;

    background(5);
    drawBoxGrid();
    drawConfetti();
    updateConfetti();

    panCamera(cameraHeight, cameraDist);
}

///////////////////////////////
//      Helper Functions     //
///////////////////////////////

function createBoxes(xGrid, zGrid) {
    for (let i = 0; i < xGrid; i++) {
        for (let j = 0; j < zGrid; j++) {
            // create box object with location parameters
            let box = {
                xPos: -400 + j * 50,
                yPos: 0,
                zPos: -400 + i * 50,
                distance: 0,
            };
            // calculate the distance of the box to center
            box.distance = dist(box.xPos, box.yPos, box.zPos, 0, 0, 0);
            boxes.push(box);
        }
    }
}

function createConfetti(confNumber) {
    for (let i = 0; i < confNumber; i++) {
        // select random starting location for confetti
        let x = random(-500, 500);
        let y = random(-800, 0);
        let z = random(-500, 500);

        // create confetti vector
        let confVector = createVector(x, y, z);
        confLocs.push(confVector);

        // select random starting angle
        let theta = random(0, 360);
        confTheta.push(theta);
    }
}

function createLights() {
    pointLight(237, 0, 38, -500, -100, 0);
    pointLight(0, 104, 132, 500, -100, 0);
}

function createSliders() {
    // Camera Height
    label1 = createDiv("Camera Height");
    label1.position(10, 10);
    label1.style("color", "white");
    slider1 = createSlider(0, 1200, 600);
    slider1.position(10, 20);
    slider1.style("width", "150px");
    slider1.parent(label1);

    // Camera distance from center
    label2 = createDiv("Camera Distance");
    label2.position(10, 60);
    label2.style("color", "white");
    slider2 = createSlider(0, 2000, 1000);
    slider2.position(10, 20);
    slider2.style("width", "150px");
    slider2.parent(label2);

    // Annimation speed factor
    label3 = createDiv("Annimation Speed");
    label3.position(10, 110);
    label3.style("color", "white");
    slider3 = createSlider(10, 100, 55);
    slider3.position(10, 20);
    slider3.style("width", "150px");
    slider3.parent(label3);
}

function drawBoxGrid() {
    for (let i = 0; i < boxes.length; i++) {
        push();
        createLights();
        specularMaterial(0, 0, 0);
        translate(boxes[i].xPos, boxes[i].yPos, boxes[i].zPos);
        let length = map(sin(boxes[i].distance + speed), -1, 1, 100, 300);
        box(50, length, 50);
        pop();
    }
}

function drawConfetti() {
    for (let i = 0; i < confLocs.length; i++) {
        push();
        normalMaterial();
        noStroke();
        translate(confLocs[i].x, confLocs[i].y, confLocs[i].z);
        rotateX(confTheta[i]);
        plane(15, 15);
        pop();
    }
}

function updateConfetti() {
    for (let i = 0; i < confLocs.length; i++) {
        // spinning confetti
        confTheta[i] += 10;
        // falling confetti
        confLocs[i].add(0, 3, 0);
        // destroy confetti
        if (confLocs[i].y > 0) {
            confLocs[i].y = -800;
        }
    }
}

function panCamera(upDist, outDist) {
    let x = cos(speed / 12) * outDist;
    let y = -upDist;
    let z = sin(speed / 12) * outDist;

    camera.setPosition(x, y, z);
    camera.lookAt(0, 0, 0);
}
