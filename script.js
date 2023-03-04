const gameboard = (() => {
  const container = document.querySelector(".game-board");
  let gameBoardGrid = [];

  const getGameBoard = () => gameBoardGrid;

  const createGrid = () => {
    for (let i = 0; i < 9; i++) {
      gameBoardGrid.push("");
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

const game = ((player1, player2) => {
  gameboard.createGrid();
  // const board = gameboard.getGameBoard();
  const cells = document.querySelectorAll(".cell");
  const player1Mark = player1.getMark();
  const player2Mark = player2.getMark();
  let currentMark = "";
  let playertTwoTurn = false;

  if (playertTwoTurn) {
    currentMark = player2Mark;
  } else {
    currentMark = player1Mark;
  }

  const swapTurn = () => {
    playertTwoTurn = !playertTwoTurn;
  };

  const checkWinner = (currentMark) => {
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

    winPossibilities.forEach((set) => {
      let k = 0;
      for (let i = 0; i < set.length; i++) {
        if (cells[set[i]].classList.contains(currentMark)) {
          k += 1;
        }

        if (k == 3) {
          console.log("w");
        }
      }
    });
  };

  const cellClickHandler = (e) => {
    const cell = e.target;
    // const index = Array.from(e.target.parentNode.children).indexOf(e.target);

    if (playertTwoTurn) {
      cell.textContent = player2Mark;
      cell.classList.add("O");
      //   board[index] = 1;
    } else {
      cell.textContent = player1Mark;
      cell.classList.add("X");
      //   board[index] = 2;
    }
    checkWinner(currentMark);
    swapTurn();
  };

  cells.forEach((cell) => {
    cell.addEventListener("click", cellClickHandler, { once: true });
  });
})(FirstPlayer, SecondPlayer);
