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
var oldAmpZ;
var oldAmpD;
var ampMult = 600;
var startVisual = false;
var playingDiv;
var previousPlayingDiv;
var slider;

function preload() {
  codeSnippets = loadJSON("codeSnippets.json");
}

function setup() {
  // put setup code here
  var canvas = createCanvas(200, 200).addClass("canvas");
  createElement("br", []);
  slider = createSlider(0.5, 2, 1, 0.01);
  slider.doubleClicked(resetSlider);
  var time = new Date();
  var myClock = time.getTime().toString();
  var myDay = Math.floor(myClock / 86400000);
  var daysFromStart = myDay - 18123;

  createButtonFunctions(daysFromStart);

  for (var i = daysFromStart; i >= 0; i--) {
    div[i] = createElement("div", []);
    div[i].addClass("dayPanel");
    createP("Day " + (i + 1))
      .parent(div[i])
      .addClass("day");
    button[i] = createElement("i", [])
      .addClass("fas fa-play")
      .parent(div[i]);
    button[i].id = i;
    button[i].mousePressed(clickFunctions[button[i].id]);
    createP(" ")
      .parent(div[i])
      .addClass("break-s");
    createP("zozo")
      .parent(div[i])
      .addClass("nameZ");
    createP(codeSnippets.zozo[i])
      .parent(div[i])
      .addClass("code");
    createP(" ").parent(div[i]);
    createP("dave")
      .parent(div[i])
      .addClass("nameD");
    createP(codeSnippets.dave[i])
      .parent(div[i])
      .addClass("code");
    createP(" ")
      .parent(div[i])
      .addClass("break-m");
  }
  ampZozo = new p5.Amplitude(0.5);
  ampDave = new p5.Amplitude(0.5);
}

function draw() {
  counter++;
  player();
  visualisation();
  noStroke();
  playbackRate();
}

function playbackRate() {
  if (queuedTrackDave != undefined && queuedTrackZozo != undefined) {
    queuedTrackZozo.rate(slider.value());
    queuedTrackDave.rate(slider.value());
  }
}

function visualisation() {
  if (
    (ampZozo.getLevel() > 0 || ampDave.getLevel() > 0) &&
    startVisual === false
  ) {
    startVisual = true;
  }
  if (startVisual === false) {
    fill(255, 0, 0);
    rect(0, 0, width / 2, height);
    fill(138, 43, 226);
    rect(width / 2, 0, width / 2, height);
  } else {
    background(255, 200);
    fill(255, 0, 0);
    rect(0, 0, width / 2, lerp(oldAmpZ, ampZozo.getLevel() * ampMult, 0.9));
    fill(138, 43, 226);
    rect(
      width / 2,
      0,
      width / 2,
      lerp(oldAmpD, ampDave.getLevel() * ampMult, 0.9)
    );
  }
  oldAmpZ = ampZozo.getLevel() * ampMult;
  oldAmpD = ampDave.getLevel() * ampMult;
}

function createButtonFunctions(days) {
  for (var i = 0; i <= days; i++) {
    var functionCreated = false;
    let buttonID;
    if (!functionCreated) {
      buttonID = i;
    }
    clickFunctions[i] = function() {
      playingDiv = buttonID;
      // checking if file exists + stop duplicate playback
      var xml = loadXML(
        "/Audio/z" + (buttonID + 1).toString() + ".m4a",
        loadedZ,
        errloading
      );
      console.log(xml);
    };
  }
}

function errloading() {
  // TODO trigger css for play not successful from here
}
function loadedZ() {
  var xml = loadXML(
    "/Audio/d" + (playingDiv + 1).toString() + ".m4a",
    loadedD,
    errloading
  );
  console.log("loadedZ");
}
function loadedD() {
  loadAudio(playingDiv);
  console.log("loadedD");
}

function loadAudio(day) {
  zozosounds[day] = loadSound("/Audio/z" + (day + 1).toString() + ".m4a");
  davesounds[day] = loadSound("/Audio/d" + (day + 1).toString() + ".m4a");
  playAudio(zozosounds[day], davesounds[day]);
  div[day].addClass("playPanel");

  if (previousPlayingDiv != undefined) {
    div[previousPlayingDiv].addClass("dayPanel");
    div[previousPlayingDiv].removeClass("playPanel");
  }
  console.log(previousPlayingDiv);
  previousPlayingDiv = day;
}

function playAudio(audioToPlayZozo, audioToPlayDave) {
  if (queuedTrackDave != undefined && queuedTrackZozo != undefined) {
    oldTrackDave = queuedTrackDave;
    oldTrackZozo = queuedTrackZozo;
  }
  queuedTrackZozo = audioToPlayZozo;
  queuedTrackDave = audioToPlayDave;
  slider.value(1);
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
      // queuedTrackZozo.play();
      // queuedTrackDave.play();
      queuedTrackZozo.loop();
      queuedTrackDave.loop();
    }
  }
  ampZozo.setInput(queuedTrackZozo);
  ampDave.setInput(queuedTrackDave);
}

function resetSlider() {
  slider.value(1);
}
