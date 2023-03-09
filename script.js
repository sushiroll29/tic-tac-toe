// GAMEBOARD
const gameboard = (() => {
  const container = document.querySelector(".game-board");

  const getGameBoard = () => container;

  const createGrid = () => {
    for (let i = 0; i < 9; i++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      container.appendChild(cell);
    }
  };

  const resetGrid = () => {
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => {
      cell.remove();
    });
  };

  return { getGameBoard, createGrid, resetGrid };
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
  const startButton = document.querySelector(".start");
  const playButton = document.querySelector(".play-btn");
  const gameDiv = document.querySelector(".game");
  let playerNames = [];

  // using visibility + opacity instead of display:none on some items for animation purposes
  const visiblityOn = (element) => {
    element.style.visibility = "visible";
    element.style.opacity = "1";
  };

  const visiblityOff = (element) => {
    element.style.visibility = "hidden";
    element.style.opacity = "0";
  };

  const displayOff = (element) => {
    element.style.display = "none";
  };

  const displayOn = (element) => {
    element.style.display = "flex";
  };

  const initializeStartScreen = () => {
    const title = document.querySelector(".title");
    visiblityOff(gameDiv);
    visiblityOff(endingButtons);
    displayOff(playerSelection);
    displayOff(playerInfo);
    visiblityOff(playButton);
    visiblityOn(startButton);
    startButton.addEventListener("click", () => {
      visiblityOff(startButton);

      title.classList.add("move-up");
      setTimeout(() => {
        setupScreen();
      }, 0.7 * 1000);
    });
    // fixes the title at the top of the screen
    title.classList.add("fix");
  };

  const initializeGameScreen = () => {
    visiblityOff(endingButtons);
  };

  const setupScreen = () => {
    visiblityOff(playButton);
    visiblityOff(startButton);
    displayOn(playerSelection);

    const playerVsPlayer = document.querySelector("#vs_player");
    const playerVsComputer = document.querySelector("#vs_computer");

    playerVsPlayer.addEventListener("click", () => {
      displayOn(playerInfo);
      visiblityOn(playButton);
    });

    playerVsComputer.addEventListener("click", () => {
      displayOff(playerInfo);
    });

    playButton.addEventListener("click", (e) => {
      e.preventDefault();
      visiblityOn(gameDiv);
      displayOff(playerSelection);
      displayOff(playerInfo);
      visiblityOff(playButton);
      setTimeout(() => {
        gameDiv.classList.add("fade-in");
        game.startGame();
      }, 0.4 * 1000);
    });
  };

  const getPlayerInfo = () => {
    const playerOneInput = document.querySelector("#playerOne");
    const playerTwoInput = document.querySelector("#playerTwo");

    playerOneInput.value
      ? playerNames.push(playerOneInput.value)
      : playerNames.push("Player 1");
    playerTwoInput.value
      ? playerNames.push(playerTwoInput.value)
      : playerNames.push("Player 2");

    return playerNames;
  };

  const displayNextPlayer = (nextPlayer) => {
    visiblityOn(gameInfo);
    gameInfo.textContent = `${nextPlayer}'s turn`;
  };

  const displayWinner = (winner, message) => {
    // if there's no winner and the board is full, log 'tie' message
    winner
      ? (gameInfo.textContent = `${winner} wins!`)
      : (gameInfo.textContent = `${message}`);
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
    visiblityOn,
    initializeStartScreen,
    initializeGameScreen,
    displayNextPlayer,
    displayWinner,
    addCellInteraction,
    removeCellInteraction,
    getPlayerInfo,
  };
})();

// GAME
const game = (() => {
  const playerOne = player("", "X");
  const playerTwo = player("", "O");

  let curentPlayer;
  let playerTwoTurn = false;

  const swapTurn = () => {
    playerTwoTurn = !playerTwoTurn;
    getCurrentPlayer();
  };

  const getCurrentPlayer = () => {
    playerOne.setName(DOMController.getPlayerInfo()[0]);
    playerTwo.setName(DOMController.getPlayerInfo()[1]);
    if (playerTwoTurn) {
      curentPlayer = playerTwo;
      return playerTwo;
    } else {
      curentPlayer = playerOne;
      return playerOne;
    }
  };

  const endGame = (winner) => {
    DOMController.displayWinner(winner);
    DOMController.removeCellInteraction(cellClickHandler);
    resetGame();
    backToMenu();
  };

  const resetGame = () => {
    const resetButton = document.querySelector(".reset-btn");
    const endingButtons = document.querySelector(".ending-btns");
    DOMController.visiblityOn(endingButtons);

    resetButton.addEventListener("click", () => {
      gameboard.resetGrid();
      startGame();
    });
  };

  const backToMenu = () => {
    const menuButton = document.querySelector(".menu-btn");

    menuButton.addEventListener("click", () => {
      // DOMController.setupScreen();
    })
  }

  // checks if all the board cells are filled
  const checkTie = () => {
    const cells = document.querySelectorAll(".cell");
    let cellsArr = Array.from(cells);
    if (cellsArr.every(isCellFilled)) {
      DOMController.displayWinner("", "It's a tie!");
      resetGame();
      // backToMenu();
    }
  };

  const isCellFilled = (cell) => {
    return cell.textContent != "";
  };

  const checkWinner = (mark, winner) => {
    let winnerFlag = false;
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
        endGame(winner);
        winnerFlag = true;
        return true;
      }
    });
    //if no winner was found, check for a tie
    if (!winnerFlag) {
      checkTie();
      return true;
    }
  };

  const cellClickHandler = (e) => {
    const cell = e.target;
    getCurrentPlayer();
    if (playerTwoTurn) {
      cell.textContent = playerTwo.getMark();
      cell.classList.add("O");
      DOMController.displayNextPlayer(playerOne.getMark());
    } else {
      cell.textContent = playerOne.getMark();
      cell.classList.add("X");
      DOMController.displayNextPlayer(playerTwo.getMark());
    }
    //
    checkWinner(curentPlayer.getMark(), curentPlayer.getName());
    swapTurn();
  };

  const startGame = () => {
    DOMController.initializeGameScreen();
    DOMController.displayNextPlayer(playerOne.getMark());
    playerTwoTurn = false;
    gameboard.createGrid();
    DOMController.addCellInteraction(cellClickHandler);
  };

  DOMController.initializeStartScreen();
  return { startGame };
})();
