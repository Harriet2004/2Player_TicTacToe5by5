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
    [4, 8, 12, 16, 20]
];
let options = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""];
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
        const cellD = options[condition[3]];
        const cellE = options[condition[4]];

        if(cellA == "" || cellB == "" || cellC == "" || cellD == "" || cellE == "") {
            continue
        } 
        if (cellA == cellB && cellB == cellC && cellC == cellD && cellD == cellE) {
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
    options = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""];
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