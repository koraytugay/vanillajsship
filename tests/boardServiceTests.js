import Board from '../src/modal/board.js';
import Ship from '../src/modal/ship.js';
import boardService from '../src/service/boardService.js';

console.log("Running boardServiceTests.js");

// Test addShip
let board = new Board(8);
let ship = new Ship(["00"]);
try {
  boardService.addShip(board, ship);
}
catch (e) {
  alert("Ship was not added!");
}

try {
  boardService.addShip(board, ship);
  alert("Ship was added!");
}
catch (ignored) {
  // This is expected..
}

// Test missileCoordinate
board = new Board(8);
ship = new Ship(["00"]);
boardService.addShip(board, ship);
let isHit = boardService.missileCoordinate(board, "00");
if (!isHit) {
  alert("Should have been hit!");
}
boardService.unMissileCoordinate(board, "00");
if (ship.coordinateIsHitByMissileMap["00"]) {
  alert("Should have been un-missiled!");
}

// Test allShipsSank
board = new Board(2);

boardService.addShip(board, new Ship(["00"]));
boardService.addShip(board, new Ship(["22"]));

boardService.missileCoordinate(board, "00");
if (boardService.allShipsSank(board)) {
  alert("All ships should have not been sunk!");
}

boardService.missileCoordinate(board, "22");
if (!boardService.allShipsSank(board)) {
  alert("All ships should have been sunk!");
}
