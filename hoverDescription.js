var selectedWord;
var selectedWordDimensions;
var descriptionDiv;
var previousWord;

function mouse_position(e) {
  //get cursor X position
  var positionX = e.clientX;
  //get description div
  descriptionDiv = document.getElementById("descriptionBox");
  //set left position to cursor point
  descriptionDiv.style.left = positionX + "px";
  if (selectedWord) {
    //if cursor is not on selected word, hide description div, else display description div
    if (
      e.clientY > Math.floor(selectedWordDimensions.bottom) ||
      e.clientY <= Math.floor(selectedWordDimensions.top) ||
      positionX < Math.floor(selectedWordDimensions.left) ||
      positionX >= Math.floor(selectedWordDimensions.right)
    ) {
      hideDescription();
    } else {
      if (previousWord) {
        //remove border of previous word
        previousWord.style.border = "none";
        previousWord.style.margin = "0px";
      }
      //make description div visible + add border to selected word
      descriptionDiv.style.visibility = "visible";
      selectedWord.style.border = "2px solid pink";
      selectedWord.style.margin = "-2px";
    }
  }
}

function showDescription(e, category) {
  if (selectedWord) previousWord = selectedWord;
  selectedWord = e;
  //getting description <p> element
  descriptionTag = document.getElementById("descriptionTag");

  //calling dave's function to get description from json and put it in description <p> element
  if (tidalDocsSearch(e.innerHTML, category, "description")) {
    descriptionTag.innerHTML =
      '<h3 style="margin: 0.5em; text-align: center;">' +
      tidalDocsSearch(e.innerHTML, category, "title") +
      "</h3>" +
      tidalDocsSearch(e.innerHTML, category, "description");
  } else {
    //put error message here?
    descriptionTag.innerHTML = e.innerHTML;
  }

  //get dimensions of selected word span
  selectedWordDimensions = selectedWord.getBoundingClientRect();
  //make visible and set top of description div to under selected word
  descriptionDiv.style.visibility = "visible";
  descriptionDiv.style.top = selectedWordDimensions.bottom.toString() + "px";
}

function hideDescription() {
  //hide description div and remove border from selected word
  descriptionDiv.style.visibility = "hidden";
  selectedWord.style.border = "none";
  selectedWord.style.margin = "0px";
}
