const Player = (name, mark) => {
    return { name, mark };
  }
  
  //global lol
let playerOne = Player("Player 1", "X");
let playerTwo = Player("Player 2", "O");

const gameboard = (() => {
  //initialize board values
  let boardArray = ["", "", "", "", "", "", "", "", ""];
  let winCondition = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
  let p1Turn = true;
  return { boardArray, winCondition, p1Turn };
})();

const displayController = (() => {
  const updateBoard = (e, mark, board) => {
    board[e.target.getAttribute("data-num")] = mark;
    e.target.innerText = `${mark}`;
    e.target.classList.remove("grid-hover");
    return board;
  }

  const showCurrentPlayer = (state, playerName, mark) => {
    state.innerText = `It's ${playerName}'s turn. ${mark}`;
  }

  function refreshPage() {
    window.location.reload();
  }

  const isGameOver = () => {
    gameflow.secondPage.style.display = "none";
    gameflow.gameoverEl.style.display = "flex";
    gameflow.gameoverEl.appendChild(gameflow.state);
    gameflow.gameoverEl.appendChild(gameflow.reset);
  }

  return { updateBoard, showCurrentPlayer, refreshPage, isGameOver };
})();

const gameflow = (() => {
  //vars & selectors &
  let xIsNext = gameboard.p1Turn;
  let board = gameboard.boardArray;
  const squares = document.querySelectorAll("#squares");
  const state = document.querySelector(".game-state");
  const reset = document.querySelector("#reset");
  const play = document.querySelector(".play-btn");
  const firstPage = document.querySelector(".start-game");
  const secondPage = document.querySelector(".play-game");
  const gameoverEl = document.querySelector(".game-over");

  state.innerText = `It's ${playerOne.name}'s turn. ${playerOne.mark}`; //initial gamestate

  //events
  squares.forEach(square => {
    square.addEventListener("click", (e) => { handleClick(e) }, { once: true }); //one click per square only
  });
  reset.addEventListener("click", displayController.refreshPage);
  play.addEventListener("click", () => {
    startGame();
  });
  
  //func()
  const startGame = () => {
    firstPage.style.display = "none";
    secondPage.style.display = "flex";
  }

  const handleClick = (e) => {
    if (xIsNext) {
      e.target.classList.add("X");
      displayController.updateBoard(e, playerOne.mark, board);
      displayController.showCurrentPlayer(state, playerTwo.name, playerTwo.mark);
      xIsNext = false;
      checkWinner(board, state);
    }
    else if (!xIsNext) {
      e.target.classList.add("O");
      displayController.updateBoard(e, playerTwo.mark, board);
      displayController.showCurrentPlayer(state, playerOne.name, playerOne.mark);
      xIsNext = true;
      checkWinner(board, state);
    }
  }

  const checkWinner = (board, state) => {
    let win = gameboard.winCondition;
    let fullBoardCheck = board.filter(element => element === "");
    console.log(fullBoardCheck);
    return (win.forEach(element => {
      let checker = "";
      for (let index = 0; index < 3; index++) {
        checker += board[element[index]];
      }
      if(checker === "XXX") {
        state.innerText = `${playerOne.name} wins! ${playerOne.mark}`;
        return displayController.isGameOver();
      }
      else if (checker === "OOO"){
        state.innerText = `${playerTwo.name} wins! ${playerTwo.mark}`;
        return displayController.isGameOver();
      }
      else if (fullBoardCheck.length === 0){
        state.innerText = "It's a tie! Reset to play again.";
        return displayController.isGameOver();
      }
      else return;
    }));
  }

  return {gameoverEl, secondPage, state, reset};
})();