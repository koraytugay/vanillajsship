import gameService from './service/gameService.js';
import shipService from './service/shipService.js';
import boardService from './service/boardService.js';

let currentGame;

function printNewBoard() {
  currentGame = gameService.newGame();
  const board = document.querySelector("#board");
  board.innerHTML = "";
  for (let i = 0; i < currentGame.board.boardSize; i++) {
    for (let j = 0; j < currentGame.board.boardSize; j++) {
      let boardCell = document.createElement("div");
      boardCell.classList.add(...["cell", "noAttempt"]);
      boardCell.id = 'c' + i + j;
      boardCell.addEventListener("click", missileCoordinate)
      board.appendChild(boardCell);
    }
    board.appendChild(document.createElement("br"));
  }
  checkGameIsFinished();
}

function missileCoordinate(evt) {
  const missileCoordinate = evt.target.id.substring(1);
  let [game, isHit] = gameService.sendMissile(currentGame, missileCoordinate);
  currentGame = game;

  evt.target.classList.remove("noAttempt");
  if (!isHit) {
    evt.target.classList.add("missed");
    return;
  }

  evt.target.classList.add("hit");

  // See if the ship sunk..
  currentGame.board.ships.forEach(ship => {
    if (shipService.hasPartOnCoordinate(ship, missileCoordinate)) {
      if (shipService.isSank(ship)) {
        Object.keys(ship.coordinateIsHitByMissileMap).forEach(shipCoordinate => {
          let shipCell = document.querySelector("#c" + shipCoordinate);
          shipCell.classList.remove("hit");
          shipCell.classList.add("sank");
        })
      }
    }
  });

  checkGameIsFinished();
}

function undo() {
  let [game, coordinateToUndo] = gameService.undo(currentGame);
  if (game === null) {
    return;
  }

  let shipCell = document.querySelector("#c" + coordinateToUndo);
  shipCell.classList.remove(...shipCell.classList);
  shipCell.classList.add(...["cell", "noAttempt"]);
  currentGame = game;

  // Make sure if ship has sunk classes, replace them by hit
  currentGame.board.ships.forEach(ship => {
    if (shipService.hasPartOnCoordinate(ship, coordinateToUndo)) {
      // We did undo, ship must not be sunk anymore..
      Object.keys(ship.coordinateIsHitByMissileMap).forEach(shipCoordinate => {
        if (shipCoordinate !== coordinateToUndo) {
          let shipCell = document.querySelector("#c" + shipCoordinate);
          if (shipCell.classList.contains("sank")) {
            shipCell.classList.remove("sank");
            shipCell.classList.add("hit");
          }
        }
      })
    }
  });

  checkGameIsFinished();
}

function redo() {
  let [game, coordinateToMissile, isHit] = gameService.redo(currentGame);
  if (game === null) {
    return;
  }
  let shipCell = document.querySelector("#c" + coordinateToMissile);
  if (isHit) {
    shipCell.classList.add("hit");
  }
  else {
    shipCell.classList.add("missed");
  }

  currentGame.board.ships.forEach(ship => {
    if (shipService.hasPartOnCoordinate(ship, coordinateToMissile)) {
      if (shipService.isSank(ship)) {
        Object.keys(ship.coordinateIsHitByMissileMap).forEach(shipCoordinate => {
          let shipCell = document.querySelector("#c" + shipCoordinate);
          shipCell.classList.remove("hit");
          shipCell.classList.add("sank");
        })
      }
    }
  });

  checkGameIsFinished();
}

function checkGameIsFinished() {
  const infoPanel = document.querySelector("#info");
  const isAllShipsSank = boardService.allShipsSank(currentGame.board)
  if (!isAllShipsSank) {
    infoPanel.classList.add("hidden");
    infoPanel.classList.remove("block");
  } else {
    infoPanel.classList.remove("hidden");
    infoPanel.classList.add("block");
  }
}

document.querySelector("#newGame").addEventListener("click", () => {
  printNewBoard();
});

document.querySelector("#undo").addEventListener("click", () => {
  undo();
});

document.querySelector("#redo").addEventListener("click", () => {
  redo();
});
