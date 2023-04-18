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
	const board = gameBoard.getBoard();
	const playerA = Player("Player 1", "X");
	let playerB = Player("Player 2", "O");
	let activePlayer = playerA;
	const getActivePlayer = () => activePlayer;
	let winningPlayer;
	const getWinner = () => winningPlayer;
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
	const enableComputer = () => {
		playerB = Player("Computer", "O");
	};
	const disableComputer = () => {
		playerB = Player("Player 2", "O");
	};

	const alternateTurn = () => {
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
			showResult = `GAME OVER: ${player.name} has won!`;
			gameOver = true;
			winningPlayer = player;
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

	const makeComputerMove = () => {
		const possibleMoves = board
			.map((cell, i) => (cell === null ? i : -1))
			.filter((index) => index !== -1);

		const randomMove = () =>
			possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
		if (gameOver === false) {
			board[randomMove()] = playerB.marker;
			checkResult(playerB);
			alternateTurn();
		}
	};
	const playerATurns = () =>
		board.filter((cell) => cell === playerA.marker).length;
	const playerBTurns = () =>
		board.filter((cell) => cell === playerB.marker).length;

	return {
		playerA,
		playerB,
		enableComputer,
		disableComputer,
		getActivePlayer,
		getFirstTurn,
		getGameOver,
		getResult,
		getWinner,
		board,
		makeMove,
		makeComputerMove,
		playerATurns,
		playerBTurns,
		newGame,
	};
})();

// Update DOM using gameLogic
const displayController = (() => {
	const $title = document.querySelector(".title");
	const $playerOneName = document.getElementById("playerOne");
	const $playerTwoName = document.getElementById("playerTwo");
	const $gameType = document.getElementById("gameType");
	const $startGameBtn = document.getElementById("startGameBtn");
	const $newGameModule = document.getElementById("newGameModule");
	const $game = document.getElementById("game");
	const $gameBoard = document.getElementById("gameBoard");
	const $cells = document.querySelectorAll(".cell");
	const $gameText = document.getElementById("gameText");
	const $resetBtn = document.getElementById("resetBtn");
	const $newGameBtn = document.getElementById("newGameBtn");

	$gameType.addEventListener("click", () => {
		if ($gameType.checked) {
			$playerTwoName.value = "Computer";
			$playerTwoName.classList.add("fade");
			$playerTwoName.disabled = true;
			gameLogic.enableComputer();
		} else if (!$gameType.checked) {
			$playerTwoName.value = null;
			$playerTwoName.classList.remove("fade");
			$playerTwoName.disabled = false;
			gameLogic.disableComputer();
		}
	});

	const checkGameType = () => {
		if ($gameType.checked) {
			gameLogic.enableComputer();
			$playerTwoName.value = "Computer";
		} else {
			gameLogic.disableComputer();
		}
	};
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
			if (!$gameType.checked) {
				$gameText.textContent = `${
					gameLogic.getActivePlayer().name
				}, it is your turn.`;
			} else
				$gameText.textContent = `${gameLogic.playerA.name} vs. ${gameLogic.playerB.name}`;
		}
		if (gameLogic.getGameOver() === true) {
			$gameText.textContent = gameLogic.getResult();
			$gameBoard.classList.add("fade");
			if (gameLogic.getResult() !== "GAME OVER: It's a draw.") {
				$gameText.classList.add(gameLogic.getWinner().marker);
			}
		}
	};
	const updateBoard = () => {
		$cells.forEach((cell) => {
			const index = cell.getAttribute("id");
			cell.textContent = gameLogic.board[index];
			cell.classList.add(gameLogic.board[index]);
		});
	};

	$cells.forEach((cell) => {
		cell.addEventListener("click", (e) => {
			const clickedCell = e.target.id;
			gameLogic.makeMove(gameLogic.getActivePlayer(), clickedCell);
			if (
				gameLogic.playerB.name === "Computer" &&
				gameLogic.playerATurns() > gameLogic.playerBTurns()
			) {
				gameLogic.makeComputerMove();
			}

			updateBoard();
			updateGameText();
		});
	});

	$startGameBtn.addEventListener("click", (e) => {
		e.preventDefault();
		$title.classList.add("hidden");
		$newGameModule.classList.add("hidden");
		$game.classList.remove("hidden");
		gameLogic.playerA.name = $playerOneName.value || "Player 1";
		gameLogic.playerB.name = $playerTwoName.value || "Player 2";
		gameLogic.newGame();
		updateGameText();
		eraseBoard();
		checkGameType();
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
		checkGameType();
	};
})();
