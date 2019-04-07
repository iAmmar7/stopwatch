var clock = document.querySelector(".clock");

var timer = document.getElementById("time");

var pause = document.querySelector(".fa-pause");
var play = document.querySelector(".fa-play");

var reset_button = document.querySelector(".reset");
var lap_button = document.querySelector(".lap");

var parent = document.querySelector(".lap-list");

var laps_array = [];
var store_array;

var state = "stop";
hours = 0;
minutes = 0;
seconds = 0;
miliseconds = 0;
var interval;

store_hours = JSON.parse(localStorage.getItem('hours'));
store_minutes = JSON.parse(localStorage.getItem('minutes'));
store_seconds = JSON.parse(localStorage.getItem('seconds'));
store_miliseconds = JSON.parse(localStorage.getItem('miliseconds'));
store_array = JSON.parse(localStorage.getItem('laps_array'));

if (store_array) {
  laps_array = store_array;
  console.log(laps_array);
}
if (store_hours) {
  hours = store_hours;
  console.log(hours);
}
if (store_minutes) {
  minutes = store_minutes;
  console.log(minutes);
}
if (store_seconds) {
  seconds = store_seconds;
  console.log(seconds);
}
if (store_miliseconds) {
  miliseconds = store_miliseconds;
  console.log(miliseconds);
}

console.log(hours, minutes, seconds, miliseconds);
displayLaps();

document.querySelector(".hours").style.transform = `rotateZ(${hours * 6}deg)`;
document.querySelector(".minutes").style.transform = `rotateZ(${minutes * 6}deg)`;
document.querySelector(".seconds").style.transform = `rotateZ(${seconds * 6}deg)`;
document.querySelector(".miliseconds").style.transform = `rotateZ(${miliseconds * 6}deg)`;
displayTime(hours, minutes, seconds, miliseconds);

if (seconds > 0 || minutes > 0) {
  timer.id = "changed-timer";
}


function init(value) {
  if (value === "run") {
    timer.className = "timer";
    start();
  }

  if (value === "lap") {
    lap();
  }

  if (value === "reset") {
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

    laps_array.unshift({ 'Minutes': minutes, 'Seconds': seconds, 'Mili': miliseconds});
    localStorage.setItem('laps_array', JSON.stringify(laps_array));

    removeLapsFromPage();
    displayLaps();
  }
}


function reset() {
  updateState("stop");
  state = "stop";

  clearInterval(interval);
  hours = minutes = seconds = miliseconds = 0;

  displayTime(0, 0, 0, 0);
  removeTimeFromStorage();
}

function updateState(currentState) {
  if (currentState === "running") {
    console.log(hours, minutes, seconds, miliseconds);

    pause.style.display = "inline";
    play.style.display = "none";

    reset_button.style.visibility = "visible";
    lap_button.style.visibility = "visible";
    reset_button.style.opacity = "1";
    lap_button.style.opacity = "1";

    timer.id = "time";

    interval = setInterval(increaseTime, 1000 / 60);
  }

  if (currentState === "pause") {
    clearInterval(interval);

    play.style.display = "inline";
    pause.style.display = "none";

    timer.id = "changed-timer";
  }

  if (currentState === "stop") {
    reset_button.style.visibility = "initial";
    lap_button.style.visibility = "initial";
    reset_button.style.opacity = "0";
    lap_button.style.opacity = "0";

    play.style.display = "inline";
    pause.style.display = "none";

    timer.id = "time";
  }
}

function displayTime(hr, min, sec, ms) {
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

    document.querySelector(".hours").style.transform = `rotateZ(${hr * 6}deg)`;
    document.querySelector(".minutes").style.transform = `rotateZ(${min * 6}deg)`;
    document.querySelector(".seconds").style.transform = `rotateZ(${sec * 6}deg)`;
    document.querySelector(".miliseconds").style.transform = `rotateZ(${ms * 6}deg)`;
  }
}

function increaseTime() {
  miliseconds++;
  if (miliseconds >= 60) {
    miliseconds = 0;
    seconds++;
    if (seconds >= 60) {
      seconds = 0;
      minutes++;
      if (minutes >= 60) {
        minutes = 0;
        hours++;
      }
    }
  }
  // console.log(hours, minutes, seconds, miliseconds);

  displayTime(hours, minutes, seconds, miliseconds);
}

function refresh() {
  localStorage.setItem('hours', JSON.stringify(hours));
  localStorage.setItem('minutes', JSON.stringify(minutes));
  localStorage.setItem('seconds', JSON.stringify(seconds));
  localStorage.setItem('miliseconds', JSON.stringify(miliseconds));
}

function displayLaps() {
  for (let i = 0; i < laps_array.length; i++) {
    var li = document.createElement("li");
    li.setAttribute("id", i);
    li.setAttribute("onclick", `deleteLap(${i})`);

    var small = document.createElement("small");
    small.appendChild(
      document.createTextNode(`#${i + 1}`)
    )

    li.appendChild(small);
    li.appendChild(
      document.createTextNode(`${laps_array[i].Minutes} ${laps_array[i].Seconds}.${laps_array[i].Mili}`)
    );
    parent.appendChild(li);
  }
}

function removeLaps() {
  console.log(parent);
  removeLapsFromPage();
  laps_array.splice(0);
  localStorage.removeItem('laps_array');
}

function removeLapsFromPage() {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function deleteLap(id) {
  console.log("i am " + id);
  laps_array.splice(id, 1);
  localStorage.setItem('laps_array', JSON.stringify(laps_array));
  removeLapsFromPage();
  displayLaps();
}

function removeTimeFromStorage() {
  localStorage.removeItem('hours');
  localStorage.removeItem('minutes');
  localStorage.removeItem('seconds');
  localStorage.removeItem('miliseconds');
}