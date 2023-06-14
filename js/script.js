/*----- constants -----*/
const COLORS = {
  1: "red",
  "-1": "yellow",
  0: "lightgray",
};

/*----- state variables -----*/
let board; // 2d array to represent the board
let turn; // 1 or -1 to represent whose turn it is
let winner; // null = no winner, 1 = player 1, -1 = player 2, 'T' = tie

/*----- cached elements  -----*/
const msgEl = document.querySelector("h1");
const playBtn = document.querySelector("button");
const markerEls = [...document.querySelectorAll("#markers > div")]; // returns a node list of all elements with class 'marker'

/*----- event listeners -----*/
document.getElementById("markers").addEventListener("click", handleDrop);
playBtn.addEventListener("click", init);

/*----- functions -----*/
init();

// initialize the state variables then call render()
function init() {
  board = [
    // rotate 90 degrees clockwise to visualize
    [0, 0, 0, 0, 0, 0], // column 0
    [0, 0, 0, 0, 0, 0], // column 1
    [0, 0, 0, 0, 0, 0], // column 2
    [0, 0, 0, 0, 0, 0], // column 3
    [0, 0, 0, 0, 0, 0], // column 4
    [0, 0, 0, 0, 0, 0], // column 5
    [0, 0, 0, 0, 0, 0], // column 6
  ];
  turn = 1;
  winner = null;
  for(let i = 0; i < 7; i++){
    for(let j = 0; j < 6; j++){
      const div = document.getElementById(`c${i}r${j}`);
      div.classList.remove("fall"); // remove the fall animation from the cell
    }
  }

  render();
}

// render function
function render() {
  renderBoard();
  renderMessage();
  renderControls(); // hide/show ui elements (controls)
}

// render the board
function renderBoard() {
  board.forEach(function (colArr, colIdx) {
    // colArr = [0, 0, 0, 0, 0, 0], colIdx = 0-6
    colArr.forEach(function (cell, rowIdx) {
      // cell = 1, -1, or 0, row = 0-5
      const div = document.getElementById(`c${colIdx}r${rowIdx}`);
      div.style.backgroundColor = COLORS[cell]; // COLORS[1] = 'red'
    });
  });
}

// render the message
function renderMessage() {
  if (winner === "T") {
    // if winner is 'T'
    msgEl.textContent = "It's a tie!";
  } else if (winner) {
    // if winner is 1 or -1
    msgEl.innerHTML = `<span style="color: ${COLORS[winner]}">${COLORS[
      winner
    ].toUpperCase()}</span> Wins!`;
  } else {
    // if winner is 0
    msgEl.innerHTML = `<span style="color: ${COLORS[turn]}">${COLORS[
      turn
    ].toUpperCase()}</span>'s Turn`;
  }
}

// render the controls
function renderControls() {
  playBtn.style.visibility = winner ? "visible" : "hidden";
  markerEls.forEach(function (marker, colIdx) {
    const hideMarker = !board[colIdx].includes(0) || winner;
    marker.style.visibility = hideMarker ? "hidden" : "visible";
  });
}

// handle a click on the marker
function handleDrop(event) {
    
  const colIdx = markerEls.indexOf(event.target); // find the index of the marker that was clicked
  if (colIdx === -1 || winner) return; // if not a marker or there is a winner, return
  // console.log(colIdx);
  const rowIdx = board[colIdx].indexOf(0); // find the first 0 in the column (somehow js can do this with indexOf)
  // console.log(rowIdx);

  const div = document.getElementById(`c${colIdx}r${rowIdx}`);
  div.classList.add("fall"); // add the fall animation to the cell


  if (rowIdx === -1) return; // if there are no 0's in the column, return
  board[colIdx][rowIdx] = turn; // set the value of the cell to the current turn
  turn *= -1; // switch the turn
  winner = getWinner(colIdx, rowIdx); // check for a winner
  render();
}

// check for a winner
// set winner to 1, -1, 'T', or null
function getWinner(colIdx, rowIdx) {
  return (
    checkVerticalWin(colIdx, rowIdx) ||
    checkHorizontalWin(colIdx, rowIdx) ||
    checkDiagonalWin(colIdx, rowIdx)
  );
}

// count adjacent cells
function countAdjacent(colIdx, rowIdx, colOffset, rowOffset) {
  const player = board[colIdx][rowIdx]; // 1 or -1 (current player)
  let count = 0; // count of adjacent cells
  let rIdx = rowIdx + rowOffset; // row index of adjacent cell
  let cIdx = colIdx + colOffset; // column index of adjacent cell
  while (
    rIdx >= 0 && // greater than surface
    rIdx < board[0].length && // less then board height
    cIdx >= 0 && // greater than surface
    cIdx < board.length && // less than board width
    board[cIdx][rIdx] === player // adjacent cell is the same player
  ) {
    rIdx += rowOffset; // move to next adjacent cell
    cIdx += colOffset; // move to next adjacent cell
    count++; // increment count
  }
  return count; 
}

// check for a vertical win
function checkVerticalWin(colIdx, rowIdx) {
  return countAdjacent(colIdx, rowIdx, 0, -1) === 3
    ? board[colIdx][rowIdx]
    : null; // check for 3 below
}

// check for a horizontal win
function checkHorizontalWin(colIdx, rowIdx) {
  return countAdjacent(colIdx, rowIdx, 1, 0) +
    countAdjacent(colIdx, rowIdx, -1, 0) ===
    3
    ? board[colIdx][rowIdx]
    : null; // check for 3 to the left and right
}

//check for a diagonal win
function checkDiagonalWin(colIdx, rowIdx) {
  return countAdjacent(colIdx, rowIdx, 1, 1) + // check north east
    countAdjacent(colIdx, rowIdx, -1, -1) === // check south west
    3 ||
    countAdjacent(colIdx, rowIdx, 1, -1) + // check south east
      countAdjacent(colIdx, rowIdx, -1, 1) ===  // check north west
      3
    ? board[colIdx][rowIdx]
    : null; // check for 3 diagonally
}
