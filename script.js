// GAMEBOARD
const gameboard = (() => {
  const container = document.querySelector(".game-board");
  let gameBoardGrid = [];

  const getGameBoard = () => container;
  const getGameBoardGrid = () => gameBoardGrid;

  const createGrid = () => {
    let j = 0;

    for (let i = 0; i < 9; i++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      // assign a unique id to each board cell
      cell.setAttribute("id", `${j}`);
      gameBoardGrid.push(j);
      j += 1;
      container.appendChild(cell);
    }
  };

  const resetGrid = () => {
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => {
      cell.remove();
    });
    gameBoardGrid = [];
  };

  const winningGrid = (board, playerMark) => {
    if (
      (board[0] == playerMark &&
        board[1] == playerMark &&
        board[2] == playerMark) ||
      (board[3] == playerMark &&
        board[4] == playerMark &&
        board[5] == playerMark) ||
      (board[6] == playerMark &&
        board[7] == playerMark &&
        board[8] == playerMark) ||
      (board[0] == playerMark &&
        board[3] == playerMark &&
        board[6] == playerMark) ||
      (board[1] == playerMark &&
        board[4] == playerMark &&
        board[7] == playerMark) ||
      (board[2] == playerMark &&
        board[5] == playerMark &&
        board[8] == playerMark) ||
      (board[0] == playerMark &&
        board[4] == playerMark &&
        board[8] == playerMark) ||
      (board[2] == playerMark &&
        board[4] == playerMark &&
        board[6] == playerMark)
    ) {
      return true;
    } else {
      return false;
    }
  };

  return { getGameBoard, getGameBoardGrid, createGrid, resetGrid, winningGrid };
})();

// PLAYER
const player = (name, mark) => {
  const getName = () => name;
  const getMark = () => mark;
  const setName = (newName) => {
    name = newName;
  };
  return { setName, getName, getMark };
};

