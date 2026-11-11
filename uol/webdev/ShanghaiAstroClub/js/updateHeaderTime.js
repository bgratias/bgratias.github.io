// Function to Update the clocks in real time

// My own code

console.log("%cupdateHeaderTime.js is loaded!", "color:green");

headerClock();

function headerCounter(){
    // refresh in milliseconds
    let refresh=1000;
    mytime=setTimeout("headerClock()", refresh);
}

function headerClock(){

    //get the time
    const currentTime = new Date();

    //select the elements
    let headerTimeElement = document.querySelector('#time');
    
    //format the time
    let shanghaiDateTime = currentTime.toLocaleString(
        'en-GB', {dateStyle: 'medium', timeStyle: 'long', timeZone: 'Asia/Shanghai'});

    //push formatted time to the elements
    headerTimeElement.innerHTML = shanghaiDateTime;

    headerCounter();
}