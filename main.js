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
	let winningPlayer;
	let gameOver = false;

	const board = gameBoard.getBoard();

	const alternateTurn = () => {
		// eslint-disable-next-line no-unused-expressions
		activePlayer === playerA
			? (activePlayer = playerB)
			: (activePlayer = playerA);
	};
	const checkWinner = () => {
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
	const makeMove = (player, index) => {
		if (gameOver === false) {
			if (board[index] === null) {
				board[index] = player.marker;
				if (checkWinner() === true) {
					console.log(`GAME OVER ~ ${player.name} has won. Congratulations!`);
					gameOver = true;
					winningPlayer = player;
				}
			}
		} else {
			console.log(
				`INVALID MOVE ~ ${winningPlayer.name} has won already. Please try again. `
			);
		}
	};
	return { activePlayer, alternateTurn, makeMove, newGame };
})();
