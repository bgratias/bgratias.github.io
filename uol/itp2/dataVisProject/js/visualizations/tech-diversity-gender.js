function TechDiversityGender() {

  // ES6 - strict mode helps control the use of undeclared variables
  "use strict";



  ////////////////////////
  /// PUBLIC PROPERTIES //
  ////////////////////////

  // Name for visualisation in the menu bar
  this.name = 'Gender Diversity in Tech';
  // Unique ID for visualisation
  this.id = 'tech-diversity-gender';
  
  
  
  /////////////////////////
  /// PRIVATE PROPERTIES //
  /////////////////////////

  // dataset
  let data = undefined;
  let loaded = false;
  let companies = [];

  // visualisation
  let title = {};
  let subtitle = {};
  let layout = {};
  
  let iconW;
  let iconM;



  /////////////////////
  /// PUBLIC METHODS //
  /////////////////////

  this.preload = function() {
    // called by gallery when a visualisation is added

    const group = {
      name: this.name,
      assets: 3};
    console.group(group.name);
    console.time("Load time");

    iconW = loadImage(
      'images/icons/female.png', 
      loadSuccess,
      loadFailure);
    iconM = loadImage(
      'images/icons/male.png', 
      loadSuccess,
      loadFailure);

    data = loadTable(
      '/data/tech-diversity/gender-2018r.csv',
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
    textAlign(RIGHT, CENTER);
    
    // Initialize elements repsonsive to canvas size
    textSize(relativeToCanvas(12));

    title = {
      text: "How Diverse is Gender in the Largest Technology Companies?",
      colour: theme.green,
      size: relativeToCanvas(24),
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
      rightMargin: width,
      topMargin: relativeToCanvas(70),
      leftMargin: relativeToCanvas(130),
      bottomMargin: relativeToCanvas(485),

      // axis
      axisColour: theme.green,
      pad: relativeToCanvas(18),
      labelXmargin: relativeToCanvas(30),
      labelYmargin: relativeToCanvas(40),

      plotWidth: () => layout.rightMargin - layout.leftMargin,
      plotHeight: () => layout.bottomMargin - layout.topMargin,
      lineHeight: () => layout.plotHeight() / data.getRowCount(),
      
      // Boolean to enable/disable background grid.
      grid: false,
      
      // Number of axis tick labels to draw
      numXTickLabels: 10,
      numYTickLabels: 8,

      // Number of icons to draw for each company
      numIcons: 30,
      xGap: () => layout.plotWidth() / layout.numIcons,

      // Middle of the plot: for 50% line.
      midX: () => (layout.plotWidth() / 2) + layout.leftMargin,
      
    };  
    
    // Ensure numIcons is always an even number
    layout.numIcons = int(layout.numIcons/2)*2

    // Create an array of companies initialized at 50% female / 50% male
    companies = [];
    for (let i = 0; i < data.getRowCount(); i++) {

      const yPos = 
        int((layout.lineHeight() * i) + layout.topMargin + layout.lineHeight() /2);
      
      let iconArray = []
      // add female icons
      for(let j = 0; j < layout.numIcons/2; j++){
        const xPos = layout.leftMargin + layout.xGap() /2 + j * layout.xGap(); 
        iconArray.push(new Icon(xPos, yPos, iconW));
      }
      // add male icons
      for(let j = 0; j < layout.numIcons/2; j++){
        const xPos = layout.midX() + layout.xGap() /2 + j * layout.xGap();
        iconArray.push(new Icon(xPos, yPos, iconM));
      }

      // calculate female icons required by dataset
      const dataFemale = round(data.getNum(i, 'female') / 100 * layout.numIcons);

      // push data and icons to companies array
      companies.push(new Company(
        data.getString(i, 'company'), 
        yPos,
        layout.numIcons/2, 
        layout.numIcons/2, 
        dataFemale, 
        iconArray));
    }
  };


  this.destroy = function() {

    // called by gallery when visualisation is DESELECTED
    imageMode(CORNER);
    textAlign(LEFT, TOP);

  };


  this.draw = function() {

    // First check if we have data
    if (!loaded) {
      console.log('Data not loaded. Abort visualization');
      return;
    }

    drawTitles(title, subtitle);
    draw50line();

    companies.forEach(company =>{
      drawLabel(company);
      renderVisual(company);
    });
    
    renderTooltips();
  };



  //////////////////////
  /// PRIVATE METHODS //
  //////////////////////

  function draw50line() {
    push();
      stroke(layout.axisColour);
      strokeWeight(1);
      line(layout.midX(),
        layout.topMargin,
        layout.midX(),
        layout.bottomMargin);
    pop();
  }


  function drawLabel(company) {

    fill(theme.green);
    text(company.name,
      layout.leftMargin - layout.pad,
      company.yPos);
  }


  function renderVisual(company) {
    
    company.update();
    company.draw();
  }


  function renderTooltips() {

    // first check if the mouse is over the grid of icons
    if(mouseX > layout.leftMargin && mouseX < layout.rightMargin && 
      mouseY > layout.topMargin && mouseY < layout.bottomMargin){

      // if it is then check each company
      companies.forEach(company => {
        company.isMouseOver();
      });
    }
  }



  ///////////////////
  /// CONSTRUCTORS //
  ///////////////////

  function Company(name, yPos, iconWomen, iconMen, dataWomen, iconArray) {

    this.name = name;
    this.yPos = yPos;

    let slideVector = 0;


    // Update the Row
    this.update = function(){

      removeOffScreenIcons();
      pushIcons();
      slideRow();

    };

    // draw the row
    this.draw = function(){
      for(let i = 0; i < iconArray.length; i++){
        iconArray[i].draw();
      }
    };

    this.isMouseOver = function(){

      iconArray.forEach(icon => {

        if(dist(mouseX, mouseY, icon.xPos, icon.yPos) < layout.lineHeight() /2){
          
          const companyRow = data.findRow(this.name, 'company');
          const percentWomen = companyRow.getNum('female');
          const percentMen = 100 - percentWomen;
          const tooltipText = 
            this.name + ":  " + 
            percentWomen + "% Women | " + 
            percentMen + "% Men";

          drawTooltip(tooltipText, mouseX, mouseY);
        }

      });

    }

    function removeOffScreenIcons(){
      for(let i = 0; i < iconArray.length; i++){
        
        if(iconArray[i].yPos > (height + 20)){
          iconArray.splice(i, 1);
          break;
        }
      }
    };

    function pushIcons(){
      // do the icons need to be pushed left or right?
      if(iconWomen > dataWomen){ 
        slideVector = -1;
      }
      if(iconWomen < dataWomen){
        slideVector = 1
      }

      for(let i = 0; i < iconArray.length; i++){
        
        // is any icon outside the left margin?
        if(iconArray[i].xPos + layout.xGap() /2 < layout.leftMargin){  

          // if it is not falling already make it fall
          if(!iconArray[i].isFalling){

            iconArray[i].isFalling = TWO_PI;
            slideVector = 0;
            iconWomen -= 1;
            addMan();
          }
        }
        
        // is any icon outside the right margin?
        if(iconArray[i].xPos - layout.xGap() /2 > layout.rightMargin){  
          
          // if it is not falling already then make it fall
          if(!iconArray[i].isFalling){
            
            iconArray[i].isFalling = 1;
            iconMen -= 1;
            slideVector = 0;
            addWoman();
          }
        }  
      }
    }

    function addWoman(){
      const xPos = layout.leftMargin + layout.xGap() /2;
      iconArray.push(new Icon(xPos, yPos, iconW));
      iconWomen += 1;
    };

    function addMan(){
      const xPos = 
        layout.leftMargin + layout.xGap() /2 + (layout.numIcons-1) * layout.xGap();
      iconArray.push(new Icon(xPos, yPos, iconM));
      iconMen += 1;
    };
    
    function slideRow(){
      for(let i = 0; i < iconArray.length; i++){
        iconArray[i].xPos += slideVector;
      }
    };

  }


  function Icon(_xPos, _yPos, _icon) {

    this.xPos = _xPos;
    this.yPos = _yPos;
    this.icon = _icon;
    
    this.yVel = 0;
    this.isFalling = 0;

    const scale = relativeToCanvas(13);
    const yAcceleration = .04;
    const spinAcceleration = 1.009;

    // draw icon
    this.draw = function(){

      push();
        translate(this.xPos, this.yPos);
        if(this.isFalling){this.plummet()};
        image(this.icon, 0, 0, scale, scale);
      pop();
    };

    // plummet icon
    this.plummet = function(){

      // spin faster and faster
      rotate(-1 * this.isFalling);
      this.isFalling *= spinAcceleration;

      // fall faster and faster
      this.yVel += yAcceleration;
      this.yPos += this.yVel;

      // move randomly left/right but mostly left
      this.xPos += random(-1,.5);
    };

  }

}