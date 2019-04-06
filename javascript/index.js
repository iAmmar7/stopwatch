var clock = document.querySelector(".clock");

var second_tick = document.querySelector(".seconds-container");
var minute_tick = document.querySelector(".minutes-container");
var timer = document.getElementById("time");

var pause = document.querySelector(".fa-pause");
var play = document.querySelector(".fa-play");

var reset_button = document.querySelector(".reset");
var lap_button = document.querySelector(".lap");

var parent = document.querySelector(".lap-list");
var laps_array = [];
var store_array;

var state = "stop";
// var miliseconds = 0;
var seconds = 0;
var minutes = 0;
var interval;


seconds = JSON.parse(localStorage.getItem('seconds'));
minutes = JSON.parse(localStorage.getItem('minutes'));
store_array = JSON.parse(localStorage.getItem('laps_array'));

if (store_array) {
  laps_array = store_array;
  console.log(laps_array);
}

displayLaps();

document.querySelector(".seconds").style.transform = `rotateZ(${seconds * 6}deg)`;
document.querySelector(".minutes").style.transform = `rotateZ(${minutes * 6}deg)`;
displayTime(minutes, seconds);

if(seconds > 0 || minutes > 0) {
  timer.id = "changed-timer";
}


function init(value) {
  if(value === "run") {
    second_tick.className = "seconds-container";
    minute_tick.className = "minutes-container";
    timer.className = "timer";
    start();
  }

  if(value === "lap") {
    lap();
  }

  if(value === "reset") {
    reset();
  }
}


function start() {
  if (state === "stop") {
    updateState("running");
    state = "running";
  }
  else if (state === "running") {
    updateState("pause");
    state = "pause";
  }
  else if (state === "pause") {
    updateState("running");
    state = "running";
  }
}

function lap() {
  if (state !== "stop") {
    // parent.style.opacity = "1";

    // clock.style.top = "28%";

    // timer.style.width = "8vw";
    // timer.style.fontSize = "3.5vw";

    // document.querySelector(".clock-container").style.transform = "translateX(-10%)";
    
    // document.querySelector(".lap-container").style.display = "flex";
    // document.querySelector(".lap-container").style.transform = "translateX(-40%)";

    laps_array.push({Minutes: minutes, Seconds: seconds});
    localStorage.setItem('laps_array', JSON.stringify(laps_array));

    removeLaps();
    displayLaps();
  }
}


function reset() {
  updateState("stop");
  state = "stop";

  clearInterval(interval);
  seconds = minutes = 0;
  displayTime(0, 0);
  // clock.style.top = "50%";
}

function updateState(currentState) {
  if (currentState === "running") {
    second_tick.style.webkitAnimationPlayState = "running";
    minute_tick.style.webkitAnimationPlayState = "running";

    pause.style.display = "inline";
    play.style.display = "none";

    reset_button.style.visibility = "visible";
    lap_button.style.visibility = "visible";
    reset_button.style.opacity = "1";
    lap_button.style.opacity = "1";
    
    timer.id = "time";

    interval = setInterval(digitalTime, 1000);
  }

  if (currentState === "pause") {
    clearInterval(interval);

    second_tick.style.webkitAnimationPlayState = "paused";
    minute_tick.style.webkitAnimationPlayState = "paused";

    play.style.display = "inline";
    pause.style.display = "none";

    timer.id = "changed-timer";
  }
  
  if (currentState === "stop") {
    second_tick.style.webkitAnimationPlayState = "paused";
    minute_tick.style.webkitAnimationPlayState = "paused";

    reset_button.style.visibility = "initial";
    lap_button.style.visibility = "initial";
    reset_button.style.opacity = "0";
    lap_button.style.opacity = "0";

    play.style.display = "inline";
    pause.style.display = "none";

    timer.id = "time";
  }
}

function displayTime(min, sec) {
  if (sec < 10) {
    sec = `0${sec}`; 
  }
  if (min < 10) {
    min = `0${min}`
  }
  time = `${min}:${sec}`; 
  console.log(time);

  if (state === "pause") {
    document.getElementById("changed-timer").innerHTML = time;
  } else {
    document.getElementById("time").innerHTML = time;

    // document.getElementById("ms").innerHTML = ms;  

    document.querySelector(".seconds").style.transform = `rotateZ(${sec * 6}deg)`;
    document.querySelector(".minutes").style.transform = `rotateZ(${min * 6}deg)`;
  }
}

function digitalTime() {
  seconds++;
  if(seconds >= 60) {
    seconds = 0;
    minutes++;
  }
  displayTime(minutes, seconds);
}

function refresh() {
  localStorage.setItem('seconds', JSON.stringify(seconds));
  localStorage.setItem('minutes', JSON.stringify(minutes));
}

function displayLaps() {
  reverse_array = laps_array.reverse();
  for (let i=0; i<reverse_array.length; i++) {
    var li = document.createElement("li");
    li.appendChild(
      document.createTextNode(`Minutes: ${laps_array[i].Minutes} Seconds: ${laps_array[i].Seconds}`)
    );
    parent.appendChild(li);
  }
}

function removeLaps() {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function clearLaps() {
  localStorage.removeItem('laps_array');
  removeLaps();
}