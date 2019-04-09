var clock_container = document.querySelector(".clock-container") 
var clock = document.querySelector(".clock");
var lap_container = document.querySelector(".lap-container");

var timer = document.getElementById("time");
var changed_timer = document.getElementById("changed-time");
var timer_min = document.getElementById("min");
var timer_sec = document.getElementById("sec");
var timer_ms = document.getElementById("ms");

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
    temp_ms= 0;
var interval;

store_hours = JSON.parse(localStorage.getItem('hours'));
store_minutes = JSON.parse(localStorage.getItem('minutes'));
store_seconds = JSON.parse(localStorage.getItem('seconds'));
store_miliseconds = JSON.parse(localStorage.getItem('miliseconds'));
store_lap_miliseconds = JSON.parse(localStorage.getItem('lap_ms'));
store_array = JSON.parse(localStorage.getItem('laps_array'));
store_state = JSON.parse(localStorage.getItem('state'));

if (store_array) {
  laps_array = store_array;

  const style = getComputedStyle(clock_container);

  if(style.left !== "0px") {
    clock.style.transform = "translateY(-70%)";
    lap_container.style.transform = "translate(0%, -70%)";
    lap_container.style.visibility = "visible";
    lap_container.style.opacity = "1";
  } else {
    clock.style.transform = "translateX(-80%)";
    lap_container.style.transform = "translate(120%, -110%)";
    lap_container.style.visibility = "visible";
    lap_container.style.opacity = "1";
  }
}

if (store_state) {
  state = store_state;
  if (store_state === "running") {
    state = "pause";
  }
} else {
  state = "stop";
}

if (store_hours) {
  hours = store_hours;
}
if (store_minutes) {
  minutes = store_minutes;
}
if (store_seconds) {
  seconds = store_seconds;
}
if (store_miliseconds) {
  miliseconds = store_miliseconds;
}
if (store_miliseconds > 0) {
  reset_button.style.visibility = "visible";
  lap_button.style.visibility = "visible";
  reset_button.style.opacity = "1";
  lap_button.style.opacity = "1";
}
if (store_lap_miliseconds) {
  temp_ms = store_miliseconds;
}

displayLaps();
displayTime(hours, minutes, seconds, miliseconds);

document.querySelector(".hours").style.transform = `rotateZ(${hours * 6}deg)`;
document.querySelector(".minutes").style.transform = `rotateZ(${minutes * 6}deg)`;
document.querySelector(".seconds").style.transform = `rotateZ(${seconds * 6}deg)`;
document.querySelector(".miliseconds").style.transform = `rotateZ(${miliseconds * 6}deg)`;

if (seconds > 0 || minutes > 0) {
  timer.id = "changed-time";
}

function init(value) {
  if (value === "run") {
    timer.id = "timer";
    start();
  }

  if (value === "lap") {
    lap();
    lap_container.style.visibility = "visible";
    lap_container.style.opacity = "1";

    const style = getComputedStyle(clock_container);

    if(style.left !== "0px") {
      clock.style.transform = "translateY(-70%)";
      lap_container.style.transform = "translate(0%, -70%)";
    } else {
      clock.style.transform = "translateX(-80%)";
      lap_container.style.transform = "translate(120%, -110%)";
    }
  }

  if (value === "reset") {
    removeLaps();
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
    
    console.log(hours, minutes, seconds, miliseconds);
    let temp_arr = lapStep();
    console.log(temp_arr);
    
    let a = seconds;
    let b = miliseconds;

    if (seconds < 10) {
      a = `0${seconds}`;
    }
    if (miliseconds < 10) {
      b = `0${miliseconds}`;
    }

    laps_array.unshift({
      'Minutes': minutes,
      'Seconds': a,
      'Mili': b,
      'Lap_Min': temp_arr[1],
      'Lap_Sec': temp_arr[2],
      'Lap_Ms': temp_arr[3],
    });
    localStorage.setItem('laps_array', JSON.stringify(laps_array));

    removeLapsFromPage();
    displayLaps();
    temp_ms = 0;
  }
}

