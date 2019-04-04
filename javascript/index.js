var second_tick = document.querySelector(".seconds-container");
var minute_tick = document.querySelector(".minutes-container");
timer = document.getElementById("time");

pause = document.querySelector(".fa-pause");
play = document.querySelector(".fa-play");

var state = "stop";
var miliseconds = 0;
var seconds = 0;
var minutes = 0;
var interval;

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
    var li = document.createElement("LI");
    li.innerHTML = `Minutes: ${minutes} Seconds: ${seconds}`;
    document.querySelector(".lap-list").appendChild(li);
  }
}


function reset() {
  updateState("stop");
  state = "stop";

  second_tick.className = minute_tick.className = "changed-container";

  var node = document.querySelector(".lap-list");
  while (node.firstChild) {
      node.removeChild(node.firstChild);
  }
}

function updateState(currentState) {
  if (currentState === "running") {
    second_tick.style.webkitAnimationPlayState = "running";
    minute_tick.style.webkitAnimationPlayState = "running";

    pause.style.display = "inline";
    play.style.display = "none";
    
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
    clearInterval(interval);
    miliseconds = seconds = minutes = 0;
    displayTime(0, 0);

    second_tick.style.webkitAnimationPlayState = "paused";
    minute_tick.style.webkitAnimationPlayState = "paused";

    play.style.display = "inline";
    pause.style.display = "none";

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
  document.getElementById("time").innerHTML = time;
}

function digitalTime() {
  seconds++;
  if(seconds >= 60) {
    seconds = 0;
    minutes++;
  }
  displayTime(minutes, seconds);
}