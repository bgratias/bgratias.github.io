// - creates the canvas and places it in the #app ID <div> container
// - creates the gallery object and adds visualization objects
// - draws the visualizations

// ES6 - strict mode helps control the use of undeclared variables
"use strict";



////////////////////////
/// PUBLIC PROPERTIES //
////////////////////////

// Container for all visualisations
let gallery;

// Theme Colours, Fonts
let theme = {};

// Sounds
let UIClick;
let UIDblClick;



  //////////////////////
  /// PRIVATE METHODS //
  //////////////////////

  function preload() {

  // preload fonts
    theme.font = loadFont("fonts/montserrat-v18-latin-regular.ttf");

  // preload sounds
    soundFormats('mp3');
    //Click(1) by 7778 https://freesound.org/s/202314/
    UIClick = loadSound('/sounds/click.mp3');
    UIClick.setVolume(0.02);
    UIClick.playMode('restart')
    //Dbl Click by 7778 https://freesound.org/s/202312/
    UIDblClick = loadSound('/sounds/dbl-click.mp3');
    UIDblClick.setVolume(0.05);
    UIDblClick.playMode('restart')

}

function setup() {

  textFont(theme.font);

  // Theme Colours
  theme = {
    deepblue: color('#111144'),
    white: color('#DCDCDC'), 
    blue: color('#64DCFE'),
    yellow: color('#F8F2B4'),
    green: color('#A3FBC7'),
    purple: color('#AAA9FF'),
    red: color('#FD76AF')};

  // Create a canvas in the content div in index.html
  const c = createCanvas(500, 500);
  c.parent('app');

  // size canvas to fit viewport
  windowResized();
 
  // Create a new gallery object.
  gallery = new Gallery();
  
  // Add the visualisation objects here.
  gallery.addVisual(new CovidVaccinations());  
  gallery.addVisual(new TechDiversityGender());
  gallery.addVisual(new RisingSeaLevels());
  gallery.addVisual(new TechDiversityRace());
  gallery.addVisual(new ClimateChange());  

}


function draw() {
  background(theme.deepblue);
  if (gallery.selectedVisual != null) {
    gallery.selectedVisual.draw();
  }
}


function windowResized() {
  // will be called automatically whenever the browser window is resized

  let canvasSize = undefined;

  if(window.innerWidth > window.innerHeight || window.orientation != 0){
    //Landscape Orientation
    canvasSize = 
      max(250, min(window.innerWidth * 0.9 - 250, window.innerHeight * 0.9, 1000));
  }else{
    //Portrait Orientation
    canvasSize = 
      max(250, min(window.innerWidth * 0.95, window.innerHeight * 0.95, 1000));
  }
  resizeCanvas(canvasSize, canvasSize);

  // redraw visualization after changing canvas size
  if (gallery !== undefined && gallery.selectedVisual !== null) {
    gallery.selectedVisual.setup();
  }
}