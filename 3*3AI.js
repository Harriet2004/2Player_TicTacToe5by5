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

// Define scores for different game outcomes
const scores = {
    X: -10,  // Human wins
    O: 10,   // AI wins
    tie: 0   // Draw
};

let options = ["", "", "", "", "", "", "", "", ""];
let humanPlayer = "X";
let aiPlayer = "O";
let currentPlayer = humanPlayer;
let running = false;

initialize();

function initialize() {
    cells.forEach(cell => cell.addEventListener("click", clickedCell));
    restartBtn.addEventListener("click", restartGame);
    statusText.textContent = `${currentPlayer}'s turn`;
    running = true;
}

function clickedCell() {
    const indexCell = this.getAttribute("cellIndex");
    if (options[indexCell] != "" || !running || currentPlayer !== humanPlayer) {
        return;
    }
    updateCell(this, indexCell);
    
    // Check for a winner after the human moves
    let result = checkWinner();
    if (!result && running) {
        // If no winner yet, it's the AI's turn
        bestMove();
        checkWinner(); // Check for a winner after the AI moves
    }
}

function updateCell(cell, indexCell) {
    options[indexCell] = currentPlayer;
    cell.innerHTML = `<span class="cell-text">${currentPlayer}</span>`;
}

function bestMove() {
    let bestScore = -Infinity;
    let move;

    for (let i = 0; i < options.length; i++) {
        if (options[i] == "") {
            options[i] = aiPlayer;
            let score = minimax(options, 0, false);
            options[i] = "";
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }

    // Make the AI move if a valid move is found
    if (move !== undefined) {
        options[move] = aiPlayer;
        cells[move].innerHTML = `<span class="cell-text">${aiPlayer}</span>`;
        currentPlayer = humanPlayer; // Switch back to the human player
        statusText.textContent = `${currentPlayer}'s turn`;
    }
}

function minimax(board, depth, isMaximizing) {
    let result = checkWinner();
    
    // Base cases
    if (result === aiPlayer) return scores[aiPlayer];
    if (result === humanPlayer) return scores[humanPlayer];
    if (result === "tie") return scores.tie;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] == "") {
                board[i] = aiPlayer;
                let score = minimax(board, depth + 1, false);
                board[i] = "";
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] == "") {
                board[i] = humanPlayer;
                let score = minimax(board, depth + 1, true);
                board[i] = "";
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkWinner() {
    // Check for winner
    for (let i = 0; i < winConditions.length; i++) {
        const [a, b, c] = winConditions[i];
        if (options[a] && options[a] == options[b] && options[b] == options[c]) {
            running = false;
            statusText.textContent = `${options[a]} wins!`;
            return options[a];
        }
    }
    
    // Check for tie
    if (!options.includes("")) {
        running = false;
        statusText.textContent = `It's a draw!`;
        return "tie";
    }
    
    return null; // Explicitly return null if no winner or tie
}

function restartGame() {
    currentPlayer = humanPlayer;
    options = ["", "", "", "", "", "", "", "", ""];
    running = true;
    statusText.textContent = `${currentPlayer}'s turn`;
    cells.forEach(cell => cell.innerHTML = "");
}
