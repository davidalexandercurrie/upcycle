var button = [];

function setup() {
  // put setup code here
  var time = new Date();
  var myClock = time.getTime().toString();
  var myDay = Math.floor(myClock / 86400000);
  var daysFromStart = myDay - 18121;
  // var daysFromStart = myDay - 18121;
  for (var i = 0; i < daysFromStart; i++) {
    button[i] = createButton("Day " + (i + 1));
  }
}

function draw() {
  // put drawing code here
}
