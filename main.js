const board = document.getElementById('board');
let currentPlayer = 'red';
let gameBoard = [
  [], [], [], [], [], [], []
];

function createCell(row, col) {
  const cell = document.createElement('div');
  cell.classList.add('cell');
  cell.dataset.row = row;
  cell.dataset.col = col;
  cell.addEventListener('click', () => dropPiece(col));
  return cell;
}

function dropPiece(col) {
  const row = getAvailableRow(col);
  if (row !== -1) {
    gameBoard[col][row] = currentPlayer;
    const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    cell.classList.add(currentPlayer);
    if (checkWin(col, row)) {
      alert(`${currentPlayer} wins!`);
      resetGame();
      return;
    }
    currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red';
  }
}

function getAvailableRow(col) {
  for (let row = 5; row >= 0; row--) {
    if (!gameBoard[col][row]) {
      return row;
    }
  }
  return -1;
}

function checkWin(col, row) {
  let count = 1;
  count += checkDirection(col, row, 1, 0); // Check right
  count += checkDirection(col, row, -1, 0); // Check left
  if (count >= 4) return true;

  count = 1;
  count += checkDirection(col, row, 0, 1); // Check down
  if (count >= 4) return true;

  count = 1;
  count += checkDirection(col, row, 1, 1); // Check down-right
  count += checkDirection(col, row, -1, -1); // Check up-left
  if (count >= 4) return true;

  count = 1;
  count += checkDirection(col, row, 1, -1); // Check up-right
  count += checkDirection(col, row, -1, 1); // Check down-left
  if (count >= 4) return true;

  saveScore('red');


  return false;

}



function checkDirection(col, row, colDir, rowDir) {
  let count = 0;
  let c = col + colDir;
  let r = row + rowDir;
  while (c >= 0 && c < 7 && r >= 0 && r < 6 && gameBoard[c][r] === currentPlayer) {
    count++;
    c += colDir;
    r += rowDir;
  }
  return count;
}

function resetGame() {
  gameBoard = [
    [], [], [], [], [], [], []
  ];
  currentPlayer = 'red';
  board.innerHTML = '';
  render();
}

function render() {
  for (let col = 0; col < 7; col++) {
    const column = document.createElement('div');
    for (let row = 0; row < 6; row++) {
      gameBoard[col][row] = null;
      column.appendChild(createCell(row, col));
    }
    board.appendChild(column);
  }
}

render();


async function saveScore(winner) {
  try {
    await fetch('http://localhost:3000/api/scores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ winner })
    });
    console.log(`Score enregistré pour ${winner}`);
    displayScores(); // Afficher les scores mis à jour
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement du score :', error);
  }
}

async function displayScores() {
  try {
    const response = await fetch('http://localhost:3000/api/scores');
    const scores = await response.json();
    console.log(`Scores - Jaune: ${scores.yellow}, Rouge: ${scores.red}`);
    // Vous pouvez aussi mettre à jour l'affichage sur la page ici
  } catch (error) {
    console.error('Erreur lors de la récupération des scores :', error);
  }
}
