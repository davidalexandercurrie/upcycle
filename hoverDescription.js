var selectedWord;
var selectedWordDimensions;
var descriptionDiv;
var previousWord;

function mouse_position(e) {
var positionX = e.clientX;
descriptionDiv = document.getElementById('descriptionBox');
descriptionDiv.style.left = positionX + 'px';
if (selectedWord) {
    if (
      e.clientY > Math.floor(selectedWordDimensions.bottom) ||
      e.clientY <= Math.floor(selectedWordDimensions.top) ||
      positionX < Math.floor(selectedWordDimensions.left) ||
      positionX >= Math.floor(selectedWordDimensions.right)
    ) {
        hideDescription();
    } else {
        if (previousWord) {
            previousWord.style.border = 'none';
            previousWord.style.margin = '0px';
        }
      descriptionDiv.style.visibility = 'visible'
      selectedWord.style.border = '2px solid pink';
      selectedWord.style.margin = '-2px';
    
    }
  }
}

function showDescription(e, category) {
    console.log(e)
    if (selectedWord) previousWord = selectedWord;
    selectedWord = e
    descriptionTitle = document.getElementById('descriptionTitle')
    if (tidalDocsSearch(e.innerHTML, category).description) {
        descriptionTitle.innerHTML = tidalDocsSearch(e.innerHTML, category).description
    }
    selectedWordDimensions = selectedWord.getBoundingClientRect();
    descriptionDiv.style.visibility = 'visible';
    descriptionDiv.style.top = selectedWordDimensions.bottom.toString() + "px"
}

function hideDescription() {
    descriptionDiv.style.visibility = 'hidden'
    selectedWord.style.border = 'none';
    selectedWord.style.margin = '0px';
}