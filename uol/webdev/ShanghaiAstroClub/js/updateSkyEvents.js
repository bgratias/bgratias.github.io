// Functions to Update Astronomical times and Events

// My own code

// Library used:
    // Astronomy library for JavaScript (browser and Node.js).
    // https://github.com/cosinekitty/astronomy
    // MIT License
    // Copyright (c) 2019-2021 Don Cross <cosinekitty@gmail.com>


console.log("%cupdateSkyEvents.js is loaded!", "color:green");

//get the time
const currentTime = new Date();

skyEventsClocks();
getRiseSetTimes();
getMoonPhase();

function skyEventsCounter(){
    // refresh in milliseconds
    let refresh=1000;
    mytime=setTimeout("skyEventsClocks()", refresh);
}

function skyEventsClocks(){
    //select the elements
    let shanghaiDateElement = document.querySelector("#shanghai-date p");
    let shanghaiTimeElement = document.querySelector("#shanghai-time p");
    let UTCTimeElement = document.querySelector("#UTC-time p");
    
    //format the time
    let shanghaiDate = currentTime.toDateString(
        'en-GB', {dateStyle: 'long', timeZone: 'Asia/Shanghai'});
    let shanghaiTime = currentTime.toLocaleString(
        'en-GB', {timeStyle: 'long', timeZone: 'Asia/Shanghai'});
    let UTCTime = currentTime.toLocaleString(
        'en-GB', {timeStyle: 'long', timeZone: 'UTC'});

    //push formatted time to the elements
    shanghaiDateElement.innerHTML = shanghaiDate;
    shanghaiTimeElement.innerHTML = shanghaiTime;
    UTCTimeElement.innerHTML = UTCTime;

    skyEventsCounter();
}

//Calculate moon rise time for todays date
function getRiseSetTimes(){

    console.log("getRiseSetTimes Executed!");

    //set observer location parameters
    // Astronomy library for JavaScript (browser and Node.js).
    let observer = new Astronomy.Observer(31.2304, 121.4737, 12);

    // calculate the riseset times
    // Astronomy library for JavaScript (browser and Node.js).
    let sunrise  = new Date(Astronomy.SearchRiseSet('Sun',  observer, +1, currentTime, 300));
    let sunset   = new Date(Astronomy.SearchRiseSet('Sun',  observer, -1, currentTime, 300));
    let moonrise = new Date(Astronomy.SearchRiseSet('Moon', observer, +1, currentTime, 300));
    let moonset  = new Date(Astronomy.SearchRiseSet('Moon', observer, -1, currentTime, 300));

    console.log("sun: "+ sunrise + " / " + sunset);
    console.log("moon: "+ moonrise + " / " + moonset);

    //select the DOM elements
    let sunRiseElement = document.querySelector("#sun .rise p");
    let sunSetElement = document.querySelector("#sun .set p");
    let moonRiseElement = document.querySelector("#moon .rise p");
    let moonSetElement = document.querySelector("#moon .set p");

    //format the date and swap in the information
    sunRiseElement.innerHTML = sunrise.toLocaleString(
        'en-GB', {timeStyle: 'long', timeZone: 'Asia/Shanghai'});
    sunSetElement.innerHTML = sunset.toLocaleString(
        'en-GB', {timeStyle: 'long', timeZone: 'Asia/Shanghai'});
    moonRiseElement.innerHTML = moonrise.toLocaleString(
        'en-GB', {timeStyle: 'long', timeZone: 'Asia/Shanghai'});
    moonSetElement.innerHTML = moonset.toLocaleString(
        'en-GB', {timeStyle: 'long', timeZone: 'Asia/Shanghai'});
}

//Determine current moon phase
function getMoonPhase(){

    console.log("getMoonPhase Executed!");

    let moonPhaseImage = undefined;
    let moonPhaseText = undefined;

    //get DOM element
    let moonPhaseElement = document.querySelector("#moon-phase img");

    // calculate the moon phase using the MoonPhase() function using
    // Astronomy library for JavaScript (browser and Node.js)
    currentMoonPhase = Astronomy.MoonPhase(currentTime);
    console.log("Current Phase: " + currentMoonPhase + " / 360"); 

    //match the numerical moon phase to the appropriate moon image
    if(currentMoonPhase >= 337.5 || currentMoonPhase < 22.5 ){
        moonPhaseImage = "images/sky-events-chart/moonphases/001-moon.svg"
        moonPhaseText = "New Moon"
        console.log(moonPhaseText);
    }else if(currentMoonPhase >=22.5 && currentMoonPhase < 67.5){
        moonPhaseImage = "images/sky-events-chart/moonphases/002-moon.svg"
        moonPhaseText = "Waxing Crescent"
        console.log(moonPhaseText);
    }else if(currentMoonPhase >=67.5 && currentMoonPhase < 112.5){
        moonPhaseImage = "images/sky-events-chart/moonphases/003-moon.svg"
        moonPhaseText = "First Quarter"
        console.log(moonPhaseText);
    }else if(currentMoonPhase >=112.5 && currentMoonPhase < 157.5){
        moonPhaseImage = "images/sky-events-chart/moonphases/004-moon.svg"
        moonPhaseText = "Waxing Gibbous"
        console.log(moonPhaseText);
    }else if(currentMoonPhase >=157.5 && currentMoonPhase < 202.5){
        moonPhaseImage = "images/sky-events-chart/moonphases/005-moon.svg"
        moonPhaseText = "Full Moon"
        console.log(moonPhaseText);
    }else if(currentMoonPhase >=202.5 && currentMoonPhase < 247.5){
        console.log("Wanning Gibbous"); 
        moonPhaseImage = "images/sky-events-chart/moonphases/006-moon.svg"
        moonPhaseText = "Wanning Gibbous"
    }else if(currentMoonPhase >=247.5 && currentMoonPhase < 292.5){
        moonPhaseImage = "images/sky-events-chart/moonphases/007-moon.svg"
        moonPhaseText = "Third Quarter"
        console.log(moonPhaseText);
    }else if(currentMoonPhase >=292.5 && currentMoonPhase < 337.5){
        moonPhaseImage = "images/sky-events-chart/moonphases/008-moon.svg"
        moonPhaseText = "Wanning Crescent"
        console.log(moonPhaseText);
    }else{
        // if there is no matches, throw an error
        console.log("Error"); 
    }

    //swap in the new image
    moonPhaseElement.src = moonPhaseImage;
    moonPhaseElement.alt = moonPhaseText;
    moonPhaseElement.title = moonPhaseText;
}