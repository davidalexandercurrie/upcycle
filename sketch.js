var div = [];
var p = [];
var nameD = [];
var nameZ = [];
var button = [];
var codeSnippets;
var tidalDocs;
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
var visualHeight = 0;
var transp = 255;
var playingDiv;
var previousPlayingDiv;
var slider;
var playSelected = false;
var time = new Date();
var myClock = time.getTime().toString();
var myDay = Math.floor(myClock / 86400000);
var daysFromStart = myDay - 18185;
daysFromStart = 26;
var test = 0;
var fullLoad = daysFromStart * 2;
var loadAmount = 100 / fullLoad;
var bar;
var labelVZ;
var labelVD;
var labelT;
var slideIn;
var slideAmount = 0;
var divFadeInNumber = daysFromStart;
var opacityAmt = 0;
var firstTime = true;
var slidersDiv;
var animationSpeedCurve;
var timer = 500;
var main = document.getElementById("main-id");

function preload() {
  codeSnippets = loadJSON("codeSnippets.json");
  tidalDocs = loadJSON("tidalDocs.json");
  bar = createElement("div", []);
  bar.id("loading-bar");
  bar.parent(document.getElementById("p5_loading"));
  for (var i = 0; i <= daysFromStart; i++) {
    if (i < 17) {
      zozosounds[i] = loadSound(
        "/Audio/z" + (i + 1).toString() + ".m4a",
        success,
        fail
      );
      davesounds[i] = loadSound(
        "/Audio/d" + (i + 1).toString() + ".m4a",
        success,
        fail
      );
    } else {
      zozosounds[i] = loadSound(
        "/Audio/z" + (i + 1).toString() + ".ogg",
        success,
        fail
      );
      davesounds[i] = loadSound(
        "/Audio/d" + (i + 1).toString() + ".ogg",
        success,
        fail
      );
    }
  }
  slidersDiv = createElement("div", []).style("visibility", "hidden");
  slidersDiv.addClass("sliderDiv");
  labelVZ = createElement("div", '<i class="fas fa-volume-up"></i>');
  labelVD = createElement("div", '<i class="fas fa-volume-up"></i>');
  labelT = createElement("div", '<i class="fas fa-tachometer-alt"></i>');
  labelVZ.parent(slidersDiv);
  labelVZ.style("color", "rgb(226, 43, 138)");
  labelVD.parent(slidersDiv);
  labelVD.style("color", "rgb(138, 43, 226)");
  labelT.parent(slidersDiv);
  // labelT.style("color", "rgb(43, 138, 226)");
  labelT.style("color", "rgb(226, 138, 43)");
  if (devContent()) {
    return devContent();
  }
}

function success() {
  test += loadAmount;
  loadBar();
}
function fail() {
  this._decrementPreload();
  test += loadAmount;
  loadBar();
}

function loadBar() {
  widthValue = test;
  loadTime = widthValue.toString() + "%";
  bar.style("width", loadTime);
}

