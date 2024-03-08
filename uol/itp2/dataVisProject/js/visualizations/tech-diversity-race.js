function TechDiversityRace() {

  // ES6 - strict mode helps control the use of undeclared variables
  "use strict";



  ////////////////////////
  /// PUBLIC PROPERTIES //
  ////////////////////////

  // Name for visualisation in the menu bar
  this.name = 'Racial Diversity in Tech';
  // Unique ID for visualisation
  this.id = 'tech-diversity-race';
  
  

  /////////////////////////
  /// PRIVATE PROPERTIES //
  /////////////////////////

  // dataset
  let data = {};
  let loaded = false;

  // DOM Elements
  let selectBox;

  // visualization
  let title = {};
  let subtitle = {};
  let layout = {};
  let logos = {};
  
  let pie = undefined;


  
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
      '/data/tech-diversity/race-2018.csv',
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

    loadLogos();

    noStroke();
    textStyle(NORMAL)
    imageMode(CENTER);
    textAlign(RIGHT, CENTER);
    
    // Initialize elements repsonsive to canvas size
    textSize(relativeToCanvas(12));

    title = {
      text: "How Diverse is Race in the Largest Technology Companies?",
      colour: theme.green,
      size: relativeToCanvas(24),
    };

    subtitle = {
      text: "",
      colour: theme.blue,
      size: relativeToCanvas(18),
      xPos: 0,
      yPos: relativeToCanvas(75),
    };
    
    layout = {

      // plot area
      rightMargin: width,
      topMargin: relativeToCanvas(100),
      leftMargin: 0,
      bottomMargin: height,

      // axis
      axisColour: theme.green,
      pad: relativeToCanvas(18),
      labelXmargin: relativeToCanvas(30),
      labelYmargin: relativeToCanvas(40),

      plotWidth: () => layout.rightMargin - layout.leftMargin,
      plotHeight: () => layout.bottomMargin - layout.topMargin,
      
      // Boolean to enable/disable background grid.
      grid: false,
      
      // Number of axis tick labels to draw
      numXTickLabels: 10,
      numYTickLabels: 8,

      colours: 
        [theme.blue, theme.red, theme.green, 'pink', theme.purple, theme.yellow],

    };

    // create a pieChart object
    pie = new PieChart(
      width / 2, 
      layout.topMargin + (layout.plotHeight() / 2), 
      width * 0.6,);

    addSelectionBox();

    data.labels = data.getColumn(0);

  };


  this.destroy = function() {

    // called by gallery when visualisation is DESELECTED
    imageMode(CORNER);
    textAlign(LEFT, TOP);
    selectBox.remove();
  
  };


  this.draw = function() {

    // First check if we have data
    if (!loaded) {
      console.log('Data not loaded. Abort visualization');
      return;
    }

    // Get company from the selectBox
    const companyName = selectBox.value();

    drawTitles(title, subtitle);
    renderPie(companyName);

    image(
      logos[companyName], 
      width/2, 
      layout.topMargin + layout.plotHeight()/2, 
      relativeToCanvas(80),
      relativeToCanvas(80)
      );

  };



  //////////////////////
  /// PRIVATE METHODS //
  //////////////////////

  function addSelectionBox() {

    // If a selectBox already exists, remove it (ie. screen resize)
    if(selectBox){
      selectBox.remove();
    }

    // create a new selectBox
    selectBox = createSelect();

    // Populate options with company names.
    let companies = data.columns;
    // start at 1 because first column is empty.
    for (let i = 1; i < companies.length; i++) {
      selectBox.option(companies[i]);
    }
    
    // Position the selectBox on the page
    selectBox.size(AUTO, AUTO);
    selectBox.parent('app');
    selectBox.position(
      (width / 2) - (selectBox.size().width / 2), 
      subtitle.yPos);
    let fontSize = relativeToCanvas(100);
    selectBox.style('font-size',fontSize +'%');
    
  }


  function renderPie(companyName) {

    // Pull all data for company
    let col = data.getColumn(companyName);
    col = stringsToNumbers(col);

    // Draw the pie chart!
    const plotTitle = "";
    const isLegend = false;
    const isDonut = false;
    pie.draw(col, data.labels, layout.colours, plotTitle, isLegend, isDonut);

  }


  async function loadLogos(){
    // logo images for inside the donut hole

    for(let i = 1;  i < data.getColumnCount(); i++){

      const companyName = data.columns[i];
      const filename = companyName + ".png";

      logos[companyName] = loadImage('images/logos/' + filename);
    }
  }


}
