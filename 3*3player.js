const cells = document.querySelectorAll(".cell");
const statusText = document.querySelector("#status");
const restartBtn = document.querySelector("#restartButton");
const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];
let options = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let running = false;

initialize();

function initialize() {
    cells.forEach(cell => cell.addEventListener("click", clickedCell));
    restartBtn.addEventListener("click",restartGame);
    statusText.textContent = `${currentPlayer}'s turn`;
    running = true;
}

function clickedCell() {
    const indexCell = this.getAttribute("cellIndex");
    if (options[indexCell] != "" || !running) {
        return;
    }
    updateCell(this, indexCell);
    winner();
}

function updateCell(cell, indexCell) {
    options[indexCell] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.innerHTML = `<span class="cell-text">${currentPlayer}</span>`;
}

function changePlayer() {
    if (currentPlayer == "X") {
        currentPlayer = "O";
    } else {
        currentPlayer = "X";
    }
    statusText.textContent = `${currentPlayer}'s turn`;
}

function winner() {
    let wins = false;
    let winningCombo = null;
    
    for (let i = 0; i < winConditions.length; ++i) {
        const condition = winConditions[i];
        const cellA = options[condition[0]];
        const cellB = options[condition[1]];
        const cellC = options[condition[2]];

        if (cellA == "" || cellB == "" || cellC == "") {
            continue
        } 
        if (cellA == cellB && cellB == cellC) {
            wins = true;
            winningCombo = condition;
            break;
        }
    }

    if (wins == true) {
        statusText.textContent = `${currentPlayer} wins`;
        running = false;
        highlightWinningCells(winningCombo);
    } else if (!options.includes("")) { 
        statusText.textContent = `It's a draw`;
        running = false;
    } else {
        changePlayer()
    }
}

function restartGame() {
    currentPlayer = "X";
    options = ["", "", "", "", "", "", "", "", ""];
    running = true;
    statusText.textContent = `${currentPlayer}'s turn`;
    cells.forEach(cell => cell.textContent = "");
    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("winning-cell");
    });
}

function highlightWinningCells(combo) {
    combo.forEach(index => {
        const cellText = cells[index].querySelector(".cell-text");
        if (cellText) {
            cellText.classList.add("winning-cell"); // Apply glow only to text
        }
    });
}