function RisingSeaLevels() {

  // Source: EPA's Climate Change Indicators in the United States
  // www.epa.gov/climate-indicators
  // Data source: CSIRO, 2017; NOAA, 2021
  // Web update: April 2021

  // ES6 - strict mode helps control the use of undeclared variables
  "use strict";



  ////////////////////////
  /// PUBLIC PROPERTIES //
  ////////////////////////

  // Name for visualisation in the menu bar
  this.name = 'Rising Sea Levels';
  // Unique ID for visualisation
  this.id = 'rising-sea-levels';
  

  
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
  const yAxisLabel = 'Change in Sea Level (inches)';

  let parasol;

  let plotFrames;
  let waterFrames;

  
    
  /////////////////////
  /// PUBLIC METHODS //
  /////////////////////

  this.preload = function() {

    // called by gallery when a visualisation is added

    const group = {
      name: this.name,
      assets: 2};
    console.group(group.name);
    console.time("Load time");


    parasol = loadImage(
      'images/icons/parasol.png', 
      loadSuccess,
      loadFailure);

    data = loadTable(
      '/data/sea-levels/sea-level_fig-1.csv', 
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
    textStyle(NORMAL)
    imageMode(CENTER);
    textAlign(CENTER, CENTER);
    
    // Initialize elements repsonsive to canvas size
    textSize(relativeToCanvas(12));
    
    title = {
      text: "Are sea levels really rising?",
      colour: theme.green,
      size: relativeToCanvas(32),
    };  
  
    subtitle = {
      text: "",
      colour: theme.blue,
      size: relativeToCanvas(18),
      xPos: 0,
      yPos: relativeToCanvas(30),
    };  
    
    layout = {

      // plot area
      rightMargin: width - relativeToCanvas(5),
      topMargin: relativeToCanvas(60),
      leftMargin: relativeToCanvas(45),
      bottomMargin: height - relativeToCanvas(40),
      
      // axis
      axisColour: theme.white,
      pad: relativeToCanvas(10),
      labelXmargin: relativeToCanvas(30),
      labelYmargin: relativeToCanvas(40),

      plotWidth: () => layout.rightMargin - layout.leftMargin,
      plotHeight: () => layout.bottomMargin - layout.topMargin,
      
      // enable/disable background grid.
      grid: false,

      // Number of axis tick labels to draw
      numXTickLabels:  6,
      numYTickLabels:  8,

      // pulse dot size
      dotSize: relativeToCanvas(10),
    };  

    // Set min and max years:
    data.minYear = min(data.getColumn('Year'));
    data.maxYear = max(data.getColumn('Year'));

    // Find min and max temperature for mapping to canvas height.
    data.minSeaRise = min(data.getColumn('adjusted_sea_level'));
    data.maxSeaRise = max(data.getColumn('adjusted_sea_level'));

    // Count the number of frames drawn since the visualisation
    // started so that we can animate the plot.
    plotFrames = 0;
    waterFrames = 0;
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
    drawWaterEffect(layout.plotWidth(), layout.plotHeight());
    renderAxis();
    drawPlot();

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
      data.minSeaRise,
      data.maxSeaRise,
      layout,
      // bind() allows object to borrow methods from another object
      mapSeaRiseToHeight.bind(this),
      1);
  
  };


  function drawPlot() {
    // limit the number of years plotted each frame to create
    // animation effect.
    let yearCount = 0;
    let current = {};
    let previous = {};

    // Plot all seaRises between startYear and endYear 
    const numYears = data.maxYear - data.minYear;
    const xLabelStep = ceil(numYears / layout.numXTickLabels);

    // Loop over all data rows
    for (let i = 0; i < data.getRowCount(); i++) {

      // Pull data for the current year.
      current = {
        year: data.getNum(i, 'Year'),
        seaRise: round(data.getNum(i, 'adjusted_sea_level'),2)
      };
      
      // Nothing to draw if it is the first year
      if (previous.year != null){
        // Draw a polygon connecting previous to current year seaRise
        fill(theme.yellow);
        beginShape();
          vertex(mapYearToWidth(previous.year), layout.topMargin);
          vertex(mapYearToWidth(current.year), layout.topMargin);
          vertex(mapYearToWidth(current.year),mapSeaRiseToHeight(current.seaRise));
          vertex(mapYearToWidth(previous.year),mapSeaRiseToHeight(previous.seaRise));
        endShape();

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

      // when the number of years drawn is equal to the frame count.
      // Fill the entire plot to the right of the current year.
      if (yearCount >= plotFrames) {
        rectMode(CORNERS);
        fill(theme.yellow);
        rect(
          mapYearToWidth(current.year), 
          layout.topMargin, 
          layout.rightMargin,
          mapSeaRiseToHeight(current.seaRise))
        rectMode(CORNER);
        
        // Then break out of the loop
        break;
      }

      // Assign current year to previous year so that it is available
      // during the next iteration of this loop to give us the start
      // position of the next line segment.
      previous = current;  
      
      // If plot is finished, drop a beach umbrella
      if(yearCount + 1 == data.getRowCount()){
        image(
          parasol, 
          layout.leftMargin + layout.plotWidth() * .3,
          layout.topMargin + layout.plotHeight() * .4,
          relativeToCanvas(50),
          relativeToCanvas(50));
      }

    }

    // slow the animation, increment only every 4th frame
    if(frameCount % 2 == 0){
      // increment the number of plotFrames drawn since visualisation started 
      plotFrames++;
    }

    renderDot(current);
  }


  function renderDot(current) {
    // draw dot at mouse position but no greater than the current draw position
    let dotYear = min(mapWidthToYear(mouseX), current.year);
    let dotSeaRise;

    if(dotYear){
      const dotRow = data.findRow(dotYear.toString(), 'Year');
      dotSeaRise = round(dotRow.getNum('adjusted_sea_level'),2);
    }else{
      dotYear = current.year;
      dotSeaRise = current.seaRise;
    }

    const dotXpos = mapYearToWidth(dotYear);
    const dotYpos = mapSeaRiseToHeight(dotSeaRise);
    
    drawDot(dotXpos, dotYpos, theme.red, layout.dotSize);

    if (dotSeaRise > 0) {dotSeaRise = "+" + dotSeaRise};
    const toolTip = dotYear + " " + dotSeaRise + " " + yAxisLabel;
    drawTooltip(toolTip, dotXpos, dotYpos);
  }


  function mapYearToWidth(value=0) {
    return int(map(
      value,
      data.minYear,
      data.maxYear,
      layout.leftMargin,
      layout.rightMargin));
  };


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
  };


  function mapSeaRiseToHeight(value=0) {
    return int(map(value,
      data.minSeaRise,
      data.maxSeaRise,
      layout.bottomMargin, // Lower seaRise at bottom.
      layout.topMargin));   // Higher seaRise at top.
  };


  function drawWaterEffect(plotWidth, plotHeight) {
    
    // Water effect is drawn in a small square and then copied over 
    // the entire plot background area to give it a fuzzy look

    push();

      fill(theme.blue);
    
      // Water Effect formula by ManualDoCodigo
      // https://www.dwitter.net/d/10765

      for(let i = 0; i < int(plotWidth / 7); i++) {
        for(let j = 0; j < int(plotHeight / 7); j++) {
          rect(5 + layout.leftMargin + i,
          5 + layout.topMargin + j, 
          (sin( j * j + i / j - waterFrames * 7) + 
          cos(j ** 5 - i / j * 6 + waterFrames) ** 3) * j / 50, 1);
        }
      }

      copy(
        // copy from
        6 + layout.leftMargin, 
        5 + layout.topMargin, 
        int(plotWidth / 7) - 2, 
        int(plotHeight / 7), 
        // copy to
        layout.leftMargin, 
        layout.topMargin, 
        int(plotWidth),
        int(plotHeight));

      // waterFrames is incremented to animate the water motion
      waterFrames += .008;

    pop();
  
  };

}