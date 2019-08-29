var div = [];
var p = [];
var nameD = [];
var nameZ = [];
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
var ampMult = 700;
var spectrumDave;
var spectrumZozo;
var daveFFT;
var zozoFFT;
var ampDave;
var ampZozo;
var startVisual = false;
var resetHeightVisual = 200;
var transp = 150;
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
  var canvas = createCanvas(1400, 700).addClass("canvas");
  createElement("br", []);
  slider = createSlider(-1, 1, 0, 0.01).addClass("tempoSlider");
  volumeSliderD = createSlider(0, 1, 0.8, 0.01).addClass("volumeSliderD");
  volumeSliderZ = createSlider(0, 1, 0.8, 0.01).addClass("volumeSliderZ");
  volumeSliderD.doubleClicked(resetVolumeD);
  volumeSliderZ.doubleClicked(resetVolumeZ);
  slider.doubleClicked(resetSlider);

  createButtonFunctions(daysFromStart);

  for (var i = daysFromStart; i >= 0; i--) {
    div[i] = createElement("div", []);
    div[i].addClass("dayPanel");
    div[i].addClass("codePanel");
    p[i] = createP("Day " + (i + 1))
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
    nameZ[i] = createP("zozo")
      .parent(div[i])
      .addClass("nameZ");

    codePZ[i] = createP(codeSnippets.zozo[i])
      .parent(div[i])
      .addClass("code")
      .addClass("zozo-code");
    createP(" ").parent(div[i]);
    nameD[i] = createP("dave")
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
  if (
    codeSnippets.zozo[daysFromStart] === undefined ||
    codeSnippets.dave[daysFromStart] === undefined
  ) {
    // codeSnippets.zozo[daysFromStart] = "Coming Soon!";
    // div[daysFromStart].html("Coming Soon!");
    button[daysFromStart].hide();
    resetHeightVisual = 150;
    p[daysFromStart].style("text-decoration", "line-through");
    nameD[daysFromStart].hide();
    nameZ[daysFromStart].hide();
  }

  spectrumZozo = new p5.FFT(0.9, 128);
  spectrumDave = new p5.FFT(0.9, 128);
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
  sliders();
  var aniSpeed = 2 / pow(2, slider.value());
  var aniSpeedString = aniSpeed.toString() + "s";
  for (var i = 0; i < daysFromStart + 1; i++) {
    codePD[i].style("animation-duration", aniSpeedString);
    codePZ[i].style("animation-duration", aniSpeedString);
  }
}

function sliders() {
  if (queuedTrackDave != undefined && queuedTrackZozo != undefined) {
    queuedTrackZozo.rate(pow(2, slider.value()));
    queuedTrackDave.rate(pow(2, slider.value()));
    queuedTrackDave.setVolume(volumeSliderD.value() ** 2, 0.1, 0);
    queuedTrackZozo.setVolume(volumeSliderZ.value() ** 2, 0.1, 0);
  }
}

function visualisation() {
  // if (
  //   (ampZozo.getLevel() > 0 || ampDave.getLevel() > 0) &&
  //   startVisual === false
  // ) {
  //   startVisual = true;
  // }
  if (startVisual === false) {
    clear();
    fill(255, 0, 0, transp);
    rect(0, 0, width / 2, resetHeightVisual);
    fill(138, 43, 226, transp);
    rect(width / 2, 0, width / 2, resetHeightVisual);
  } else {
    clear();
    var oldXZ = -1000;
    var oldYZ = 0;
    var XZ;
    var YZ;
    for (var i = 4; i < zozoFFT.length - 1; i++) {
      fill(255, 0, 0, transp);
      stroke(255, 0, 0, transp);
      // rect(
      //   (width / 123) * (i - 4),
      //   0,
      //   width / 123,
      //   map(zozoFFT[i], 0, 255, 0, 1) * ampMult
      // );
      XZ = (width / 123) * (i - 4);
      YZ = map(zozoFFT[i], 0, 255, 0, 1) * ampMult - 1 * volumeSliderZ.value();
      line(oldXZ, oldYZ, XZ, YZ);
      oldXZ = XZ;
      oldYZ = YZ;
    }
    var oldXD = -1000;
    var oldYD = -1;
    var XD;
    var YD;
    for (var i = 4; i < daveFFT.length - 1; i++) {
      fill(138, 43, 226, transp);
      stroke(138, 43, 226, transp);
      // rect(
      //   width - width / 123 / 2 - (width / 123) * (i - 4),
      //   0,
      //   width / 123,
      //   map(daveFFT[i], 0, 255, 0, 1) * ampMult
      // );
      XD = (width / 123) * (i - 4);
      YD = map(daveFFT[i], 0, 255, 0, 1) * ampMult - 1 * volumeSliderD.value();
      line(oldXD, oldYD, XD, YD);
      oldXD = XD;
      oldYD = YD;
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
        startVisual = true;
      } else {
        button[previousPlayingDiv].removeClass("fas fa-stop");
        button[previousPlayingDiv].addClass("fas fa-play");
        div[playingDiv].removeClass("playPanel");
        queuedTrackDave.stop();
        queuedTrackZozo.stop();
        playSelected = false;
        startVisual = false;
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
  resetSlider();
  resetVolumeD();
  resetVolumeZ();
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
function resetVolumeD() {
  volumeSliderD.value(0.8);
}
function resetVolumeZ() {
  volumeSliderZ.value(0.8);
}
