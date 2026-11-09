class BulletSystem {
    constructor() {
        this.bullets = [];
        this.velocity = new createVector(0, -5);
        this.diam = 10;
    }

    run() {
        this.move();
        this.draw();
        this.edges();
    }

    fire(x, y) {
        // add a new bullet to the array
        this.bullets.push(createVector(x, y));
    }

    //draw all bullets
    draw() {
        fill(255);
        for (var i = 0; i < this.bullets.length; i++) {
            ellipse(this.bullets[i].x, this.bullets[i].y, this.diam, this.diam);
        }
    }

    //update the location of all bullets
    move() {
        for (var i = 0; i < this.bullets.length; i++) {
            this.bullets[i].y += this.velocity.y;
        }
    }

    //check if bullets left the screen and remove them from the array
    edges() {
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            if (this.bullets[i].y < -5) {
                this.destroy(i);
            }
        }
    }

    //destroy all data associated with each bullet
    destroy(index) {
        this.bullets.splice(index, 1);
    }
}
