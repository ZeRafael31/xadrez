const board = document.getElementById("chessboard");

const pieceImages = {
  "♔": "./image/w_king.png",
  "♕": "./image/w_queen.png",
  "♖": "./image/w_rook.png",
  "♗": "./image/w_bishop.png",
  "♘": "./image/w_knight.png",
  "♙": "./image/w_pawn.png",
  "♚": "./image/b_king.png",
  "♛": "./image/b_queen.png",
  "♜": "./image/b_rook.png",
  "♝": "./image/b_bishop.png",
  "♞": "./image/b_knight.png",
  "♟": "./image/b_pawn.png"
};

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
let currentTurn = 'white';

function isWhite(piece) {
  return "♙♖♘♗♕♔".includes(piece);
}

function isBlack(piece) {
  return "♟♜♞♝♛♚".includes(piece);
}

function isOpponent(p1, p2) {
  return (isWhite(p1) && isBlack(p2)) || (isBlack(p1) && isWhite(p2));
}

function renderBoard() {
  board.innerHTML = "";
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const square = document.createElement("div");
      square.className = `square ${(row + col) % 2 === 0 ? "white" : "black"}`;
      square.dataset.row = row;
      square.dataset.col = col;

      const piece = initialBoard[row][col];
      if (piece) {
        const img = document.createElement("img");
        img.src = pieceImages[piece];
        img.alt = piece;
        img.style.width = "90%";
        img.style.height = "90%";
        square.appendChild(img);
      }

      square.addEventListener("click", onSquareClick);
      board.appendChild(square);
    }
  }
}

function onSquareClick(e) {
  const row = +e.currentTarget.dataset.row;
  const col = +e.currentTarget.dataset.col;
  const piece = initialBoard[row][col];

  if (selected) {
    const { row: fromRow, col: fromCol, piece: selectedPiece } = selected;
    if (isValidMove(selectedPiece, fromRow, fromCol, row, col)) {
      initialBoard[row][col] = selectedPiece;
      initialBoard[fromRow][fromCol] = "";
      currentTurn = currentTurn === 'white' ? 'black' : 'white';
    }
    selected = null;
    renderBoard();
  } else {
    if (piece !== "") {
      if ((currentTurn === 'white' && isWhite(piece)) ||
          (currentTurn === 'black' && isBlack(piece))) {
        selected = { row, col, piece };
        e.currentTarget.classList.add("highlight");
      }
    }
  }
}

function isValidMove(piece, fromRow, fromCol, toRow, toCol) {
  const target = initialBoard[toRow][toCol];
  if (piece === target) return false;
  if (!isOpponent(piece, target) && target !== "") return false;

  const rowDiff = toRow - fromRow;
  const colDiff = toCol - fromCol;

  switch (piece) {
    case "♙":
      if (fromRow === 6 && rowDiff === -2 && colDiff === 0 && initialBoard[5][fromCol] === "" && target === "") return true;
      if (rowDiff === -1 && colDiff === 0 && target === "") return true;
      if (rowDiff === -1 && Math.abs(colDiff) === 1 && isBlack(target)) return true;
      break;
    case "♟":
      if (fromRow === 1 && rowDiff === 2 && colDiff === 0 && initialBoard[2][fromCol] === "" && target === "") return true;
      if (rowDiff === 1 && colDiff === 0 && target === "") return true;
      if (rowDiff === 1 && Math.abs(colDiff) === 1 && isWhite(target)) return true;
      break;
    case "♖":
    case "♜":
      if (fromRow === toRow || fromCol === toCol) {
        if (isPathClear(fromRow, fromCol, toRow, toCol)) return true;
      }
      break;
    case "♘":
    case "♞":
      if ((Math.abs(rowDiff) === 2 && Math.abs(colDiff) === 1) ||
          (Math.abs(rowDiff) === 1 && Math.abs(colDiff) === 2)) return true;
      break;
    case "♗":
    case "♝":
      if (Math.abs(rowDiff) === Math.abs(colDiff)) {
        if (isPathClear(fromRow, fromCol, toRow, toCol)) return true;
      }
      break;
    case "♕":
    case "♛":
      if ((fromRow === toRow || fromCol === toCol || Math.abs(rowDiff) === Math.abs(colDiff)) &&
          isPathClear(fromRow, fromCol, toRow, toCol)) return true;
      break;
    case "♔":
    case "♚":
      if (Math.abs(rowDiff) <= 1 && Math.abs(colDiff) <= 1) return true;
      break;
  }
  return false;
}

function isPathClear(fromRow, fromCol, toRow, toCol) {
  const rowStep = Math.sign(toRow - fromRow);
  const colStep = Math.sign(toCol - fromCol);
  let r = fromRow + rowStep;
  let c = fromCol + colStep;
  while (r !== toRow || c !== toCol) {
    if (initialBoard[r][c] !== "") return false;
    r += rowStep;
    c += colStep;
  }
  return true;
}

renderBoard();
