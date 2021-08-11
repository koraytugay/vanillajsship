import gameService from './service/gameService.js';
import shipService from './service/shipService.js';
import boardService from './service/boardService.js';

let game;

function printNewBoard() {
  game = gameService.newGame();
  const board = document.querySelector("#board");
  board.innerHTML = "";
  for (let i = 0; i < game.board.boardSize; i++) {
    for (let j = 0; j < game.board.boardSize; j++) {
      let boardCell = document.createElement("div");
      boardCell.classList.add(...["cell", "noAttempt"]);
      boardCell.id = 'c' + i + j;
      boardCell.addEventListener("click", missileCoordinate)
      board.appendChild(boardCell);
    }
    board.appendChild(document.createElement("br"));
  }
  updateIsGameFinished();
}

function sinkShip({ coordinateIsHitByMissileMap }) {
  Object.keys(coordinateIsHitByMissileMap).forEach(coordinate => {
    let classList = document.querySelector("#c" + coordinate).classList;
    classList.remove("hit");
    classList.add("sank");
  });
}

function missileCoordinate({target}) {
  const missileCoordinate = target.id.slice(1);
  target.classList.remove("noAttempt");

  let isHit = gameService.sendMissile(game, missileCoordinate);
  if (!isHit) {
    target.classList.add("missed");
    return;
  }
  else {
    target.classList.add("hit");
  }

  // See if there is a ship on the coordinate and if is ship sunk..
  let ship = boardService.findShipOccupyingCoordinateOnBoard(game.board, missileCoordinate);
  if (ship === null || !shipService.isSank(ship)) {
    return;
  }
  sinkShip(ship);

  updateIsGameFinished();
}

function undo() {
  try {
    gameService.undo(game);
  }
  catch (ignored) {
    // There are no moves to undo
    return;
  }

  let undoCoordinate = game.missileHistory[game.currentTimeStamp + 1];
  let cell = document.querySelector("#c" + undoCoordinate);
  cell.classList.remove(...cell.classList);
  cell.classList.add(...["cell", "noAttempt"]);

  let ship = boardService.findShipOccupyingCoordinateOnBoard(game.board, undoCoordinate);
  if (ship) {
    // We did undo, ship must not be sunk anymore..
    Object.keys(ship.coordinateIsHitByMissileMap).forEach(coordinate => {
      if (coordinate !== undoCoordinate) {
        let shipCell = document.querySelector("#c" + coordinate);
        if (shipCell.classList.contains("sank")) {
          shipCell.classList.remove("sank");
          shipCell.classList.add("hit");
        }
      }
    })
  }

  updateIsGameFinished();
}

function redo() {
  try {
    let isHit = gameService.redo(game);
    if (game === null) {
      return;
    }
    let shipCell = document.querySelector("#c" + game.missileHistory[game.currentTimeStamp]);
    if (isHit) {
      shipCell.classList.add("hit");
    }
    else {
      shipCell.classList.add("missed");
    }
  }
  catch (ignored) {
    // No history to redo..
  }

  game.board.ships.forEach(ship => {
    if (shipService.hasPartOnCoordinate(ship, game.missileHistory[game.currentTimeStamp])) {
      if (shipService.isSank(ship)) {
        Object.keys(ship.coordinateIsHitByMissileMap).forEach(shipCoordinate => {
          let shipCell = document.querySelector("#c" + shipCoordinate);
          shipCell.classList.remove("hit");
          shipCell.classList.add("sank");
        })
      }
    }
  });

  updateIsGameFinished();
}

function updateIsGameFinished() {
  const infoPanel = document.querySelector("#info");
  const isAllShipsSank = boardService.allShipsSank(game.board)
  if (!isAllShipsSank) {
    infoPanel.classList.add("hidden");
    infoPanel.classList.remove("block");
  }
  else {
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

printNewBoard();
