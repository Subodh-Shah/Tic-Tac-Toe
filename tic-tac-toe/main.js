// Cell module - handles individual cell logic
function cell() {
	let value = ''; // Default empty cell

	return {
		getValue: () => value,
		setValue: (player) => (value = player),
		isEmpty: () => value === '',
	};
}

// GameBoard module - manages the board's state
function gameBoard() {
	const rows = 3;
	const columns = 3;
	const board = Array.from({ length: rows }, () =>
		Array.from({ length: columns }, () => cell())
	);

	const getBoard = () => board;

	const fillCell = (player, row, column) => {
		if (board[row][column].isEmpty()) {
			board[row][column].setValue(player);
			return true;
		}
		return false;
	};

	return { getBoard, fillCell };
}

// GameController module - manages game logic, players, and turn changes
function gameController(playerOne = 'Subodh', playerTwo = 'Samit') {
	const board = gameBoard();
	const players = [
		{ name: playerOne, symbol: 'O' },
		{ name: playerTwo, symbol: 'X' },
	];
	let activePlayer = players[0];

	const getActivePlayer = () => activePlayer;

	const switchPlayer = () => {
		activePlayer = activePlayer === players[0] ? players[1] : players[0];
	};

	// Play a round by placing the active player's symbol on the board
	const playRound = (row, column) => {
		const success = board.fillCell(activePlayer.symbol, row, column);
		if (success) switchPlayer();
		return success;
	};

	const printNewPlayer = () => `${getActivePlayer().name}'s turn`;

	return {
		playRound,
		getActivePlayer,
		printNewPlayer,
		board: board.getBoard(), // Expose the board state for rendering
	};
}

// To connect with rendering, call renderDom() after initializing the controller
const game = gameController();

function renderDom() {
	const showActivePlayer = document.querySelector('.active');
	const gameBoardDiv = document.querySelector('.board');
	gameBoardDiv.innerHTML = ''; // Clear the board for re-render

	// Display current player's turn
	const isTie = game.board.flat().every((cell) => !cell.isEmpty());
	showActivePlayer.textContent = isTie ? `It's a Tie` : game.printNewPlayer();

	// Render the game board
	game.board.forEach((row, rowIndex) => {
		row.forEach((col, colIndex) => {
			let cellDiv = gameBoardDiv.querySelector(
				`[data-row="${rowIndex}"][data-col="${colIndex}"]`
			);
			if (!cellDiv) {
				cellDiv = document.createElement('div');
				cellDiv.classList.add('cell');
				cellDiv.dataset.row = rowIndex;
				cellDiv.dataset.col = colIndex;
				gameBoardDiv.appendChild(cellDiv);
			}
			cellDiv.textContent = col.getValue(); // Display cell value
		});
	});
}

function setupEventListeners() {
	const gameBoardDiv = document.querySelector('.board');

	gameBoardDiv.addEventListener('click', (event) => {
		const row = parseInt(event.target.dataset.row);
		const col = parseInt(event.target.dataset.col);

		game.playRound(row, col);
		renderDom(); // Update the DOM to reflect the move
	});
}

function winCondition() {
	let winConditions = [];
}

// Initial setup
renderDom();
setupEventListeners();
winCondition();
