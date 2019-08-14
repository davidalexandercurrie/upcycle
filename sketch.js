var button = [];
var codeSnippets;
var div;

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
    div = createElement("div", [
    //   [createP("")]
    //  [ button[i] = createButton("Day " + (i + 1))]
    //   [button[i].id = i]
    //   [button[i].mousePressed(clickFunctions[button[i].id])]
    //   [createP("zozo")]
    //   [createP(codeSnippets.zozo[i])]
    //   [createP("dave")]
    //   [createP(codeSnippets.dave[i])]
    ])
    createP("");
     button[i] = createButton("Day " + (i + 1));
     button[i].id = i;
     button[i].mousePressed(clickFunctions[button[i].id]);
     createP("zozo");
     createP(codeSnippets.zozo[i])
    createP("dave")
     createP(codeSnippets.dave[i])

  }
}
