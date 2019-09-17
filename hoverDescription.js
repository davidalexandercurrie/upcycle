var selectedWord;
var descriptionDiv;

function mouse_position(e) {
var positionX = e.clientX;
descriptionDiv = document.getElementById('descriptionBox');
descriptionDiv.style.left = positionX + 'px';
if (selectedWord) {
    if (
      e.clientY > Math.floor(selectedWord.bottom) ||
      e.clientY <= Math.floor(selectedWord.top) ||
      positionX < Math.floor(selectedWord.left) ||
      positionX >= Math.floor(selectedWord.right)
    ) {
      descriptionDiv.style.visibility = 'hidden';
    } else {
      descriptionDiv.style.visibility = 'visible'
    }
  }
}

function showDescription(e) {
    descriptionTitle = document.getElementById('descriptionTitle')
    descriptionTitle.innerHTML = tidalDocsSearch(e.innerHTML).description + '<br>' + '<a href="' + tidalDocsSearch(e.innerHTML).link + '">docs</a>'
    console.log(tidalDocsSearch(e.innerHTML))
    selectedWord = e.getBoundingClientRect();
    descriptionDiv.style.visibility = 'visible';
    descriptionDiv.style.top = selectedWord.bottom.toString() + "px"
}

function hideDescription() {
    descriptionDiv.style.visibility = 'hidden'
}