function setup() {
  console.log(tidalDocsSearch("rand", "Oscillators"));
  // put setup code here
  // main.style("visibility", "hidden")
  var canvas = createCanvas(1400, 700).addClass("canvas");
  //div for description
  descriptionBox = createDiv("", [])
    .id("descriptionBox")
    .style("visibility", "hidden");
  title = createP("")
    .id("descriptionTag")
    .parent(descriptionBox);
  createElement("br", []);
  slider = createSlider(-1, 1, 0, 0.01)
    .addClass("control-slider")
    .parent(labelT);
  volumeSliderD = createSlider(0, 1, 0.8, 0.01)
    .addClass("control-slider")
    .parent(labelVD);
  volumeSliderZ = createSlider(0, 1, 0.8, 0.01)
    .addClass("control-slider")
    .parent(labelVZ);
  volumeSliderD.doubleClicked(resetVolumeD);
  volumeSliderZ.doubleClicked(resetVolumeZ);
  slider.doubleClicked(resetSlider);

  createButtonFunctions(daysFromStart);

  for (var i = daysFromStart; i >= 0; i--) {
    div[i] = createElement("div", []);
    div[i].addClass("dayPanel");
    div[i].addClass("codePanel");
    div[i].style("opacity", "0");
    p[i] = createP("Day " + (i + 1))
      .parent(div[i])
      .addClass("day");
    button[i] = createElement("i", [])
      .addClass("fas fa-play playButton")
      .parent(div[i]);
    button[i].id = i;
    button[i].mousePressed(clickFunctions[button[i].id]);
    button[i].style("");
    createP(" ")
      .parent(div[i])
      .addClass("break-s");
    nameZ[i] = createP("zozo")
      .parent(div[i])
      .addClass("nameZ");
    if (
      codeSnippets.zozo[i] != undefined &&
      codeSnippets.dave[i] != undefined
    ) {
      codeSnippets.zozo[i] = highlightText(codeSnippets.zozo[i]);
      codeSnippets.dave[i] = highlightText(codeSnippets.dave[i]);
    }

    codePZ[i] = createP(codeSnippets.zozo[i])
      .parent(div[i])
      .addClass("code")
      .addClass("zozo-code")
      .addClass("default");
    createP(" ").parent(div[i]);
    nameD[i] = createP("dave")
      .parent(div[i])
      .addClass("nameD");

    codePD[i] = createP(codeSnippets.dave[i])
      .parent(div[i])
      .addClass("code")
      .addClass("dave-code")
      .addClass("default");
    createP(" ")
      .parent(div[i])
      .addClass("break-m");
    if (
      codeSnippets.zozo[i] === undefined ||
      codeSnippets.dave[i] === undefined ||
      zozosounds[i] === undefined ||
      davesounds[i] === undefined
    ) {
      // codeSnippets.zozo[daysFromStart] = "Coming Soon!";
      // div[daysFromStart].html("Coming Soon!");
      codePD[i].addClass("noHover");
      codePZ[i].addClass("noHover");
      codePD[i].html("");
      codePZ[i].html("");
      button[i].hide();
      resetHeightVisual = 150;
      p[i].style("text-decoration", "line-through");
      p[i].style("opacity", "0.4");
      nameD[i].hide();
      nameZ[i].hide();
    }
  }

  spectrumZozo = new p5.FFT(0.9, 256);
  spectrumDave = new p5.FFT(0.9, 256);
  ampZozo = new p5.Amplitude(0.5);
  ampDave = new p5.Amplitude(0.5);
}

function draw() {
  daveFFT = spectrumDave.analyze();
  zozoFFT = spectrumZozo.analyze();
  counter++;
  if (divFadeInNumber >= 0) fadeInText();
  visualWaitTimer();
  controlPanelSlideIn();
  player();
  visualisation();
  noStroke();
  sliders();
  var aniSpeed = 2 / pow(2, slider.value());
  var aniSpeedString = aniSpeed.toString() + "s";
  for (var i = 0; i < daysFromStart + 1; i++) {
    nameD[i].style("animation-duration", aniSpeedString);
    nameZ[i].style("animation-duration", aniSpeedString);
  }
}

