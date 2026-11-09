class Particle {
    constructor(locX, locY, headingX, headingY, ejection, decay) {
        // set particle starting age and rate of decay
        this.age = 255;
        this.decayRate = decay;

        // particle starting location
        this.dotLoc = new createVector(locX, locY);

        // particle starting velocity
        this.dotVel = new createVector(
            headingX * ejection + random(-2, 2),
            headingY * ejection + random(-2, 2)
        );

        // add random magnitude to starting velocity
        this.dotVel.setMag(random(0, ejection));

        // create a randomized flame colour
        this.dotColour = color(random(200, 255), random(180), random(0));
    }

    render(originVelocity) {
        this.move(originVelocity);
        this.draw();
    }

    move(originVelocity) {
        // add velocity
        // and add velocity of particle emmitter
        this.dotLoc.add(this.dotVel).add(originVelocity);

        // reduce age by the rate of decay
        this.age -= this.decayRate;

        // set an alpha value based on particle age
        this.dotColour.setAlpha(this.age);
    }

    draw() {
        push();
        strokeWeight(8);
        stroke(this.dotColour);
        point(this.dotLoc.x, this.dotLoc.y);
        pop();
    }
}
