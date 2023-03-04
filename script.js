const gameboard = (() => {
    const container = document.querySelector('.game-board');
    let gameBoardGrid = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ];

    const createGrid = () => {
        for(let i = 0; i < gameBoardGrid.length; i++){
            for(let j = 0; j < gameBoardGrid[i].length; j++){
                const cell = document.createElement('div');
                cell.classList.add('cell');
                container.appendChild(cell);
            }
        }
    }
return {createGrid}
})();

gameboard.createGrid();

const player = (name, mark) => {
  const getName = () => name;
  const getMark = () => mark;
  return { getName, getMark };
};

const FirstPlayer = player("Kirk", "X");
const SecondPlayer = player("Avery", "O");

const Game = ((player1, player2) => {
    
    let playertTwoTurn = false;
    const cells = document.querySelectorAll(".cell");

    const swapTurn = () => {
        playertTwoTurn = !playertTwoTurn;
    }
    

    const cellClickHandler = (e) => {
        const cell = e.target;
        console.log(cell);
        if(playertTwoTurn){
            cell.textContent = player2.getMark();
            cell.classList.add('O');
        } else {
            cell.textContent = player1.getMark();
            cell.classList.add('X');
        }
        playertTwoTurn ? cell.textContent = player2.getMark() : cell.textContent = player1.getMark();
        swapTurn();
    }

    cells.forEach(cell => {
        cell.addEventListener('click', cellClickHandler, { once: true })
    })
        
    
    


})(FirstPlayer, SecondPlayer);
