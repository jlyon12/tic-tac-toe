// Player Factory
const Player = (name, marker) => ({ name, marker });

const playerA = Player("Jarrett", "X");
const playerB = Player("Ben", "O");

// gameBoard Object
const gameBoard = (() => {
	const board = [];
	for (let i = 0; i < 9; i++) {
		board.push(null);
	}

	const resetBoard = () => {
		for (let i = 0; i < 9; i++) {
			board.fill(null);
		}
	};

	const getBoard = () => board;

	return { resetBoard, getBoard };
})();

const playGame = (() => {
	const newGame = () => {};

	let activePlayer = playerA;
	let gameOver = false;
	let showResult;

	const board = gameBoard.getBoard();

	const alternateTurn = () => {
		// eslint-disable-next-line no-unused-expressions
		activePlayer === playerA
			? (activePlayer = playerB)
			: (activePlayer = playerA);
	};
	const confirmWin = () => {
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
		return winConditions.some((winCond) =>
			winCond.every((index) => board[index] === activePlayer.marker)
		);
	};
	const confirmDraw = () => {
		const fullBoard = !board.some((index) => index === null);
		let isDraw;
		if (fullBoard === true && confirmWin() === false) {
			isDraw = true;
			return isDraw;
		}
	};

	const checkResult = (player) => {
		if (confirmWin() === true) {
			showResult = `GAME OVER: ${player.name} has won. Congratulations!`;
			gameOver = true;
		}
		if (confirmDraw() === true) {
			showResult = `GAME OVER: It's a draw.`;
			gameOver = true;
		}
	};

	const makeMove = (player, index) => {
		if (gameOver === false) {
			if (board[index] === null) {
				board[index] = player.marker;
				checkResult(player);
				alternateTurn();
			}
		}
	};
	const renderBoard = (() => {
		const $cells = document.querySelectorAll(".cell");
		const $gameText = document.querySelector("#gameText");
		$gameText.textContent = `${activePlayer.name}, you are first to play.`;
		$cells.forEach((cell) => {
			cell.addEventListener("click", (e) => {
				const clickedCell = e.target.id;
				makeMove(activePlayer, clickedCell);

				if (gameOver === false) {
					$gameText.textContent = `${activePlayer.name}, it is your turn.`;
				}
				if (gameOver === true) {
					$gameText.textContent = showResult;
				}
				cell.textContent = board[clickedCell];
			});
		});
	})();
	return { activePlayer, alternateTurn, makeMove, newGame, board };
})();
