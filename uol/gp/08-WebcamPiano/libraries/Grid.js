// Creates a grid of "notes" which can be activated
class Grid {
    /////////////////////////////////
    constructor(_w, _h) {
        this.gridWidth = _w;
        this.gridHeight = _h;
        this.noteSize = 40;
        this.notePos = [];
        this.noteState = [];

        // initalise grid structure and state
        for (let x = 0; x < _w; x += this.noteSize) {
            let posColumn = [];
            let stateColumn = [];
            for (let y = 0; y < _h; y += this.noteSize) {
                posColumn.push(
                    createVector(x + this.noteSize / 2, y + this.noteSize / 2)
                );
                stateColumn.push(0);
            }
            this.notePos.push(posColumn);
            this.noteState.push(stateColumn);
        }
    }

    /////////////////////////////////
    run(img) {
        img.loadPixels();
        this.findActiveNotes(img);
        this.drawActiveNotes(img);
    }

    /////////////////////////////////
    drawActiveNotes(img) {
        // iterate over all notes
        for (let i = 0; i < this.notePos.length; i++) {
            for (let j = 0; j < this.notePos[i].length; j++) {
                // draw note only if noteState is active
                if (this.noteState[i][j] > 0) {
                    let x = this.notePos[i][j].x;
                    let y = this.notePos[i][j].y;

                    // draw a circle or square based on noteState
                    fill(this.getMixedColour(i, j));
                    let s = this.noteState[i][j];
                    switch (s) {
                        case 1:
                            rect(x, y, this.noteSize * s - 2);
                            break;
                        default:
                            ellipse(x, y, this.noteSize * s);
                            break;
                    }
                }

                // incrmentally decrease noteState to 0
                this.noteState[i][j] -= 0.05;
                this.noteState[i][j] = constrain(this.noteState[i][j], 0, 1);
            }
        }
    }

    /////////////////////////////////
    // determine which notes to activate based on screen location
    findActiveNotes(img) {
        for (let x = 0; x < img.width; x += 1) {
            for (let y = 0; y < img.height; y += 1) {
                let index = (x + y * img.width) * 4;

                // if pixel is black (ie there is movement)
                let state = img.pixels[index + 0];
                if (state == 0) {
                    // find x and y pos of the note grid to activate
                    let screenX = map(x, 0, img.width, 0, this.gridWidth);
                    let screenY = map(y, 0, img.height, 0, this.gridHeight);
                    let i = int(screenX / this.noteSize);
                    let j = int(screenY / this.noteSize);

                    // activate the noteState at the correct grid position
                    this.noteState[i][j] = 1;

                    // randomly produce popper effect
                    this.randomPopper(i, j, 0.00009);
                }
            }
        }
    }

    //////////////////////////////////
    // determine a colour based on position in the grid
    getMixedColour(x, y) {
        // slowly move colours thru the colour wheel
        let cycle = int((millis() / 40) % 300);
        let alpha = this.noteState[x][y] * 200;
        let c1 = color(cycle, 100, 100, alpha);
        let c2 = color(cycle + 60, 100, 100, alpha);
        return lerpColor(c1, c2, map(x, 0, this.notePos.length, 0, 1));
    }

    //////////////////////////////////
    // randomly add a "pop" effect at an activated note location
    randomPopper(i, j, randomFactor) {
        if (random() < randomFactor) {
            let xPos = this.notePos[i][j].x;
            let yPos = this.notePos[i][j].y;
            let colour = this.getMixedColour(i, j);

            let popper = new Popper(xPos, yPos, this.noteSize, colour);
            pops.push(popper);
        }
    }
}
