// creates a "pop" effect which grows from a note on the grid
class Popper {
    /////////////////////////////////
    constructor(_xPos, _yPos, _size, _colour) {
        this.x = _xPos;
        this.y = _yPos;
        this.size = _size;
        this.colour = _colour;
        this.alpha = 200;
    }

    /////////////////////////////////
    grow() {
        this.size += 3;
        this.alpha -= 4;
        this.colour.setAlpha(this.alpha);
    }

    /////////////////////////////////
    draw() {
        push();
        noFill();
        strokeWeight(3);
        stroke(this.colour);
        ellipse(this.x, this.y, this.size);
        pop();
    }
}
