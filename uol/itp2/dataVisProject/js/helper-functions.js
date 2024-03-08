///////////////////////////////////
/// PUBLIC MATH HELPER FUNCTIONS //
///////////////////////////////////

// ES6 - strict mode helps control the use of undeclared variables
"use strict";



function sum(data) {
  let total = 0;

  // Ensure that data contains numbers and not strings.
  data = stringsToNumbers(data);

  for (let i = 0; i < data.length; i++) {
    total = total + data[i];
  }

  return total;
}


function mean(data) {
  const total = sum(data);

  return total / data.length;
}


function sliceRowNumbers(row, start=0, end) {
  let rowData = [];

  // if end range is not received then set to row length
  if (!end) {
    // Parse all values until the end of the row.
    end = row.arr.length;
  }

  for (let i = start; i < end; i++) {
    rowData.push(row.getNum(i));
  }

  // returns an array containing row numbers in the range
  return rowData;
}


function stringsToNumbers(array) {
  // converts "123" to 123
  return array.map(Number);
}


function relativeToCanvas(points) {
  // calculate the size of elements relative to the size of the canvas
  const standardWidth = 500;
  const relativeSize = int(points/standardWidth * width);
  return relativeSize;
}



  ///////////////////////////////////
  /// PUBLIC PLOT HELPER FUNCTIONS //
  ///////////////////////////////////


function drawAxis(layout) {
  stroke(layout.axisColour);

  // x-axis
  line(layout.leftMargin,
       layout.bottomMargin,
       layout.rightMargin,
       layout.bottomMargin);

  // y-axis
  line(layout.leftMargin,
       layout.topMargin,
       layout.leftMargin,
       layout.bottomMargin);
}


function drawAxisLabels(xLabel, yLabel, layout) {
  noStroke();
  fill(layout.axisColour);
  textAlign('center', 'center');

  // Draw x-axis label.
  text(xLabel,
       (layout.plotWidth() / 2) + layout.leftMargin,
       layout.bottomMargin + layout.labelXmargin);

  // Draw y-axis label.
  push();
    translate(layout.leftMargin - layout.labelYmargin,
              layout.topMargin + (layout.plotHeight() / 2));
    rotate(- PI / 2);
    text(yLabel, 0, 0);
  pop();
}


function drawYAxisTickLabels(min, max, layout, mapFunction, decimalPlaces) {
  // Map function must be passed with .bind(this).
  // bind() allows object to borrow methods from another object

  noStroke();
  fill(layout.axisColour);
  textAlign('right', 'center');

  const range = max - min;
  const yTickStep = range / layout.numYTickLabels;

  // Draw all axis tick labels and grid lines.
  for (let i = 0; i <= layout.numYTickLabels; i++) {
    const value = min + (i * yTickStep);
    const y = mapFunction(value);

    // Add tick label.
    // toFixed() - converts number to string with fixed decimal places
    text(value.toFixed(decimalPlaces),
         layout.leftMargin - layout.pad,
         y);

    if (layout.grid) {
      // Add grid line.
      stroke(layout.axisColour);
      line(layout.leftMargin, y, layout.rightMargin, y);
    }
  }
}


function drawXAxisTickLabel(value, layout, mapFunction) {
  // Map function must be passed with .bind(this).
  // bind() allows object to borrow methods from another object
  
  noStroke();
  fill(layout.axisColour);
  textAlign('center', 'center');
  
  const x = mapFunction(value);

  // Add tick label.
  text(value,
       x,
       layout.bottomMargin + layout.pad);

  if (layout.grid) {
    // Add grid line.
    stroke(layout.axisColour);
    line(x, layout.topMargin, x, layout.bottomMargin);
  }
}


function drawTitles(title, subtitle) {
  push();
    noStroke();
    textWrap(WORD);
    textAlign(LEFT, TOP);
    
    textSize(title.size);
    fill(title.colour);    
    text(title.text, 0, 0, width);
    
    if(subtitle.text != ""){
      textSize(subtitle.size);
      fill(subtitle.colour);
      text(subtitle.text, subtitle.xPos, subtitle.yPos, width);
    }
  pop();
}


function drawTooltip(tooltipText, xPos, yPos) {

  const tooltip = {
    text: tooltipText,
    size: relativeToCanvas(12),
    pad: relativeToCanvas(3),
    offset: relativeToCanvas(8),
    foregroundColour: theme.deepblue,
    backgroundColour: theme.white
  };

  textSize(tooltip.size);
  tooltip.width = textWidth(tooltipText);

  verifyOnCanvas();
  draw();

  function verifyOnCanvas() {
  // adjust tooltip postion if outside the canvas area

    if(xPos + tooltip.width/2 > width){
      xPos -= tooltip.width/2;
    }
    if(xPos - tooltip.width/2 < 0){
      xPos += tooltip.width/2;
    }

    // using ES6 Ternary operator
    yPos = (yPos - tooltip.offset < 0 + textSize) ? 
      yPos + tooltip.offset : yPos - tooltip.offset;
  }

  function draw() {
    push();
      noStroke();
      fill(tooltip.backgroundColour);
      rectMode(CENTER)
      rect(
        xPos, 
        yPos - tooltip.offset, 
        tooltip.width + tooltip.pad, 
        textSize() + tooltip.pad,
        tooltip.pad);

      fill(tooltip.foregroundColour);
      textStyle(BOLD);
      textAlign(CENTER, CENTER);
      text(tooltip.text, xPos, yPos - tooltip.offset);
    pop();
  }

}


function drawDot(xPos, yPos, colour, maxSize) {
  // Use sine Function to make a pulsating dot
  const pulse = abs(sin(millis()/500) * maxSize);
  
  push();
    noStroke();
    fill(colour);
    ellipse(xPos, yPos, pulse);
  pop();
}