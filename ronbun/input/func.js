function choiceColor(code) {
  const phrase = document.querySelector("#phrase");
  phrase.style.color = "#" + code;
}

function choiceFont(font) {
  const phrase = document.querySelector("#phrase");
  phrase.style.fontFamily = font;
}

function choiceLine() {
  const phrase = document.querySelector("#phrase1");
  phrase.style.textDecoration = "underline";
}
function choiceBold() {
  const phrase = document.querySelector("#phrase2");
  phrase.style.fontWeight = "bold";
}
function choiceClearLine() {
  const phrase = document.querySelector("#phrase1");
  phrase.style.textDecoration = "none";
}
function choiceClearBold() {
  const phrase = document.querySelector("#phrase2");
  phrase.style.fontWeight = "normal";
}