const board = document.getElementById("chessboard");
const initialBoard = [
  ["♜","♞","♝","♛","♚","♝","♞","♜"],
  ["♟","♟","♟","♟","♟","♟","♟","♟"],
  ["","","","","","","",""],
  ["","","","","","","",""],
  ["","","","","","","",""],
  ["","","","","","","",""],
  ["♙","♙","♙","♙","♙","♙","♙","♙"],
  ["♖","♘","♗","♕","♔","♗","♘","♖"]
];

let selected = null;

function renderBoard() {
  board.innerHTML = "";
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const square = document.createElement("div");
      square.className = `square ${(row + col) % 2 === 0 ? "white" : "black"}`;
      square.dataset.row = row;
      square.dataset.col = col;
      square.textContent = initialBoard[row][col];
      square.addEventListener("click", onSquareClick);
      board.appendChild(square);
    }
  }
}

function onSquareClick(e) {
  const row = +e.target.dataset.row;
  const col = +e.target.dataset.col;

  if (selected) {
    initialBoard[row][col] = initialBoard[selected.row][selected.col];
    initialBoard[selected.row][selected.col] = "";
    selected = null;
    renderBoard();
  } else {
    if (initialBoard[row][col] !== "") {
      selected = { row, col };
      e.target.classList.add("highlight");
    }
  }
}

renderBoard();