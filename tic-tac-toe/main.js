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
	const ROWS = 3;
	const COLUMNS = 3;
	const board = Array.from({ length: ROWS }, () =>
		Array.from({ length: COLUMNS }, () => cell())
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
function gameController(
	playerOne = 'Subodh',
	playerOneSymbol = 'O',
	playerTwo = 'Samit',
	playerTwoSymbol = 'X'
) {
	const board = gameBoard();
	const players = [
		{ name: playerOne, symbol: playerOneSymbol },
		{ name: playerTwo, symbol: playerTwoSymbol },
	];
	let activePlayer = players[0];
	const getPlayers = () => players;
	const getActivePlayer = () => activePlayer;
	const setActivePlayer = () => {
		activePlayer = players[0];
	};

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
		setActivePlayer,
		printNewPlayer,
		getPlayers,
		board: board.getBoard(), // Expose the board state for rendering
	};
}

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

function winChecker(lastPlayerSymbol) {
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
	const flatBoard = game.board.flat().map((cell) => cell.getValue());
	for (let condition of winConditions) {
		if (condition.every((index) => flatBoard[index] === lastPlayerSymbol)) {
			return true;
		}
	}
	return false;
}

let gameOver = false; // Flag to track if the game is over

function gameEventListeners() {
	const gameBoardDiv = document.querySelector('.board');
	const resetButton = document.querySelector('.reset-button');
	const restartButton = document.querySelector('.restart-button');

	gameBoardDiv.addEventListener('click', (event) => {
		if (gameOver) {
			return;
		}
		const row = parseInt(event.target.dataset.row);
		const col = parseInt(event.target.dataset.col);

		// Attempt to play a round and update the board
		const moveSuccessful = game.playRound(row, col);

		if (moveSuccessful) {
			// Update the DOM to reflect the move
			renderDom();

			// Check for a win using the last player's symbol
			const lastPlayerSymbol =
				game.getActivePlayer().symbol === game.getPlayers()[0].symbol
					? game.getPlayers()[1].symbol
					: game.getPlayers()[0].symbol;
			const winner = winChecker(lastPlayerSymbol);

			if (winner) {
				gameOver = true;
				const showActivePlayer = document.querySelector('.active');
				showActivePlayer.textContent = `${
					lastPlayerSymbol === game.getPlayers()[0].symbol
						? game.getPlayers()[0].name
						: game.getPlayers()[1].name
				} Wins`;
			}
		}
	});

	resetButton.addEventListener('click', () => {
		game.board.forEach((row) => {
			row.forEach((cell) => {
				cell.setValue('');
			});
		});
		game.setActivePlayer();
		gameOver = false;
		renderDom();
	});

	restartButton.addEventListener('click', () => {
		window.location.reload();
	});
}

function formEventListener() {
	const gameContainer = document.getElementById('game-container');
	const form = document.querySelector('#form');
	const formContainer = document.querySelector('#form-container');
	const formButton = document.querySelector('.form-button');

	formButton.addEventListener('click', (event) => {
		event.preventDefault(); // Prevent the form from submitting in the traditional way

		const playerOneName = document.querySelector('.player-one-name').value;
		const playerOneSymbol =
			document.querySelector('.player-one-symbol').value;
		const playerTwoName = document.querySelector('.player-two-name').value;
		const playerTwoSymbol =
			document.querySelector('.player-two-symbol').value;

		if (
			playerOneName === '' ||
			playerOneSymbol === '' ||
			playerTwoName === '' ||
			playerTwoSymbol === ''
		) {
			alert('Please enter both player names and symbols');
			return;
		}
		if (
			playerOneName === playerTwoName ||
			playerOneSymbol === playerTwoSymbol
		) {
			alert('Names and symbols should be unique');
			return;
		}
		// Initialize the game with the form inputs
		game = gameController(
			playerOneName,
			playerOneSymbol,
			playerTwoName,
			playerTwoSymbol
		);

		formContainer.style.display = 'none';
		gameContainer.style.display = 'flex';

		form.reset();

		// Render the initial game state
		renderDom();
	});
}

// Start the game
let game = gameController();
formEventListener();
winChecker();
gameEventListeners();
