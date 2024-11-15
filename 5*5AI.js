const cells = document.querySelectorAll(".cell");
const statusText = document.querySelector("#status");
const restartBtn = document.querySelector("#restartButton");
const winConditions = [
    [0, 1, 2, 3, 4],
    [5, 6, 7, 8, 9],
    [10, 11, 12, 13, 14],
    [15, 16, 17, 18, 19],
    [20, 21, 22, 23, 24],
    [0, 5, 10, 15, 20],
    [1, 6, 11, 16, 21],
    [2, 7, 12, 17, 22],
    [3, 8, 13, 18, 23],
    [4, 9, 14, 19, 24],
    [0, 6, 12, 18, 24],
    [4, 8, 12, 16, 20],
];

let options = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""];
const humanPlayer = "X";
const aiPlayer = "O";
let currentPlayer = humanPlayer;
let running = false;

initialize();

function initialize() {
    if (!cells || !statusText || !restartBtn) {
        console.error("Required DOM elements not found");
        return;
    }

    cells.forEach((cell, index) => {
        cell.setAttribute("cellIndex", index);
        cell.addEventListener("click", clickedCell);
    });
    restartBtn.addEventListener("click", restartGame);
    statusText.textContent = `${currentPlayer}'s turn`;
    running = true;
}

function clickedCell() {
    const indexCell = parseInt(this.getAttribute("cellIndex"));
    if (isNaN(indexCell) || indexCell < 0 || indexCell >= options.length) {
        console.error("Invalid cell index");
        return;
    }
    
    if (options[indexCell] !== "" || !running) {
        return;
    }

    updateCell(this, indexCell, humanPlayer);
    checkWinner();

    if (running && currentPlayer === aiPlayer) {
        const bestMoveIndex = getBestSpot();
        const bestMoveCell = document.querySelector(`[cellIndex='${bestMoveIndex}']`);
        if (bestMoveCell) {
            updateCell(bestMoveCell, bestMoveIndex, aiPlayer);
            checkWinner();
        }
    }
}

function updateCell(cell, indexCell, player) {
    options[indexCell] = player;
    cell.innerHTML = `<span class="cell-text">${player}</span>`;
    currentPlayer = player === humanPlayer ? aiPlayer : humanPlayer;
    statusText.textContent = `${currentPlayer}'s turn`;
}

function checkWinner() {
    let wins = false;
    let winningCombo = null;

    for (let i = 0; i < winConditions.length; ++i) {
        const condition = winConditions[i];
        const cellValues = condition.map(index => options[index]);
        
        if (cellValues.includes("")) continue;
        
        if (cellValues.every(value => value === cellValues[0])) {
            wins = true;
            winningCombo = condition;
            break;
        }
    }

    if (wins) {
        statusText.textContent = `${options[winningCombo[0]]} wins!`;
        running = false;
        highlightWinningCells(winningCombo);
        return true;
    } else if (!options.includes("")) {
        statusText.textContent = `It's a draw!`;
        running = false;
        return true;
    }
    return false;
}

function getBestSpot() {
    const winningMove = findWinningMove(aiPlayer);
    if (winningMove !== -1) return winningMove;

    for (let i = 0; i < winConditions.length; i++) {
        const condition = winConditions[i];
        const cells = condition.map(idx => options[idx]);
        const playerCount = cells.filter(cell => cell === humanPlayer).length;
        const emptyCount = cells.filter(cell => cell === "").length;
        
        if (playerCount === 3 && emptyCount === 2) {
            const emptyIndex = condition[cells.findIndex(cell => cell === "")];
            if (emptyIndex !== -1) return emptyIndex;
        }
    }

    const emptySpots = options.reduce((spots, cell, index) => {
        if (cell === "") spots.push(index);
        return spots;
    }, []);

    return emptySpots[Math.floor(Math.random() * emptySpots.length)];
}


function findWinningMove(player) {
    for (let i = 0; i < winConditions.length; i++) {
        const condition = winConditions[i];
        const cells = condition.map(idx => options[idx]);
        const playerCount = cells.filter(cell => cell === player).length;
        const emptyCount = cells.filter(cell => cell === "").length;
        
        if (playerCount === 4 && emptyCount === 1) {
            return condition[cells.findIndex(cell => cell === "")];
        }
    }
    return -1;
}

function checkWinState(board, player) {
    return winConditions.some(condition => 
        condition.every(index => board[index] === player)
    );
}

function restartGame() {
    options = Array(25).fill("");
    currentPlayer = humanPlayer;
    running = true;
    statusText.textContent = `${currentPlayer}'s turn`;
    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("winning-cell");
    });
}

function highlightWinningCells(combo) {
    combo.forEach(index => {
        const cellText = cells[index].querySelector(".cell-text");
        if (cellText) {
            cellText.classList.add("winning-cell"); 
        }
    });
}