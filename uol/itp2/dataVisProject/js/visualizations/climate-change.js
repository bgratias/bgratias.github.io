function ClimateChange() {

  // Data Source:
  // GISS Surface Temperature Analysis (GISTEMP), version 4. 
  // NASA Goddard Institute for Space Studies. 
  // Dataset accessed 2022-02-12 at 
  // https://data.giss.nasa.gov/gistemp/.
 
  // ES6 - strict mode helps control the use of undeclared variables
  "use strict";


  
  ////////////////////////
  /// PUBLIC PROPERTIES //
  ////////////////////////

  // Name for visualisation in the menu bar
  this.name = 'Global Warming';
  // Unique ID for visualisation
  this.id = 'climate-change';
  
  

  /////////////////////////
  /// PRIVATE PROPERTIES //
  /////////////////////////

  // dataset
  let data = undefined;
  let loaded = false;
  
  // visualization
  let title = {};
  let subtitle = {};
  let layout = {};
  
  const xAxisLabel = 'Year';
  const yAxisLabel = '°C';
  
  let current = {};
  let drawFrames;
  

  
  /////////////////////
  /// PUBLIC METHODS //
  /////////////////////

  this.preload = function() {
    // called by gallery when a visualisation is added

    const group = {
      name: this.name,
      assets: 1};
    console.group(group.name);
    console.time("Load time");

    data = loadTable(
      'data/surface-temperature/glb.ts-dsst.csv',
      'csv', 
      'header',
      loadSuccess,
      loadFailure);

    // load success callback
    function loadSuccess(){
      group.assets --;
      if(group.assets == 0){
        loaded = true;
        console.log("All " + group.name + " assets loaded successfully.")
      }  
    }

    // load failure callback
    function loadFailure(event){
      console.log(group.name);
      console.log(event);
    }
    
    console.timeEnd("Load time");
    console.groupEnd(group.name);
  };
  

  this.setup = function() {
    // called by gallery when visualisation is SELECTED
    
    // Abort if the data has not loaded successfully
    if (!loaded) {
      console.log('Data not loaded. Abort visualization');
      return;
    }

    noStroke();
    textStyle(NORMAL);
    imageMode(CENTER);
    textAlign(CENTER, CENTER);
    
    // Initialize elements repsonsive to canvas size (default 500)
    textSize(relativeToCanvas(12));

    title = {
      text: "Global Average Temperature",
      colour: theme.green,
      size: relativeToCanvas(24),
    };  
  
    subtitle = {
      text: "Is the climate really changing?",
      colour: theme.blue,
      size: relativeToCanvas(18),
      xPos: 0,
      yPos: relativeToCanvas(30),
    };  
    
    layout = {

      // plot area
      rightMargin: width - relativeToCanvas(5),
      topMargin: relativeToCanvas(60),
      leftMargin: relativeToCanvas(40),
      bottomMargin: height - relativeToCanvas(40),
      
      // axis
      axisColour: theme.white,
      pad: relativeToCanvas(10),
      labelXmargin: relativeToCanvas(30),
      labelYmargin: relativeToCanvas(35),

      plotWidth: () => layout.rightMargin - layout.leftMargin,
      plotHeight: () => layout.bottomMargin - layout.topMargin,
      
      // enable/disable background grid.
      grid: false,
      
      // Number of axis tick labels to draw
      numXTickLabels: 6,
      numYTickLabels: 8,
  
      // pulse dot size
      dotSize: relativeToCanvas(12),
    };

    // Set min and max years:
    data.minYear = min(data.getColumn('Year'));
    data.maxYear = max(data.getColumn('Year'));

    // Find min and max temperature for mapping to canvas height.
    data.minTemperature = min(data.getColumn('J-D'));
    data.maxTemperature = max(data.getColumn('J-D'));

    // Find mean temperature to plot average marker.
    data.meanTemperature = mean(data.getColumn('J-D'));

    // Count the number of frames drawn since the visualisation
    // started so that we can animate the plot.
    drawFrames = 0;
  };


  this.destroy = function() {

    // called by gallery when visualisation is DESELECTED
    imageMode(CORNER);
    textAlign(LEFT, TOP);

  };


  this.draw = function() {

    // First check if we have data
    if (!loaded) {
      console.log('Data not yet loaded');
      return;
    }

    drawTitles(title, subtitle);
    drawPlotBackground(current.temperature);
    renderAxis();
    drawMeanLine();
    drawPlot();
    renderDot();

  };



  //////////////////////
  /// PRIVATE METHODS //
  //////////////////////

  function renderAxis() {

    // Draw x and y axis line
    drawAxis(layout);

    // Draw x and y axis labels
    drawAxisLabels(xAxisLabel, yAxisLabel, layout);

    // Draw all y-axis tick labels.
    drawYAxisTickLabels(
      data.minTemperature,
      data.maxTemperature,
      layout,
      // bind() allows object to borrow methods from another object
      mapTemperatureToHeight.bind(this),
      1);
  
  }


  function drawPlotBackground(temp) {

    noStroke();
    fill(mapTemperatureToColour(temp));
    rect(layout.leftMargin,
      layout.topMargin,
      layout.plotWidth(),
      layout.plotHeight());
  }


  function drawMeanLine() {
    // Plot average line.
    stroke(layout.axisColour);
    strokeWeight(1);
    line(layout.leftMargin,
      mapTemperatureToHeight(data.meanTemperature),
      layout.rightMargin,
      mapTemperatureToHeight(data.meanTemperature));
  }


  function drawPlot() {
    // limit the number of years plotted each frame to create
    // animation effect.
    let yearCount = 0;

    // Plot all temperatures between startYear and endYear 
    let previous;
    const numYears = data.maxYear - data.minYear;
    const xLabelStep = ceil(numYears / layout.numXTickLabels);

    // Loop over all data rows
    for (let i = 0; i < data.getRowCount(); i++) {

      // Pull data for the current year.
      current = {
        // Convert strings to numbers.
        'year': data.getNum(i, 'Year'),
        'temperature': data.getNum(i, 'J-D')
      };
        
      if (previous != null){

        // Draw line segment connecting previous to current year temperature.
        stroke(theme.deepblue);
        line(mapYearToWidth(previous.year),
          mapTemperatureToHeight(previous.temperature),
          mapYearToWidth(current.year),
          mapTemperatureToHeight(current.temperature));

        // Draw the xAxis tick label marking the start of the previous year.
        if (yearCount % xLabelStep == 0) {
          drawXAxisTickLabel(
            previous.year, layout, mapYearToWidth.bind(this));
        }

        // When six or fewer years are displayed also draw the final
        // year x tick label.
        if ((numYears <= 6 && yearCount == numYears - 1)) {
          drawXAxisTickLabel(
            current.year, layout, mapYearToWidth.bind(this));
        }

        yearCount++;

      }

      // Stop looping over data when the number of years drawn is
      // equal to the frame count. 
      if (yearCount >= drawFrames) {
        break;
      }

      // Assign current year to previous year so that it is available
      // during the next iteration of this loop to give us the start
      // position of the next line segment.
      previous = current;      
    }

    // slow the animation
    if(frameCount % 3 == 0){
      // increment the number of frames drawn since visualisation started 
      drawFrames++;
    }

  }


  function renderDot() {
    // map dot to mouse location, but no greater than current draw location
    let dotYear = min(mapWidthToYear(mouseX), current.year);
    let dotTemp;

    if(dotYear){
      const dotRow = data.findRow(dotYear.toString(), 'Year');
      dotTemp = dotRow.getNum('J-D');

      // to change background display color
      current.temperature = dotTemp;
    
    }else{
      // if there is no mouse location, use current draw location
      dotYear = current.year;
      dotTemp = current.temperature;
    }

    const dotXpos = mapYearToWidth(dotYear);
    const dotYpos = mapTemperatureToHeight(dotTemp);

    drawDot(dotXpos, dotYpos, theme.yellow, layout.dotSize);

    if (dotTemp > 0) {dotTemp = "+" + dotTemp};
    const toolTip = dotYear + " " + dotTemp + yAxisLabel;
    drawTooltip(toolTip, dotXpos, dotYpos, layout.dotSize);
  }
  
  
  function mapTemperatureToColour(value=0) {

    const cool = theme.blue;
    const warm = theme.red;

    // create a color between cool and warm based on the temperature
    const lerpValue = map(value, data.minTemperature, data.maxTemperature, 0,1);
    const comboColour = lerpColor(cool, warm, lerpValue);

    return color(comboColour);
  }


  function mapYearToWidth(value=0) {
    return map(
      value,
      data.minYear,
      data.maxYear,
      layout.leftMargin,
      layout.rightMargin);
  }


  function mapWidthToYear(value) {
    // take a point on the plot and return the year for that point on the graph
    if(value > layout.leftMargin && value < layout.rightMargin){
      return floor(map(
        value - layout.leftMargin,
        0,
        layout.plotWidth(),
        data.minYear,
        data.maxYear
        ))
    }else{
      return false;
    }
  }


  function mapTemperatureToHeight(value=0) {
    return map(value,
      data.minTemperature,
      data.maxTemperature,
      layout.bottomMargin, // Lower temperature at bottom.
      layout.topMargin);   // Higher temperature at top.
  }

}