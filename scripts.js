const gameBoard = (() => {
  const board = ["", "", "", "", "", "", "", "", ""];
  const getBoard = () => board.slice();
  const setCell = (index, marker) => {
    if (index >= 0 && index <= 8 && board[index] === "") {
      board[index] = marker;
    } else {
      console.log("Invalid move!");
    }
  };
  const resetBoard = () => {
    board.fill("");
  };
  const checkWinner = () => {
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // Rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // Columns
      [0, 4, 8],
      [2, 4, 6], // Diagonals
    ];
    for (let [a, b, c] of winningCombinations) {
      if (board[a] !== "" && board[a] === board[b] && board[a] === board[c]) {
        return board[a]; // Return the winning marker
      }
    }
    if (!board.includes("")) {
      return "tie";
    }
    return null;
  };
  const renderBoard = (getCurrentPlayer, displayResult, switchPlayer) => {
    const gameBoardElement = document.getElementById("game-board");
    gameBoardElement.innerHTML = ""; // Clear the existing board
    for (let i = 0; i < board.length; i++) {
      const cell = document.createElement("div");
      cell.classList.add("cell"); // Add the 'cell' class
      cell.dataset.index = i;
      cell.textContent = board[i]; // Set the cell content to the corresponding board value
      cell.addEventListener("click", (e) =>
        handleCellClick(e, getCurrentPlayer, displayResult, switchPlayer)
      );
      gameBoardElement.appendChild(cell);
    }
  };
  const handleCellClick = (
    e,
    getCurrentPlayer,
    displayResult,
    switchPlayer
  ) => {
    const index = e.target.dataset.index;
    const marker = getCurrentPlayer().getMarker();
    if (board[index] === "") {
      // Check if the cell is empty
      setCell(index, marker);
      renderBoard(getCurrentPlayer, displayResult, switchPlayer);
      const winner = checkWinner();
      if (winner) {
        displayResult(
          winner === "tie"
            ? "It's a tie"
            : `Player ${getCurrentPlayer().getName()} wins!`
        );
      } else {
        switchPlayer();
      }
    }
  };
  return {
    getBoard,
    setCell,
    resetBoard,
    checkWinner,
    renderBoard,
  };
})();

const Player = (name, marker) => {
  const getName = () => name;
  const getMarker = () => marker;
  return { getName, getMarker };
};

const gameController = (() => {
  let player1, player2, currentPlayer;
  const setupGame = () => {
    const player1Name = document.getElementById("player1").value || "Player 1";
    const player2Name = document.getElementById("player2").value || "Player 2";
    player1 = Player(player1Name, "X");
    player2 = Player(player2Name, "O");
    currentPlayer = player1;
    gameBoard.resetBoard();
    gameBoard.renderBoard(getCurrentPlayer, displayResult, switchPlayer);
    resetResult();
  };
  const switchPlayer = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  };
  const displayResult = (result) => {
    const resultElement = document.getElementById("result");
    resultElement.textContent = result;
  };
  const resetResult = () => {
    const resultElement = document.getElementById("result");
    resultElement.textContent = "";
  };
  const getCurrentPlayer = () => currentPlayer;
  const handleStartGame = () => {
    setupGame();
  };
  const handleResetGame = () => {
    setupGame();
  };
  const init = () => {
    const startGameButton = document.getElementById("start-game");
    const resetGameButton = document.getElementById("reset-game");
    startGameButton.addEventListener("click", handleStartGame);
    resetGameButton.addEventListener("click", handleResetGame);
  };
  return {
    init,
  };
})();

gameController.init();
