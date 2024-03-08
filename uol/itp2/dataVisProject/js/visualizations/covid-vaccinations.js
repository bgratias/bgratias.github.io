function CovidVaccinations() {

  // World Vaccination Rates
  // Data Source: Our World in Data - Coronavirus Vaccinations
  // Dataset accessed 2022-03-25 at 
  // https://ourworldindata.org/covid-vaccinations
  
  // ES6 - strict mode helps control the use of undeclared variables
  "use strict";



  /////////////////////////
  /// PUBLIC PROPERTIES ///
  /////////////////////////

  // Name for visualisation in the menu bar
  this.name = 'COVID Vaccinations';
  // Unique ID for visualisation
  this.id = 'covid-vaccinations';
  


  //////////////////////////
  /// PRIVATE PROPERTIES ///
  //////////////////////////

  // dataset
  let data = undefined;
  let loaded = false;
  let dataPointer = undefined;

  let worldPopulation;
  let dataDate = undefined;
  let totalVaccinated = 0;
  let totalFullyVaccinated = 0;

  // visualization
  let title = {};
  let subtitle = {};
  let layout = {};
  
  let icons = [];
  let iconImgs = [];



  //////////////////////
  /// PUBLIC METHODS ///
  //////////////////////

  this.preload = function() {
    // called by gallery when a visualisation is added

    const group = {
      name: this.name,
      assets: 4};
    console.group(group.name);
    console.time("Load time");

    iconImgs[0] = loadImage(
      'images/icons/accessibility-red.png',
      loadSuccess,
      loadFailure);
    iconImgs[1] = loadImage(
      'images/icons/accessibility-yellow.png', 
      loadSuccess,
      loadFailure);
    iconImgs[2] = loadImage(
      'images/icons/accessibility-green.png', 
      loadSuccess,
      loadFailure);

    data = loadTable(
      'data/covid/owid-covid-data-world2.csv', 
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

    noStroke();
    textStyle(NORMAL)
    imageMode(CENTER);
    textAlign(RIGHT, CENTER);
    
    cursor('images/icons/syringe26x26.png');    
    
    // Set a pointer for beginning of the dataset
    // This allows us to animate over time
    dataPointer = 0;
    
    // Initialize elements repsonsive to canvas size
    title = {
      text: "How many people in the world are vaccinated for COVID-19?",
      colour: theme.green,
      size: relativeToCanvas(30),
    };
    
    subtitle = {
      text: "",
      colour: theme.blue,
      size: relativeToCanvas(18),
      xPos: 0,
      yPos: relativeToCanvas(90),
    };
    
    layout = {
      leftMargin: relativeToCanvas(75),
      topMargin: relativeToCanvas(125),
      gridAmount: 10,
      gridGap: () => (width - layout.leftMargin * 2) / layout.gridAmount,
    };
    
    worldPopulation = max(data.getColumn('population'));

    // Divide world population into standard unit
    const worldUnit = int(worldPopulation / (layout.gridAmount * layout.gridAmount)); 
    
    // Initialize icons
    icons = [];

    let iconUnit;
    let iconXpos;
    let iconYpos;

    let iconIndex = 0;

    // Establish a grid
    for(let i = layout.gridAmount - 1; i >= 0; i--){
      for(let j = layout.gridAmount - 1; j >= 0; j--){

        // Give each icon a unit of world population
        iconUnit = (iconIndex + 1) * worldUnit;
        
        // Give each icon an x and y position
        iconXpos = layout.leftMargin + layout.gridGap() /2 + j * layout.gridGap();
        iconYpos = layout.topMargin + layout.gridGap() /2 + i * layout.gridGap();

        icons.push(new Icon(iconUnit, iconXpos, iconYpos));
        
        // increment for next icon
        iconIndex++;
      }
    }
  };


  this.destroy = function() {

    // called by gallery when visualisation is DESELECTED
    imageMode(CORNER);
    cursor(ARROW);

  };


  this.draw = function() {

    // First check if we have data
    if (!loaded) {
      console.log('Data not loaded. Abort visualization');
      return;
    }

    drawTitles(title, subtitle);

    pullData();

    renderVisual();
    
    renderTooltip();

  };

  

  ///////////////////////
  /// PRIVATE METHODS ///
  ///////////////////////

  function pullData(){
    if(dataPointer < data.getRowCount()){

      dataDate = data.get(dataPointer, 'date');
      
      totalVaccinated = Number(data.get(dataPointer, 'people_vaccinated'));
      totalFullyVaccinated = Number(data.get(dataPointer, 'people_fully_vaccinated'));
      
      const percentVaccinated = int(totalFullyVaccinated/worldPopulation * 100);
      subtitle.text = percentVaccinated + "% Fully Vaccinated As at " + dataDate;

      dataPointer ++;
    }
  }


  function renderVisual(){

    icons.forEach(thisIcon => {
      
      // Update the icon doses
      thisIcon.update(totalVaccinated, totalFullyVaccinated);

      thisIcon.draw();

    });

  }


  function renderTooltip(){

    icons.forEach(thisIcon => {
      
      if(thisIcon.isMouseOver()){
        thisIcon.drawTooltip()
      }

    });

  }


  ////////////////////
  /// CONSTRUCTORS ///
  ////////////////////

  function Icon(populationUnit, iconXpos, iconYpos){
    // Each icon represents a specific unit of population

    const popUnit = populationUnit;
    const xPos = iconXpos;
    const yPos = iconYpos;

    const iconSpacing = layout.gridGap() * .8;
    let doses = 0;

    this.update = function(vaccinated, fullyVaccinated){
      // is this unit of population vaccinated?
      if(popUnit <= fullyVaccinated){
        doses = 2;
      }else if(popUnit <= vaccinated){
        doses = 1;
      }
    };


    this.draw = function(){
      // chose image from array of images based on doses
      image(iconImgs[doses], xPos, yPos, iconSpacing, iconSpacing);
    };


    this.isMouseOver = function(){
      // check if mouse is over this icon
      if(mouseX > xPos - iconSpacing/2 && mouseX < xPos + iconSpacing/2 &&
        mouseY > yPos - iconSpacing/2 && mouseY < yPos + iconSpacing/2){
          return true;
        }
    };


    this.drawTooltip = function(){

      let tooltipText;

      // select tooltip message based on doses value
      switch(doses){
        case 0:
          tooltipText = "Unvaccinated";
          break;
        case 1:
          tooltipText = "Partially Vaccinated";
          break;
        case 2:
          tooltipText = "Fully Vaccinated";
      }

      drawTooltip(tooltipText, xPos, yPos);
    };
  }
}