// DISPLAY CONTROLLER
const DOMController = (() => {
  const endingButtons = document.querySelector(".ending-btns");
  const resetButton = document.querySelector(".reset-btn");
  const gameInfo = document.querySelector(".game-info");
  const playerSelection = document.querySelector(".player-selection");
  const playerInfo = document.querySelector(".player-info");
  const difficultyOption = document.querySelector(".difficulty");
  const startButton = document.querySelector(".start");
  const playButton = document.querySelector(".play-btn");
  const gameDiv = document.querySelector(".game");
  let playerNames = [];
  let vsComputer;
  let difficulty;

  // using visibility + opacity instead of display:none on some items for animation purposes
  const visibilityOn = (element) => {
    element.style.visibility = "visible";
    element.style.opacity = "1";
  };

  const visibilityOff = (element) => {
    element.style.visibility = "hidden";
    element.style.opacity = "0";
  };

  const displayOff = (element) => {
    element.style.display = "none";
  };

  const displayOn = (element) => {
    element.style.display = "flex";
  };

  const startScreen = () => {
    const title = document.querySelector(".title");
    visibilityOff(gameDiv);
    visibilityOff(endingButtons);
    displayOff(playerSelection);
    displayOff(playerInfo);
    displayOff(difficultyOption);
    visibilityOff(playButton);
    visibilityOn(startButton);
    startButton.addEventListener("click", () => {
      visibilityOff(startButton);

      title.classList.add("move-up");
      setTimeout(() => {
        setupScreen();
      }, 0.7 * 1000);
    });
    // fixes the title at the top of the screen
    title.classList.add("fix");
  };

  const setupScreen = () => {
    visibilityOff(playButton);
    visibilityOff(startButton);
    displayOn(playerSelection);

    const playerVsPlayer = document.querySelector("#vs_player");
    const playerVsComputer = document.querySelector("#vs_computer");

    playerVsPlayer.addEventListener("click", () => {
      vsComputer = false;
      displayOn(playerInfo);
      displayOff(difficultyOption);
      visibilityOn(playButton);
    });

    playerVsComputer.addEventListener("click", () => {
      vsComputer = true;
      displayOff(playerInfo);
      displayOn(difficultyOption);
      visibilityOn(playButton);
    });

    playButton.addEventListener("click", (e) => {
      e.preventDefault();
      visibilityOn(gameDiv);
      displayOff(playerSelection);
      displayOff(playerInfo);
      displayOff(difficultyOption);
      visibilityOff(playButton);
      visibilityOff(endingButtons);
      setTimeout(() => {
        gameDiv.classList.add("fade-in");
        game.startGame();
      }, 0.4 * 1000);
    });
  };

  const computerOpponent = () => vsComputer;

  const getNameInfo = () => {
    const optionVsPlayer = document.querySelector("#vs_player");
    if (optionVsPlayer.checked) {
      const playerOneInput = document.querySelector("#playerOne");
      const playerTwoInput = document.querySelector("#playerTwo");

      playerOneInput.value
        ? playerNames.push(playerOneInput.value)
        : playerNames.push("Player 1");
      playerTwoInput.value
        ? playerNames.push(playerTwoInput.value)
        : playerNames.push("Player 2");
    } else {
      playerNames.push("Player", "Computer");
    }

    return playerNames;
  };

  const getDifficultyInfo = () => {
    const optionVsComputer = document.querySelector("#vs_computer");
    if (optionVsComputer.checked) {
      const easyDifficulty = document.querySelector("#easy");
      const hardDifficulty = document.querySelector("#hard");

      if (easyDifficulty.checked) {
        difficulty = "easy";
      } else if (hardDifficulty.checked) {
        difficulty = "hard";
      }
    }
    return difficulty;
  };

  const displayNextPlayer = (nextPlayer) => {
    visibilityOn(gameInfo);
    gameInfo.textContent = `${nextPlayer}'s turn`;
  };

  const displayWinner = (winner, message) => {
    // if there's no winner and the board is full, log 'tie' message
    winner
      ? (gameInfo.textContent = `${winner} wins!`)
      : (gameInfo.textContent = `${message}`);
  };

  const colorWinnerCells = (mark) => {
    const winPossibilities = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    winPossibilities.some((possiblity) => {
      const cells = document.querySelectorAll(".cell");
      // k is a counter that keeps track of how many marks of the same type are placed on the board
      let k = 0;
      let winningCells = [];
      for (let i = 0; i < possiblity.length; i++) {
        //checks if the cells at each index of a possiblity have the same mark => win
        if (cells[possiblity[i]].classList.contains(mark)) {
          k += 1;
          winningCells.push(cells[possiblity[i]]);
        }
      }
      // 3 marks at the correct index combination = win
      if (k == 3) {
        winningCells.forEach(
          (winningCell) =>
            (winningCell.style.backgroundColor = "var(--light-grey)")
        );
      }
    });
  };

  const addCellInteraction = (handlerFunction) => {
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => {
      cell.addEventListener("click", handlerFunction, { once: true });
    });
  };

  const removeCellInteraction = (handlerFunction) => {
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => {
      cell.removeEventListener("click", handlerFunction, { once: true });
    });
  };

  return {
    visibilityOn,
    visibilityOff,
    startScreen,
    displayNextPlayer,
    displayWinner,
    addCellInteraction,
    removeCellInteraction,
    getNameInfo,
    getDifficultyInfo,
    computerOpponent,
    colorWinnerCells,
    setupScreen,
  };
})();