function reset() {
  updateState("stop");
  state = "stop";

  clearInterval(interval);
  hours = minutes = seconds = miliseconds = temp_ms = 0;

  displayTime(0, 0, 0, 0);
  removeTimeFromStorage();

  lap_container.style.transform = "translate(0%, -70%)";
  lap_container.style.visibility = "hidden";
  clock.style.transform = "translateX(0%)";
  lap_container.style.opacity = "0";
}

function updateState(currentState) {
  if (currentState === "running") {

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

    reset_button.style.visibility = "visible";
    lap_button.style.visibility = "visible";
    reset_button.style.opacity = "1";
    lap_button.style.opacity = "1";

    play.style.display = "inline";
    pause.style.display = "none";

    timer.id = "changed-time";
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
  if (ms < 10) {
    ms = `0${ms}`;
  }
  if (sec < 10) {
    sec = `0${sec}`;
  }
  if (min < 10) {
    min = `0${min}`
  }

  timer_min.innerHTML = `${min}`;
  timer_sec.innerHTML = `${sec}`;
  timer_ms.innerHTML = `${ms}`;

  document.querySelector(".hours").style.transform = `rotateZ(${hr * 6}deg)`;
  document.querySelector(".minutes").style.transform = `rotateZ(${min * 6}deg)`;
  document.querySelector(".seconds").style.transform = `rotateZ(${sec * 6}deg)`;
  document.querySelector(".miliseconds").style.transform = `rotateZ(${ms * 6}deg)`;
}

function increaseTime() {
  miliseconds++;
  temp_ms++;
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
  displayTime(hours, minutes, seconds, miliseconds);
}

function displayLaps() {
  for (let i = 0; i < laps_array.length; i++) {
    var li = document.createElement("li");
    li.setAttribute("id", i);
    li.setAttribute("onclick", `deleteLap(${i})`);

    var s_no = document.createElement("small");
    s_no.appendChild(
      document.createTextNode(`#${i + 1}`)
    )

    var p1 = document.createElement("p");
    p1.appendChild(
      document.createTextNode(`${laps_array[i].Minutes} ${laps_array[i].Seconds}.`)
    )

    var ms1 = document.createElement("small");
    ms1.setAttribute("class", "ms");
    ms1.appendChild(
      document.createTextNode(`${laps_array[i].Mili}`)
    )

    li.appendChild(s_no);
    li.appendChild(p1);
    li.appendChild(ms1);

    var p2 = document.createElement("p");
    p2.appendChild(
      document.createTextNode(`${laps_array[i].Lap_Min} ${laps_array[i].Lap_Sec}.`)
    )

    var ms2 = document.createElement("small");
    ms2.setAttribute("class", "ms");
    ms2.appendChild(
      document.createTextNode(`${laps_array[i].Lap_Ms}`)
    )

    li.appendChild(p2);
    li.appendChild(ms2);

    parent.appendChild(li);
  }
}

function lapStep() {
  // console.log(temp_ms);
  let hours = Math.floor(temp_ms / (60*60*60));
  let hr_rem = temp_ms % (60*60*60);

  let mints = Math.floor(hr_rem / (60*60));
  let min_rem = hr_rem % (60*60);

  let sec = Math.floor(min_rem / (60));
  let sec_rem = min_rem % (60);

  let ms = sec_rem;

  if (ms < 10) {
    ms = `0${ms}`;
  }
  if (sec < 10) {
    sec = `0${sec}`;
  }

  let arr = [hours, mints, sec, ms];

  // console.log(arr);

  return arr;
}

function removeLaps() {
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
  laps_array.splice(id, 1);
  localStorage.setItem('laps_array', JSON.stringify(laps_array));
  removeLapsFromPage();
  displayLaps();
}

function removeTimeFromStorage() {
  localStorage.removeItem('hours');
  localStorage.removeItem('minutes');
  localStorage.removeItem('seconds');
  localStorage.removeItem('lap_ms');
}

function refresh() {
  localStorage.setItem('hours', JSON.stringify(hours));
  localStorage.setItem('minutes', JSON.stringify(minutes));
  localStorage.setItem('seconds', JSON.stringify(seconds));
  localStorage.setItem('miliseconds', JSON.stringify(miliseconds));
  localStorage.setItem('lap_ms', JSON.stringify(temp_ms));
  localStorage.setItem('state', JSON.stringify(state));
}