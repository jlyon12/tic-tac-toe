// Player Factory
const Player = (name, marker) => ({ name, marker });

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

// Logic for playing Tic-Tac-Toe
const gameLogic = (() => {
	const playerA = Player("Player 1", "X");
	const playerB = Player("Player 2", "O");
	let activePlayer = playerA;
	const getActivePlayer = () => activePlayer;
	let firstTurn = true;
	const getFirstTurn = () => firstTurn;
	let gameOver = false;
	const getGameOver = () => gameOver;
	let showResult;
	const getResult = () => showResult;

	const newGame = () => {
		activePlayer = playerA;
		firstTurn = true;
		gameOver = false;
		gameBoard.resetBoard();
	};

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
				firstTurn = false;
			}
		}
	};

	return {
		playerA,
		playerB,
		getActivePlayer,
		getFirstTurn,
		getGameOver,
		getResult,
		board,
		alternateTurn,
		makeMove,
		newGame,
	};
})();

// Update DOM using gameLogic
const displayController = (() => {
	const $title = document.querySelector(".title");
	const $playerOneName = document.getElementById("playerOne");
	const $playerTwoName = document.getElementById("playerTwo");
	const $startGameBtn = document.getElementById("startGameBtn");
	const $newGameModule = document.getElementById("newGameModule");
	const $game = document.getElementById("game");
	const $gameBoard = document.getElementById("gameBoard");
	const $cells = document.querySelectorAll(".cell");
	const $gameText = document.getElementById("gameText");
	const $resetBtn = document.getElementById("resetBtn");
	const $newGameBtn = document.getElementById("newGameBtn");

	const eraseBoard = () => {
		$cells.forEach((cell) => {
			cell.textContent = "";
			cell.classList.remove("X");
			cell.classList.remove("O");
		});
	};
	const updateGameText = () => {
		$gameBoard.classList.remove("fade");
		$gameText.classList.remove("X");
		$gameText.classList.remove("O");
		if (gameLogic.getFirstTurn() === true) {
			$gameText.textContent = `${
				gameLogic.getActivePlayer().name
			}, you are first to play.`;
		} else if (gameLogic.getGameOver() === false) {
			$gameText.textContent = `${
				gameLogic.getActivePlayer().name
			}, it is your turn.`;
		}
		if (gameLogic.getGameOver() === true) {
			$gameText.textContent = gameLogic.getResult();
			$gameBoard.classList.add("fade");
			if (gameLogic.getResult() !== "GAME OVER: It's a draw.") {
				$gameText.classList.add(gameLogic.getActivePlayer().marker);
			}
		}
	};

	$cells.forEach((cell) => {
		cell.addEventListener("click", (e) => {
			const clickedCell = e.target.id;
			gameLogic.makeMove(gameLogic.getActivePlayer(), clickedCell);
			updateGameText();
			cell.textContent = gameLogic.board[clickedCell];
			cell.classList.add(gameLogic.getActivePlayer().marker);
		});
	});
	$startGameBtn.addEventListener("click", (e) => {
		e.preventDefault();
		$title.classList.add("hidden");
		$newGameModule.classList.add("hidden");
		$game.classList.remove("hidden");
		gameLogic.playerA.name = $playerOneName.value || "Player One";
		gameLogic.playerB.name = $playerTwoName.value || "Player Two";
		gameLogic.newGame();
		updateGameText();
		eraseBoard();
	});
	$resetBtn.onclick = () => {
		gameLogic.newGame();
		updateGameText();
		eraseBoard();
	};
	$newGameBtn.onclick = () => {
		$title.classList.remove("hidden");
		$game.classList.add("hidden");
		$newGameModule.classList.remove("hidden");
		$playerOneName.value = null;
		$playerTwoName.value = null;
		gameLogic.newGame();
		eraseBoard();
	};
})();