// GAME
const game = (() => {
  const playerOne = player("", "X");
  const playerTwo = player("", "O");

  let board = gameboard.getGameBoardGrid();
  let curentPlayer;
  let playerTwoTurn = false;
  let finishGame = false;

  const startGame = () => {
    DOMController.displayNextPlayer(playerOne.getMark());
    playerTwoTurn = false;
    gameboard.createGrid();
    DOMController.addCellInteraction(cellClickHandler);
  };

  const getCurrentPlayer = () => {
    playerOne.setName(DOMController.getNameInfo()[0]);
    playerTwo.setName(DOMController.getNameInfo()[1]);
    if (playerTwoTurn) {
      curentPlayer = playerTwo;
      return playerTwo;
    } else {
      curentPlayer = playerOne;
      return playerOne;
    }
  };

  const swapTurn = () => {
    playerTwoTurn = !playerTwoTurn;
    getCurrentPlayer();
  };

  const endGame = (player) => {
    DOMController.displayWinner(player);
    DOMController.removeCellInteraction(cellClickHandler);
    resetGame();
    backToStart();
  };

  const resetGame = () => {
    const resetButton = document.querySelector(".reset-btn");
    const endingButtons = document.querySelector(".ending-btns");
    DOMController.visibilityOn(endingButtons);

    resetButton.addEventListener("click", () => {
      DOMController.visibilityOff(endingButtons);
      gameboard.resetGrid();
      board = gameboard.getGameBoardGrid();
      finishGame = false;
      startGame();
    });
  };

  // checks if all the board cells are filled
  const checkTie = () => {
    if (availableCells(board).length === 0) {
      finishGame = true;
      DOMController.displayWinner("", "It's a tie!");
      resetGame();
      backToStart();
    }
  };

  const availableCells = (brd) => {
    return brd.filter((x) => x != "X" && x != "O");
  };

  const cellClickHandler = (e) => {
    const index = Array.from(e.target.parentNode.children).indexOf(e.target);
    const cell = e.target;
    // can only place a mark on a cell once
    if (e.target.textContent === "") {
      getCurrentPlayer();
      if (playerTwoTurn) {
        if (DOMController.computerOpponent()) {
          swapTurn();
        } else {
          // human player 2
          board[index] = "O";
          cell.textContent = playerTwo.getMark();
          cell.classList.add("O");
          DOMController.displayNextPlayer(playerOne.getMark());
        }
      } else {
        board[index] = "X";
        cell.textContent = playerOne.getMark();
        cell.classList.add("X");
        DOMController.displayNextPlayer(playerTwo.getMark());
        // computer player 2
        if (DOMController.computerOpponent()) {
          if (gameboard.winningGrid(board, curentPlayer.getMark())) {
            finishGame = true;
            DOMController.colorWinnerCells(curentPlayer.getMark());
            endGame(curentPlayer.getName());
            return true;
          }
          checkTie();
          if (!finishGame) {
            setTimeout(() => {
              if (DOMController.getDifficultyInfo() === "hard") {
                let AIMoveIndex = AIMove(board, playerTwo).index;
                board[AIMoveIndex] = "O";
                let AIMoveCell = document.getElementById(`${AIMoveIndex}`);
                AIMoveCell.classList.add("O");
                AIMoveCell.textContent = "O";
                endComputerGameCheck(playerTwo, playerOne);
              } else if (DOMController.getDifficultyInfo() === "easy") {
                computerMove();
                endComputerGameCheck(playerTwo, playerOne);
              }
            }, 0.5 * 1000);
          }
        }
      }
      if (gameboard.winningGrid(board, curentPlayer.getMark())) {
        finishGame = true;
        DOMController.colorWinnerCells(curentPlayer.getMark());
        endGame(curentPlayer.getName());
        return;
      }
      checkTie();
      swapTurn();
    }
  };

  const endComputerGameCheck = (currPlayer, otherPlayer) => {
    if (gameboard.winningGrid(board, currPlayer.getMark())) {
      finishGame = true;
      DOMController.colorWinnerCells(currPlayer.getMark());
      endGame(currPlayer.getName());
      return;
    } else {
      DOMController.displayNextPlayer(otherPlayer.getMark());
      checkTie();
      swapTurn();
      return;
    }
  };

  // this is used for the easy difficulty mode
  const computerMove = () => {
    let emptyCells = [...availableCells(board)];
    // gets a random cell from the array of available cells
    let computerMoveIndex =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];
    let computerMoveCell = document.getElementById(`${computerMoveIndex}`);
    computerMoveCell.classList.add("O");
    computerMoveCell.textContent = "O";
    board[computerMoveIndex] = "O";
  };

  //minimax algorithm - used for the hard difficulty mode
  const AIMove = (brd, player) => {
    const emptyCells = availableCells(brd);
    if (gameboard.winningGrid(brd, playerOne.getMark())) {
      return {
        score: -10,
      };
    } else if (gameboard.winningGrid(brd, playerTwo.getMark())) {
      return {
        score: 10,
      };
    } else if (emptyCells.length === 0) {
      return {
        score: 0,
      };
    }

    const moves = [];

    for (let i = 0; i < emptyCells.length; i++) {
      const move = {};
      let recursiveMove;
      move.index = brd[emptyCells[i]];
      brd[emptyCells[i]] = player.getMark();

      if (player == playerTwo) {
        recursiveMove = AIMove(brd, playerOne);
        move.score = recursiveMove.score;
      } else {
        recursiveMove = AIMove(brd, playerTwo);
        move.score = recursiveMove.score;
      }
      brd[emptyCells[i]] = move.index;
      moves.push(move);
    }
    let bestMove;
    if (player == playerTwo) {
      let bestScore = -9999;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score > bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    } else {
      let bestScore = 9999;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score < bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }

    return moves[bestMove];
  };

  const backToStart = () => {
    const backButton = document.querySelector(".back-btn");
    backButton.addEventListener("click", () => {
      location.reload();
    });
  };

  DOMController.startScreen();
  return { startGame };
})();