function fadeInText() {
  var opacity = (opacityAmt ** 3).toString();
  div[divFadeInNumber].style("opacity", opacity);
  opacityAmt += 0.03;
  if (opacityAmt > 1) {
    opacityAmt = 0;
    divFadeInNumber -= 1;
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

function controlPanelSlideIn() {
  if (slideIn === true && slideAmount < 1 && firstTime == false) {
    slideAmount += 0.05;
    var slidePC = slideAmount.toString();
    slidersDiv.style("opacity", slidePC);
  } else if (slideIn === false && slideAmount > 0.2 && firstTime == false) {
    slideAmount -= 0.05;
    var slidePC = slideAmount.toString();
    slidersDiv.style("opacity", slidePC);
  }
  if (firstTime === true) {
    slidersDiv.style("visibility", "visible");
    slideAmount += 0.01;
    var slidePC = slideAmount.toString();
    var titleOpacity = 1 - (1 - slideAmount) ** 2;
    var titleBackground = document.getElementById("titleBackground");
    var titleOpacityString = titleOpacity.toString();
    if (slideAmount < 0.3) slidersDiv.style("opacity", slidePC);
    var h1 = document.getElementById("pageTitle");
    h1.style.opacity = titleOpacityString;
    titleBackground.style.opacity = titleOpacityString;
    if (slideAmount > 1) {
      slideAmount = 0.2;
      firstTime = false;
    }
  }
}

function visualWaitTimer() {
  if (timer < 500) timer++;
}

// function controlPanelSlideIn() {
//   if (slideIn === true && slideAmount > 0) {
//     slideAmount -= 5;
//     var slidePC = "translate(" + slideAmount.toString() + "%)";
//     slidersDiv.style("transform", slidePC);
//   } else if (slideIn === false && slideAmount < 150) {
//     slideAmount += 5;
//     var slidePC = "translate(" + slideAmount.toString() + "%)";
//     slidersDiv.style("transform", slidePC);
//   }
// }

function visualisation() {
  // if (
  //   (ampZozo.getLevel() > 0 || ampDave.getLevel() > 0) &&
  //   startVisual === false
  // ) {
  //   startVisual = true;
  // }
  if (!playSelected) {
    clear();
    strokeCap(SQUARE);
    stroke(138, 43, 226, transp);
    // rect(0, 0, width, visualHeight);
    strokeWeight(10);
    animationSpeedCurve = map(visualHeight, 0, width / 4, 0, 1);
    var visualSpeed = map(animationSpeedCurve ** 2, 0, 1, 0, width * 0.4);
    line(0, 5, visualSpeed, 5);
    line(width, 5, width - map(visualSpeed, 0, width * 0.4, 0, width * 0.6), 5);

    if (visualHeight < width * 0.4) {
      visualHeight += 6;
    }
  } else {
    clear();
    var oldXZ = -1000;
    var oldYZ = 0;
    var XZ;
    var YZ;
    for (var i = 4; i < zozoFFT.length - 1; i++) {
      fill(226, 43, 138, transp);
      stroke(226, 43, 138, transp);
      strokeWeight(1);
      XZ = (width / 251) * (i - 4);
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
      XD = (width / 251) * (i - 4);
      YD = map(daveFFT[i], 0, 255, 0, 1) * ampMult - 1 * volumeSliderD.value();
      line(oldXD, oldYD, XD, YD);
      oldXD = XD;
      oldYD = YD;
    }
    visualHeight = 0;
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
        loadAudio(playingDiv);
        startVisual = true;
        slideIn = true;
      } else {
        button[previousPlayingDiv].removeClass("fas fa-stop");
        button[previousPlayingDiv].removeClass("stopButton");
        button[previousPlayingDiv].addClass("fas fa-play");
        button[previousPlayingDiv].addClass("playButton");
        nameD[previousPlayingDiv].removeClass("playPanelD");
        nameZ[previousPlayingDiv].removeClass("playPanelZ");
        queuedTrackDave.stop();
        queuedTrackZozo.stop();
        playSelected = false;
        timer = 0;
        startVisual = false;
        slideIn = false;
      }
    };
  }
}

function loadAudio(day) {
  // zozosounds[day] = loadSound("/Audio/z" + (day + 1).toString() + ".m4a");
  // davesounds[day] = loadSound("/Audio/d" + (day + 1).toString() + ".m4a");
  playAudio(zozosounds[day], davesounds[day]);
  nameD[playingDiv].addClass("playPanelD");
  nameZ[playingDiv].addClass("playPanelZ");
  button[day].removeClass("fas fa-play playButton");
  button[day].addClass("fas fa-stop stopButton");
  if (previousPlayingDiv != undefined && playingDiv != previousPlayingDiv) {
    nameD[previousPlayingDiv].removeClass("playPanelD");
    nameZ[previousPlayingDiv].removeClass("playPanelZ");
    button[previousPlayingDiv].removeClass("fas fa-stop stopButton");
    button[previousPlayingDiv].addClass("fas fa-play playButton");
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
function tidalDocsSearch(string, category, prop) {
  return !tidalDocs[category]
    ? category + " not added"
    : !tidalDocs[category].parameter
    ? prop + " not added"
    : tidalDocs[category].parameter[string]
    ? tidalDocs[category].effects[
        tidalDocs[category].parameter[string].effectName
      ][prop]
    : tidalDocs[category].parameter[tidalDocs[category].alias[string]]
    ? tidalDocs[category].effects[
        tidalDocs[category].parameter[tidalDocs[category].alias[string]]
      ][prop]
    : prop + " not added";
}
