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
    [6, 4, 2],
];

let options = ["", "", "", "", "", "", "", "", ""];
const humanPlayer = "X";
const aiPlayer = "O";
let currentPlayer = humanPlayer;
let running = false;

initialize();

function initialize() {
    cells.forEach((cell, index) => {
        cell.setAttribute("cellIndex", index);
        cell.addEventListener("click", clickedCell);
    });
    restartBtn.addEventListener("click", restartGame);
    statusText.textContent = `${currentPlayer}'s turn`;
    running = true;
}

function clickedCell() {
    const indexCell = this.getAttribute("cellIndex");
    if (options[indexCell] != "" || !running) {
        return;
    }
    updateCell(this, indexCell, humanPlayer);

    if (!checkWinner() && currentPlayer == aiPlayer) {
        const bestMoveIndex = getBestSpot();
        const bestMoveCell = document.querySelector(`[cellIndex='${bestMoveIndex}']`);
        updateCell(bestMoveCell, bestMoveIndex, aiPlayer);
        checkWinner();
    }
}

function updateCell(cell, indexCell, player) {
    options[indexCell] = player;
    cell.textContent = player;
    cell.innerHTML = `<span class="cell-text">${player}</span>`;
    if (player == humanPlayer) {
        currentPlayer = aiPlayer;
    } else {
        currentPlayer = humanPlayer;
    }
    statusText.textContent = `${currentPlayer}'s turn`;
}

function checkWinner() {
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
        statusText.textContent = `${options[winningCombo[0]]} wins!`; // Use the winner directly from the board
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
    return minimax(options, aiPlayer).index;
}

function minimax(board, player) {
    let availableSpots = [];
    for (let i = 0; i < board.length; i++) {
        if (board[i] == "") {
            availableSpots.push(i);
        }
    }

    if (checkWinState(board, humanPlayer)) return { score: -10 };
    if (checkWinState(board, aiPlayer)) return { score: 10 };
    if (availableSpots.length === 0) return { score: 0 };

    let moves = [];
    for (let i = 0; i < availableSpots.length; i++) {
        const move = {};
        move.index = availableSpots[i];
        board[move.index] = player;

        let nextPlayer;
        if (player == aiPlayer) {
            nextPlayer = humanPlayer;
        } else {
            nextPlayer = aiPlayer;
        }
        const result = minimax(board, nextPlayer);
        move.score = result.score;
        board[move.index] = "";
        moves.push(move);
    }

    let bestMove;
    if (player === aiPlayer) {
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; ++i) {
            const move = moves[i];
            if (move.score > bestScore) {
                bestScore = move.score;
                bestMove = move;
            }
        }
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < moves.length; ++i) {
            const move = moves[i];
            if (move.score < bestScore) {
                bestScore = move.score;
                bestMove = move;
            }
        }
    }
    return bestMove;
}

function checkWinState(board, player) {
    for (let i = 0; i < winConditions.length; ++i) {
        const condition = winConditions[i];
        let allMatch = true;
        for (let i = 0; i < condition.length; ++i) {
            const index = condition[i];
            if (board[index] != player) {
                allMatch = false;
                break;
            }
        }
        if (allMatch) {
            return true;
        }
    }
}


function restartGame() {
    options = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = humanPlayer;
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
            cellText.classList.add("winning-cell"); 
        }
    });
}


