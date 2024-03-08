function Gallery() {
  
  // - creates the visuals array
  // - adds visualisations with id and name to nav bar
  // - draws the visualizations
  
  // ES6 - strict mode helps control the use of undeclared variables
  "use strict";


  
  ////////////////////////
  /// PUBLIC PROPERTIES //
  ////////////////////////

  // currently selected visualization
  this.selectedVisual = null;
  

  
  /////////////////////////
  /// PRIVATE PROPERTIES //
  /////////////////////////
  
  // array of all visualizations
  let visuals = [];

  const self = this;

  
    
  /////////////////////
  /// PUBLIC METHODS //
  /////////////////////

  this.addVisual = function(vis) {
    // Validate a visualization
    // Add new visualisation to the visuals array
    // Add visualization to the nav bar
    // Add event handlers to the menu entry
    // Preload data

    // Check that the vis object has an id and name.
    if (!vis.hasOwnProperty('id')
        && !vis.hasOwnProperty('name')) {
      alert('Make sure your visualisation has an id and name!');
    }

    // Check that the vis object has a unique id.
    if (self.findVisIndex(vis.id) != null) {
      alert(`Vis '${vis.name}' has a duplicate id: '${vis.id}'`);
    }

    // Push visualization onto the menu list
    visuals.push(vis);
  
    // Create menu item in HTML
    const menuItem = createElement('li', vis.name);
    menuItem.addClass('menu-item');
    menuItem.id(vis.id);
    
    // Add event handlers to the menu item
    menuItem.mouseOver(function(e){
        let el = select('#' + e.srcElement.id);
        el.addClass("hover");
        UIClick.play(0,1);
    })
    
    menuItem.mouseOut(function(e){
      let el = select('#' + e.srcElement.id);
      el.removeClass("hover");
      UIClick.play(0,.6);
    })
    
    menuItem.mouseClicked(function(e){
      // remove selected class from any other menu-items
      let menuItems = selectAll('.menu-item');
      for(let i = 0; i < menuItems.length; i++){
        menuItems[i].removeClass('selected');
      }
      
      UIDblClick.play();

      // select the current menu-item
      const el = select('#' + e.srcElement.id);
      el.addClass('selected');
      
      // initialize the selected visualization
      self.selectVisual(e.srcElement.id);
    })
      
      
    const visMenu = select('#visuals-menu');
    visMenu.child(menuItem);

    // Preload data if necessary.
    if (vis.hasOwnProperty('preload')) {
      vis.preload();
    }
  }



  //////////////////////
  /// PRIVATE METHODS //
  //////////////////////

  self.findVisIndex = function(visId) {
    // Search through visualisations for match to visId.
    for (let i = 0; i < visuals.length; i++) {
      if (visuals[i].id == visId) {
        return i;
      }
    }

    // Visualisation not found.
    return null;
  }


  self.selectVisual = function(visId){
    const visIndex = self.findVisIndex(visId);

    if (visIndex != null) {

      // If the current visualisation has a deselect method run it.
      if (this.selectedVisual != null
          && this.selectedVisual.hasOwnProperty('destroy')) {
        this.selectedVisual.destroy();
      }
      
      const canvasContainer = select('#app');

      // Make Canvas hidden
      canvasContainer.removeClass('visible');
      canvasContainer.addClass('hidden');      

      // Select the visualisation in the gallery.
      this.selectedVisual = visuals[visIndex];

      // Initialise visualisation if necessary.
      if (this.selectedVisual.hasOwnProperty('setup')) {
        this.selectedVisual.setup();
      }

      // Make Canvas visible
      canvasContainer.removeClass('hidden');
      canvasContainer.addClass('visible');

      // Start draw loop in case it was paused by the previous visualisation
      loop();
    }
  }
}