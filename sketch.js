var div = [];
var button = [];
var codeSnippets;
var clickFunctions = [];
var zozosounds = [];
var davesounds = [];
var counter = 0;
var queuedTrackZozo;
var queuedTrackDave;
var oldTrackZozo;
var oldTrackDave;

function preload() {
  codeSnippets = loadJSON("codeSnippets.json");
}

function setup() {
  // put setup code here
  var time = new Date();
  var myClock = time.getTime().toString();
  var myDay = Math.floor(myClock / 86400000);
  var daysFromStart = myDay - 18119;
  createButtonFunctions(daysFromStart);

  for (var i = 0; i < daysFromStart; i++) {
    div[i] = createElement("div", []);
    div[i].addClass(i);
    createP("Day " + (i + 1)).parent(div[i]).addClass("day")
    button[i] = createElement("i", []).addClass("fas fa-play").parent(div[i]);
    button[i].id = i;
    button[i].mousePressed(clickFunctions[button[i].id]);
    createP(" ").parent(div[i]).addClass("break-s");
    createP("zozo").parent(div[i]).addClass("name");
    createP(codeSnippets.zozo[i]).parent(div[i]).addClass("code");
    createP(" ").parent(div[i])
    createP("dave").parent(div[i]).addClass("name");
    createP(codeSnippets.dave[i]).parent(div[i]).addClass("code");
    createP(" ").parent(div[i]).addClass("break-m");
  }
}

function draw() {
  counter++;
  player();
}

function createButtonFunctions(days) {
  for (var i = 0; i <= days; i++) {
    var functionCreated = false;
    let buttonID;
    if (!functionCreated) {
      buttonID = i;
    }
    clickFunctions[i] = function() {
      loadAudio(buttonID);
    };
  }
}

function loadAudio(day) {
  zozosounds[day] = loadSound("/Audio/z" + (day + 1).toString() + ".m4a");
  davesounds[day] = loadSound("/Audio/d" + (day + 1).toString() + ".m4a");
  playAudio(zozosounds[day], davesounds[day]);
}

function playAudio(audioToPlayZozo, audioToPlayDave) {
  if (queuedTrackDave != undefined && queuedTrackZozo != undefined) {
    oldTrackDave = queuedTrackDave;
    oldTrackZozo = queuedTrackZozo;
  }
  queuedTrackZozo = audioToPlayZozo;
  queuedTrackDave = audioToPlayDave;
}

function player() {
  if (queuedTrackZozo != undefined && queuedTrackDave != undefined) {
    if (
      queuedTrackZozo.isLoaded() &&
      queuedTrackDave.isLoaded() &&
      !queuedTrackDave.isPlaying() & !queuedTrackZozo.isPlaying()
    ) {
      if (oldTrackDave != undefined && oldTrackZozo != undefined) {
        oldTrackDave.stop();
        oldTrackZozo.stop();
      }
      queuedTrackZozo.play();
      queuedTrackDave.play();
    }
  }
}
