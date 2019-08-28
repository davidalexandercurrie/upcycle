var div = [];
var button = [];
var codeSnippets;
var clickFunctions = [];
var zozosounds = [];
var davesounds = [];
var codePZ = [];
var codePD = [];
var counter = 0;
var queuedTrackZozo;
var queuedTrackDave;
var oldTrackZozo;
var oldTrackDave;
var ampMult = 200;
var spectrumDave;
var spectrumZozo;
var daveFFT;
var zozoFFT;
var ampDave;
var ampZozo;
var startVisual = false;
var playingDiv;
var previousPlayingDiv;
var slider;
var playSelected = false;
var time = new Date();
var myClock = time.getTime().toString();
var myDay = Math.floor(myClock / 86400000);
var daysFromStart = myDay - 18123;

function preload() {
  codeSnippets = loadJSON("codeSnippets.json");
}

function setup() {
  // put setup code here
  var canvas = createCanvas(1200, 300).addClass("canvas");
  createElement("br", []);
  slider = createSlider(-1, 1, 0, 0.01).addClass("tempoSlider");
  slider.doubleClicked(resetSlider);

  createButtonFunctions(daysFromStart);

  for (var i = daysFromStart; i >= 0; i--) {
    div[i] = createElement("div", []);
    div[i].addClass("dayPanel");
    div[i].addClass("codePanel");
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
    codePZ[i] = createP(codeSnippets.zozo[i])
      .parent(div[i])
      .addClass("code")
      .addClass("zozo-code");
    createP(" ").parent(div[i]);
    createP("dave")
      .parent(div[i])
      .addClass("nameD");
    codePD[i] = createP(codeSnippets.dave[i])
      .parent(div[i])
      .addClass("code")
      .addClass("dave-code");
    createP(" ")
      .parent(div[i])
      .addClass("break-m");
  }

  spectrumZozo = new p5.FFT(0.9, 64);
  spectrumDave = new p5.FFT(0.9, 64);
  ampZozo = new p5.Amplitude(0.5);
  ampDave = new p5.Amplitude(0.5);
}

function draw() {
  daveFFT = spectrumDave.analyze();
  zozoFFT = spectrumZozo.analyze();
  counter++;
  player();
  visualisation();
  noStroke();
  playbackRate();
  var aniSpeed = 2 / pow(2, slider.value());
  var aniSpeedString = aniSpeed.toString() + "s";
  for (var i = 0; i < daysFromStart + 1; i++) {
    codePD[i].style("animation-duration", aniSpeedString);
    codePZ[i].style("animation-duration", aniSpeedString);
  }
}

function playbackRate() {
  if (queuedTrackDave != undefined && queuedTrackZozo != undefined) {
    queuedTrackZozo.rate(pow(2, slider.value()));
    queuedTrackDave.rate(pow(2, slider.value()));
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
    clear();
    fill(255, 0, 0, 200);
    rect(0, 0, width / 2, 150);
    fill(138, 43, 226, 200);
    rect(width / 2, 0, width / 2, 150);
  } else {
    clear();
    for (var i = 4; i < zozoFFT.length - 1; i++) {
      fill(255, 0, 0, 200);
      rect(
        (width / 2 / 59) * (i - 4),
        0,
        width / 2 / 59,
        map(zozoFFT[i], 0, 255, 0, 1) * ampMult
      );
    }
    for (var i = 4; i < zozoFFT.length - 1; i++) {
      fill(138, 43, 226, 200);
      rect(
        (width / 2 / 59) * (i - 4) + width / 2,
        0,
        width / 2 / 59,
        map(daveFFT[i], 0, 255, 0, 1) * ampMult
      );
    }
  }
}

function createButtonFunctions(days) {
  for (var i = 0; i <= days; i++) {
    var functionCreated = false;
    let buttonID;
    if (!functionCreated) {
      buttonID = i;
    }
    clickFunctions[i] = function() {
      if (playSelected === false || buttonID != previousPlayingDiv) {
        playingDiv = buttonID;
        if (!playSelected) {
          playSelected = true;
        }
        // checking if file exists + stop duplicate playback
        var xml = loadXML(
          "/Audio/z" + (buttonID + 1).toString() + ".m4a",
          loadedZ,
          errloading
        );
        // console.log("play button");
      } else {
        button[previousPlayingDiv].removeClass("fas fa-stop");
        button[previousPlayingDiv].addClass("fas fa-play");
        div[playingDiv].removeClass("playPanel");
        queuedTrackDave.stop();
        queuedTrackZozo.stop();
        // console.log("stop button");
        playSelected = false;
      }
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
}
function loadedD() {
  loadAudio(playingDiv);
}

function loadAudio(day) {
  zozosounds[day] = loadSound("/Audio/z" + (day + 1).toString() + ".m4a");
  davesounds[day] = loadSound("/Audio/d" + (day + 1).toString() + ".m4a");
  playAudio(zozosounds[day], davesounds[day]);
  div[day].addClass("playPanel");
  button[day].removeClass("fas fa-play");
  button[day].addClass("fas fa-stop");
  if (previousPlayingDiv != undefined && playingDiv != previousPlayingDiv) {
    // console.log("removing play panel");
    div[previousPlayingDiv].removeClass("playPanel");
    button[previousPlayingDiv].removeClass("fas fa-stop");
    button[previousPlayingDiv].addClass("fas fa-play");
    playSelected = true;
  }

  previousPlayingDiv = day;
}

function playAudio(audioToPlayZozo, audioToPlayDave) {
  if (queuedTrackDave != undefined && queuedTrackZozo != undefined) {
    oldTrackDave = queuedTrackDave;
    oldTrackZozo = queuedTrackZozo;
  }
  queuedTrackZozo = audioToPlayZozo;
  queuedTrackDave = audioToPlayDave;
  slider.value(0);
}

function player() {
  if (playSelected) {
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
    spectrumZozo.setInput(queuedTrackZozo);
    spectrumDave.setInput(queuedTrackDave);
  }
}

function resetSlider() {
  slider.value(0);
}
