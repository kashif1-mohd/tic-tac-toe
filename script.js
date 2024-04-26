// Gameboard module
const Gameboard = (() => {
  let board = ["", "", "", "", "", "", "", "", ""]; // Initialize the game board as an array with 9 empty cells

  // Function to get a copy of the current board state
  const getBoard = () => board.slice();

  // Function to set a marker (X or O) on the board at the specified index
  const setCell = (index, marker) => {
    // Check if the index is valid (between 0 and 8) and the cell is empty
    if (index >= 0 && index <= 8 && board[index] === "") {
      board[index] = marker; // Set the marker on the board
    } else {
      console.log("Invalid move!"); // Log an error message if the move is invalid
    }
  };

  // Function to reset the board to its initial empty state
  const resetBoard = () => {
    board = ["", "", "", "", "", "", "", "", ""];
  };

  // Function to check if there is a winner or a tie
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

    // Loop through each winning combination
    for (let [a, b, c] of winningCombinations) {
      // Check if all three cells in the combination have the same non-empty marker
      if (board[a] !== "" && board[a] === board[b] && board[a] === board[c]) {
        return board[a]; // Return the winning marker
      }
    }

    // If all cells are filled and there is no winner, it's a tie
    if (!board.includes("")) {
      return "tie";
    }

    // If no winner or tie, return null
    return null;
  };

  // Expose the necessary functions to the outside world
  return { getBoard, setCell, resetBoard, checkWinner };
})();

// Player module
const Player = (marker) => {
  // Function to get the player's marker
  const getMarker = () => marker;

  // Expose the getMarker function
  return { getMarker };
};

// Game Controller module
const GameController = (() => {
  let player1, player2, currentPlayer; // Variables to store player objects and the current player

  // Function to set up the game
  const setupGame = () => {
    player1 = Player("X"); // Create player 1 with marker 'X'
    player2 = Player("O"); // Create player 2 with marker 'O'
    currentPlayer = player1; // Set the current player to player 1
    Gameboard.resetBoard(); // Reset the game board
  };

  // Function to make a move on the board
  const makeMove = (index) => {
    Gameboard.setCell(index, currentPlayer.getMarker()); // Set the current player's marker on the board
    const winner = Gameboard.checkWinner(); // Check if there is a winner or a tie
    if (winner) {
      // If there is a winner or a tie, log the result and prompt for a new game
      console.log(
        `Game over! ${
          winner === "tie"
            ? "It's a tie!"
            : `Player ${currentPlayer.getMarker()} wins!`
        }`
      );
      promptNewGame(); // Prompt for a new game
      return;
    }
    // If the game is not over, switch to the other player
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  };

  // Function to render the current board state in the console
  const renderBoard = () => {
    const board = Gameboard.getBoard(); // Get a copy of the current board state
    console.log("Current board:");
    console.log(`${board[0]} | ${board[1]} | ${board[2]}`); // Print the first row
    console.log("-----------");
    console.log(`${board[3]} | ${board[4]} | ${board[5]}`); // Print the second row
    console.log("-----------");
    console.log(`${board[6]} | ${board[7]} | ${board[8]}`); // Print the third row
  };

  // Import the readline module for user input
  const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  // Function to play the game
  const playGame = () => {
    // Prompt the user to enter a cell index
    readline.question(
      `Player ${currentPlayer.getMarker()}, enter a cell index (0-8): `,
      (index) => {
        // Check if the input is a valid cell index
        if (index >= 0 && index <= 8) {
          makeMove(parseInt(index)); // Make the move
          renderBoard(); // Render the updated board state
          playGame(); // Recursively call playGame to continue the game
        } else {
          console.log("Invalid input!"); // Log an error message if the input is invalid
          playGame(); // Recursively call playGame to prompt for a valid input
        }
      }
    );
  };

  // Function to prompt for a new game
  const promptNewGame = () => {
    readline.question("Do you want to play a new game? (y/n): ", (answer) => {
      if (answer.toLowerCase() === "y") {
        setupGame(); // Set up a new game
        renderBoard(); // Render the initial board state
        playGame(); // Start the new game
      } else {
        readline.close(); // Close the readline interface
      }
    });
  };

  // Expose the necessary functions to the outside world
  return { setupGame, makeMove, renderBoard, playGame };
})();

// Set up the game, render the initial board state, and start the game
GameController.setupGame();
GameController.renderBoard();
GameController.playGame();
