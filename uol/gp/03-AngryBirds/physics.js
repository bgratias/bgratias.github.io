////////////////////////////////////////////////////////////////
function setupGround() {
    // define the ground object
    ground = Bodies.rectangle(500, 600, 1000, 40, {
        isStatic: true,
        angle: 0,
    });
    // add the ground to the world
    World.add(engine.world, [ground]);
}
////////////////////////////////////////////////////////////////
function drawGround() {
    push();
    fill(128);
    drawVertices(ground.vertices);
    pop();
}
////////////////////////////////////////////////////////////////
function setupPropeller() {
    // define the propeller object
    propeller = Bodies.rectangle(150, 480, 200, 15, {
        isStatic: true,
        angle: angle,
    });
    // Add the propeller to the world
    World.add(engine.world, [propeller]);
}
////////////////////////////////////////////////////////////////
//updates and draws the propeller
function drawPropeller() {
    // calculate the propeller angle and velocity
    angle += angleSpeed;
    Body.setAngle(propeller, angle);
    Body.setAngularVelocity(propeller, angleSpeed);

    // draw the propeller
    push();
    fill(255);
    drawVertices(propeller.vertices);
    pop();
}
////////////////////////////////////////////////////////////////
function setupBird() {
    // create a new bird object
    var bird = Bodies.circle(mouseX, mouseY, 20, {
        friction: 0,
        restitution: 0.95,
    });
    Matter.Body.setMass(bird, bird.mass * 10);
    // add the bird to the world
    World.add(engine.world, [bird]);
    // add the bird to the array
    birds.push(bird);
}
////////////////////////////////////////////////////////////////
function drawBirds() {
    for (i = 0; i < birds.length; i++) {
        // draw each bird in the array
        push();
        fill(255, 0, 0);
        drawVertices(birds[i].vertices);
        pop();
        // check if the bird has left the screen
        if (isOffScreen(birds[i])) {
            // remove from the world
            removeFromWorld(birds[i]);
            // remove from the array
            birds.splice(i, 1);
            i--;
        }
    }
}
////////////////////////////////////////////////////////////////
//creates a tower of boxes
function setupTower() {
    // set box tower parameters
    let startlocX = 600,
        startlocY = -100;
    let boxesHigh = 6,
        boxesWide = 3;
    let boxDim = 80;
    let boxSpace = 10;

    // Create the stack of boxes
    boxes = Matter.Composites.stack(
        startlocX,
        startlocY,
        boxesWide,
        boxesHigh,
        boxSpace,
        boxSpace,
        function (x, y) {
            // Create a color for the body
            colors.push(color(0, random(50, 200), 0));
            // Create the body to be stacked
            return Bodies.rectangle(x, y, boxDim, boxDim, {
                restitution: 0.4,
                frictionAir: 0,
            });
        }
    );

    // add the stack of bodies to the world
    World.add(engine.world, boxes);
}
////////////////////////////////////////////////////////////////
//draw tower of boxes
function drawTower() {
    // draw all bodies in the stack
    push();
    for (i = 0; i < boxes.bodies.length; i++) {
        fill(colors[i]);
        drawVertices(boxes.bodies[i].vertices);
        // check if the box is off screen
        if (isOffScreen(boxes.bodies[i])) {
            // remove it from the world
            removeFromWorld(boxes.bodies[i]);
            // remove it from the array
            boxes.bodies.splice(i, 1);
            colors.splice(i, 1);
            i--;
        }
    }
    pop();
}
////////////////////////////////////////////////////////////////
function setupSlingshot() {
    // create the slingshot bird
    slingshotBird = Bodies.circle(200, 200, 20, {
        friction: 0,
        restitution: 0.95,
    });
    Body.setMass(slingshotBird, slingshotBird.mass * 10);

    // add a slingshot constraint
    slingshotConstraint = Constraint.create({
        pointA: { x: 200, y: 200 },
        bodyB: slingshotBird,
        pointB: { x: 0, y: 0 },
        stiffness: 0.01,
        damping: 0.0001,
        length: 20,
    });

    // Add both the bird and the constraint to the world
    World.add(engine.world, [slingshotBird, slingshotConstraint]);
}
////////////////////////////////////////////////////////////////
//draws slingshot bird and its constraint
function drawSlingshot() {
    push();
    fill(255, 127, 0);
    drawVertices(slingshotBird.vertices);
    drawConstraint(slingshotConstraint);
    pop();
}
/////////////////////////////////////////////////////////////////
function setupMouseInteraction() {
    // add a mouse constraint
    var mouse = Mouse.create(canvas.elt);
    var mouseParams = {
        mouse: mouse,
        constraint: { stiffness: 0.05 },
    };
    mouseConstraint = MouseConstraint.create(engine, mouseParams);

    // adjust for apple retina screen pixel ratio
    mouseConstraint.mouse.pixelRatio = pixelDensity();

    // add mouse constraint to the world
    World.add(engine.world, mouseConstraint);
}
