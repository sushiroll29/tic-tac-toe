const gameboard = (() => {
  const container = document.querySelector(".game-board");
//   let gameBoardGrid = [];

  const getGameBoard = () => gameBoardGrid;

  const createGrid = () => {
    for (let i = 0; i < 9; i++) {
    //   gameBoardGrid.push("");
      const cell = document.createElement("div");
      cell.classList.add("cell");
      container.appendChild(cell);
    }
  };
  return { getGameBoard, createGrid };
})();

const player = (name, mark) => {
  const getName = () => name;
  const getMark = () => mark;
  return { getName, getMark };
};

const FirstPlayer = player("Kirk", "X");
const SecondPlayer = player("Avery", "O");

const game = ((playerOne, playerTwo) => {
  gameboard.createGrid();
  // const board = gameboard.getGameBoard();
  const cells = document.querySelectorAll(".cell");
  const playerOneMark = playerOne.getMark();
  const playerTwoMark = playerTwo.getMark();
  let curentPlayer;
  let playerTwoTurn = false;

  const getCurrentPlayer = () => {
    if (playerTwoTurn) {
      curentPlayer = playerTwo;
    } else {
      curentPlayer = playerOne;
    }
  };
  
  const swapTurn = () => {
    playerTwoTurn = !playerTwoTurn;
    getCurrentPlayer();
  };

  const displayWinner = (winner) => {
    const container = document.querySelector(".container");
    const div = document.createElement("div");
    container.appendChild(div);

    div.textContent = `Congratulations ${winner}!`;
  };

  const endGame = (winner) => {
    displayWinner(winner);
  };

  const checkWinner = (mark, winner) => {
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

    winPossibilities.forEach((possiblity) => {
      let k = 0;
      for (let i = 0; i < possiblity.length; i++) {
        if (cells[possiblity[i]].classList.contains(mark)) {
          k += 1;
        }
      }
      if (k == 3) {
        console.log("w");
        endGame(winner);
      }
    });
  };

  const cellClickHandler = (e) => {
    const cell = e.target;
    getCurrentPlayer();
    // const index = Array.from(e.target.parentNode.children).indexOf(e.target);

    if (playerTwoTurn) {
      cell.textContent = playerTwoMark;
      cell.classList.add("O");
      //   board[index] = 1;
    } else {
      cell.textContent = playerOneMark;
      cell.classList.add("X");
      //   board[index] = 2;
    }
    checkWinner(curentPlayer.getMark(), curentPlayer.getName());
    swapTurn();
  };

  cells.forEach((cell) => {
    cell.addEventListener("click", cellClickHandler, { once: true });
  });
})(FirstPlayer, SecondPlayer);
