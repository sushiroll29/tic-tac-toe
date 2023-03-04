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

const Game = ((player1, player2) => {
    gameboard.createGrid();
  let playertTwoTurn = false;
  const cells = document.querySelectorAll(".cell");

  const swapTurn = () => {
    playertTwoTurn = !playertTwoTurn;
  };

  const cellClickHandler = (e) => {
    const cell = e.target;
    const index = Array.from(e.target.parentNode.children).indexOf(e.target);
    const board = gameboard.getGameBoard();

    if (playertTwoTurn) {
      cell.textContent = player2.getMark();
      cell.classList.add("O");
      board[index] = 1;
    } else {
      cell.textContent = player1.getMark();
      cell.classList.add("X");
      board[index] = 2;
    }
    swapTurn();
    console.log(board);
  };

  cells.forEach((cell) => {
    cell.addEventListener("click", cellClickHandler, { once: true });
  });
})(FirstPlayer, SecondPlayer);
