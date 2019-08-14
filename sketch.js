var button = [];
var codeSnippets;

function preload() {
  codeSnippets = loadJSON("codeSnippets.json");
}

function setup() {
  // put setup code here
  var time = new Date();
  var myClock = time.getTime().toString();
  var myDay = Math.floor(myClock / 86400000);
  var daysFromStart = myDay - 18118;

  for (var i = 0; i < daysFromStart; i++) {
    createP("");
    button[i] = createButton("Day " + (i + 1));
    button[i].mousePressed();
    createP("zozo");
    createP(codeSnippets.zozo[i]);
    createP("dave");
    createP(codeSnippets.dave[i]);
  }
}
