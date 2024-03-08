function PieChart(x, y, diameter) {
  // https://p5js.org/examples/form-pie-chart.html

  // ES6 - strict mode helps control the use of undeclared variables
  "use strict";



  /////////////////////////
  /// PRIVATE PROPERTIES //
  /////////////////////////

  let angles = [];



  /////////////////////
  /// PUBLIC METHODS //
  /////////////////////

  this.draw = function(data, labels, colours, title, isLegend=false, isDonut=false) {

    testDataIntegrity(data, labels, colours);

    // pull data and convert to arc sections of a circle
    angles = get_radians(data);

    drawPie(data, colours, labels, isLegend);

    if(isDonut){drawDonutHole(0.5)};

    drawTitle(title);

    if(labels){
      if(isLegend){
        drawLegend(labels, colours);
      }else{
        renderLables(angles, labels);
      }
    }
    
    renderTooltip(angles, isDonut);

  };



  //////////////////////
  /// PRIVATE METHODS //
  //////////////////////

  function testDataIntegrity(data, labels, colours){
    // Test that data is not empty and that input arrays are the same length.
    if (data.length == 0) {
      alert('Data has length zero!');
    } else if (![labels, colours].every((array) => {
      return array.length == data.length;
    })) {
      alert(`Data (length: ${data.length})
      Labels (length: ${labels.length})
      Colours (length: ${colours.length})
      Arrays must be the same length!`);
    }
  }


  function get_radians(data) {
    // convert percentages into arc sections of a circle
    const total = sum(data);
    let radians = [];

    for (let i = 0; i < data.length; i++) {
      radians.push((data[i] / total) * TWO_PI);
    }

    return radians;
  }


  function drawPie(data, colours){

    // starting angle at 0
    let lastAngle = 0;
    
    let colour;
    
    // iterate over company dataset
    for (let i = 0; i < data.length; i++) {

      if (colours) {
        // use provided colours
        colour = colours[i];
      } else {
        // or make up greyscale
        colour = map(i, 0, data.length, 0, 255);
      }
      fill(colour);
      stroke(theme.white);
      strokeWeight(1);

      // draw current datapoint arc section
      arc(x, y,
          diameter, diameter,
          lastAngle, lastAngle + angles[i] + 0.001); // Hack for 0!
      
      // remember angle endpoint for next arc startpoint
      lastAngle += angles[i];
    }
  }


  function drawDonutHole(size){

    push();
      fill(theme.deepblue);
      ellipse(x, y, diameter * size);
    pop();
  }


  function drawTitle(title){
    // if there is a title, draw it
    if (title) {
      noStroke();
      textAlign('center', 'center');
      textSize(relativeToCanvas(24));
      text(title, x, y-(diameter*1.4/2));
    }
  }


  function renderLables(angles, labels){
      
    // starting angle at 0
    let lastAngle = 0;

    push();
    translate(x,y);

    // iterate over company angles
    for (let i = 0; i < angles.length; i++) {

      const midAngle = lastAngle + (angles[i] / 2);

      const labelVector = 
        p5.Vector.fromAngle(midAngle, diameter / 2 + relativeToCanvas(5));

      drawLabel(labelVector, labels[i]);

      // remember angle endpoint for next arc startpoint
      lastAngle += angles[i];
    }

    pop();

  }
  
  
  function drawLabel(vector, label){

    // draw leader line
    const leaderStart = {
      x: vector.x,
      y: vector.y
    }
    vector.mult(1.2);
    const leaderEnd = {
      x: vector.x,
      y: vector.y
    }
    stroke(theme.blue);
    line(leaderStart.x, leaderStart.y, leaderEnd.x, leaderEnd.y);
    
    // draw leader extension
    if(vector.heading() > PI/2 || 
    vector.heading() < PI/-2){
      // to the left
      vector.sub(relativeToCanvas(20), 0);
      line(leaderEnd.x, leaderEnd.y, vector.x, vector.y)
      vector.sub(relativeToCanvas(5), 0);
      textAlign(RIGHT, CENTER);
    }else{
      // to the right
      vector.add(relativeToCanvas(20), 0);
      line(leaderEnd.x, leaderEnd.y, vector.x, vector.y)
      vector.add(relativeToCanvas(5), 0);
      textAlign(LEFT, CENTER);
    }

    // draw label
    noStroke(); 
    fill(theme.blue);
    textSize(relativeToCanvas(12));
    text(label, vector.x, vector.y);
  }


  function drawLegend(labels, colours) {

    // legend box size
    const boxWidth = relativeToCanvas(15);
    const boxHeight = relativeToCanvas(15);
    
    noStroke();
    textAlign('left', 'center');
    textSize(relativeToCanvas(12));
    
    for(let i = 0; i < labels.length; i++){

      const legendX = x + relativeToCanvas(40) + diameter / 2;
      const legendY = y + (relativeToCanvas(30) * i) - diameter / 3;

      fill(colours[i]);
      rect(legendX, legendY, boxWidth, boxHeight);

      fill(theme.blue);
      text(
        labels[i], 
        legendX + boxWidth + relativeToCanvas(10), 
        legendY + boxWidth / 2);
    }
  }


  function renderTooltip(angles, isDonut){

    push();
    translate(x,y);
    
    // create a vector for the mouse position
    // adjust for translate which does not affect the mouse coordinates
    const mouseVector = createVector(mouseX - x, mouseY - y);
    
    if(
    // is the mouse inside the circle of the pie
    mouseVector.mag() <= diameter / 2  &&
    // if isDonut, is the mouse outside the donut hole
    (mouseVector.mag() >= (diameter * .5) / 2 || isDonut == false)){
        
      // Get a heading for the mouse position
      let heading = mouseVector.heading();      
      // if the heading is negative we need turn into a positive radian
      if (heading < 0) {heading += TWO_PI};

      let lastAngle = 0;
  
      // iterate over company angles
      // using ES6 forEach method and Arrow function
      angles.forEach(thisAngle => {
        
        // is the mouse on this slice
        if(heading > lastAngle && heading < lastAngle + thisAngle){
  
          const percentage = round(thisAngle / TWO_PI * 100, 1);
          const tooltipText = percentage + "%";

          drawTooltip(tooltipText, mouseVector.x, mouseVector.y);
        }

        // store this angle endpoint for next angle startpoint
        lastAngle += thisAngle;        
      });
    }
    pop();
  }
}
