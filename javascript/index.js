var second_tick = document.querySelector(".seconds-container");
var minute_tick = document.querySelector(".minutes-container");

var state = "stop";
var seconds = 0;
var minutes = 0;
var interval;

second_tick.style.webkitAnimationPlayState = "paused";
minute_tick.style.webkitAnimationPlayState = "paused";

function digitalTime() {

  interval = setInterval( function() {
    ++seconds;
    if(seconds === 61) {
      seconds = 0;
      ++minutes;
    }
    time = `${minutes}:${seconds}`;
    console.log(time);
    document.getElementById("time").innerHTML = time;
  }, 1000);

}

function start() {
  second_tick.style.webkitAnimationPlayState = "running";
  minute_tick.style.webkitAnimationPlayState = "running";

  document.querySelector(".start").innerHTML = "Pause"

  if (state === "stop") {
    digitalTime();
    state = "start";
  }
  else if (state === "start") {
    clearInterval(interval);
    second_tick.style.webkitAnimationPlayState = "paused";
    minute_tick.style.webkitAnimationPlayState = "paused";
    state = "stop";
  }
}


function lap() {
  var li = document.createElement("LI");
  li.innerHTML = `Minutes: ${minutes} Seconds: ${seconds}`;
  document.querySelector(".lap-list").appendChild(li);
}
