const GameBoard = (() => {
  let board = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => board;
  const setCell = (index, value) => {
    if (board[index] === "") board[index] = value;
  };
  const reset = () => {
    board = ["", "", "", "", "", "", "", "", ""];
  };

  return { getBoard, setCell, reset };
})();

let player1Name = "Player 1";
let player2Name = "Player 2";

const Player = (name, marker) => {
  return { name, marker };
};

let GameController;

function startGame() {
  player1Name = document.getElementById('player1Name').value || "Player 1";
  player2Name = document.getElementById('player2Name').value || "Player 2";
  GameController = (() => {
    const player1 = Player(player1Name, "X");
    const player2 = Player(player2Name, "O");
    let currentPlayer = player1;

    const switchPlayer = () => {
      currentPlayer = currentPlayer === player1 ? player2 : player1;
    };

    const playRound = (index) => {
      GameBoard.setCell(index, currentPlayer.marker);
      switchPlayer();
    };

    const getCurrentPlayer = () => currentPlayer;

    return { playRound, getCurrentPlayer, player1, player2 };
  })();

  GameBoard.reset();
  document.getElementById('setup').style.display = 'none';
  document.getElementById('board').style.display = '';
  document.getElementById('reset').style.display = '';
  renderBoard();
  updateStatus(`${GameController.getCurrentPlayer().name}'s turn (${GameController.getCurrentPlayer().marker})`);
}

// Win/draw detection
function checkWinner(board) {
  const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8], // rows
    [0,3,6],[1,4,7],[2,5,8], // cols
    [0,4,8],[2,4,6]          // diags
  ];
  for (const pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  if (board.every(cell => cell)) return 'draw';
  return null;
}

// UI logic
const boardDiv = document.getElementById('board');
const statusDiv = document.getElementById('status');
const resetBtn = document.getElementById('reset');

function renderBoard() {
  boardDiv.innerHTML = '';
  GameBoard.getBoard().forEach((cell, idx) => {
    const cellDiv = document.createElement('div');
    cellDiv.classList.add('cell');
    cellDiv.textContent = cell;
    cellDiv.addEventListener('click', () => handleCellClick(idx));
    boardDiv.appendChild(cellDiv);
  });
}

function updateStatus(message) {
  statusDiv.textContent = message;
}

function handleCellClick(index) {
  const board = GameBoard.getBoard();
  if (board[index] || checkWinner(board)) return;
  GameController.playRound(index);
  renderBoard();
  const winner = checkWinner(GameBoard.getBoard());
  if (winner === 'draw') {
    updateStatus("It's a draw!");
  } else if (winner) {
    updateStatus(`${winner === 'X' ? GameController.player1.name : GameController.player2.name} wins!`);
  } else {
    updateStatus(`${GameController.getCurrentPlayer().name}'s turn (${GameController.getCurrentPlayer().marker})`);
  }
}

resetBtn.addEventListener('click', () => {
  GameBoard.reset();
  renderBoard();
  updateStatus(`${GameController.getCurrentPlayer().name}'s turn (${GameController.getCurrentPlayer().marker})`);
});

document.getElementById('startBtn').addEventListener('click', startGame);

// Initial state
document.getElementById('board').style.display = 'none';
document.getElementById('reset').style.display = 'none';
updateStatus("Enter player names and start the game!");