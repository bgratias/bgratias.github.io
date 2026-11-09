class Spaceship {
    constructor() {
        this.size = 50;
        this.location = new createVector(width / 2, height / 2);
        this.acceleration = new createVector(0, 0);
        this.velocity = new createVector(0, 0);
        this.maxVelocity = 8;
        this.bulletSys = new BulletSystem();
        this.flames = []; // array of flame particles
    }

    run() {
        this.bulletSys.run();
        this.move();
        this.drawFlames();
        this.draw();
        this.edges();
        this.interaction();
    }

    draw() {
        image(
            spaceshipImg,
            this.location.x,
            this.location.y,
            this.size * 0.8,
            this.size
        );
    }

    move() {
        // apply acceleration to spaceship velocity
        this.velocity.add(this.acceleration);

        // limit spaceship velocity to maxVelocity
        if (this.velocity.mag() > this.maxVelocity)
            this.velocity.setMag(this.maxVelocity);

        // apply velocity to change spaceship location
        this.location.add(this.velocity);

        // reset acceleration to zero for next draw cycle
        this.acceleration.mult(0);
    }

    applyForce(f) {
        this.acceleration.add(f);
    }

    interaction() {
        if (keyIsDown(LEFT_ARROW)) {
            this.thrust(+1, 0);
            this.applyForce(createVector(-0.1, 0));
        }
        if (keyIsDown(RIGHT_ARROW)) {
            this.thrust(-1, 0);
            this.applyForce(createVector(+0.1, 0));
        }
        if (keyIsDown(UP_ARROW)) {
            this.thrust(0, +1);
            this.applyForce(createVector(0, -0.1));
        }
        if (keyIsDown(DOWN_ARROW)) {
            this.thrust(0, -1);
            this.applyForce(createVector(0, +0.1));
        }
    }

    fire() {
        this.bulletSys.fire(this.location.x, this.location.y);
    }

    edges() {
        // handle moving left to right past screen edges
        if (this.location.x < this.size / -2)
            this.location.x = width + this.size / 2;
        else if (this.location.x > width + this.size / 2)
            this.location.x = this.size / -2;
        // restrict moving past top edge of screen
        else if (this.location.y < 0) {
            this.location.y = 0;
            this.velocity.y = 0;
        }
    }

    setNearEarth() {
        // add overheating effect in atmosphere
        push();
        noFill();
        stroke(255, 0, 0);
        strokeWeight(2);
        triangle(
            this.location.x - this.size * 0.4,
            this.location.y + this.size * 0.4,
            this.location.x + this.size * 0.4,
            this.location.y + this.size * 0.4,
            this.location.x,
            this.location.y - this.size / 2
        );
        pop();

        // apply gravitational pull
        let gravity = new createVector(0, 0.05);
        this.applyForce(gravity);

        // apply atmospheric friction
        let friction = this.velocity.copy();
        friction.div(30);
        friction.mult(-1);
        this.applyForce(friction);
    }

    thrust(x, y) {
        // add flame particles to array
        for (let i = 0; i < 4; i++) {
            this.flames.push(
                new Particle(this.location.x, this.location.y, x, y, 10, 18)
            );
        }
    }

    drawFlames() {
        // draw flame particles
        for (let i = this.flames.length - 1; i >= 0; i--) {
            this.flames[i].render(this.velocity);
            if (this.flames[i].age <= 0) this.flames.splice(i, 1);
        }
    }
}
