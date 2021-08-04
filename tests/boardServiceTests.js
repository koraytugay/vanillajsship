import Board from '../board.js';
import Ship from '../ship.js';
import boardService from '../boardService.js';

console.log("Running boardServiceTests.js");

// Test addShip
let board = new Board(8);
let ship = new Ship(["00"]);
let shipAdded = boardService.addShip(board, ship);
if (!shipAdded) {
  alert("Ship was not added!");
}

shipAdded = boardService.addShip(board, ship);
if (shipAdded) {
  alert("Ship was added!");
}

// Test missileCoordinate
board = new Board(8);
ship = new Ship(["00"]);
boardService.addShip(board, ship);
let isHit = boardService.missileCoordinate(board, "00");
if (!isHit) {
  alert("Should have been hit!");
}
if (!board.missileAttempts.includes("00")) {
  alert("Should have include 00!");
}

// Test unMissileCoordinate
board = new Board(8);
ship = new Ship(["00"]);
boardService.addShip(board, ship);
boardService.missileCoordinate(board, "00");
if (!board.missileAttempts.includes("00")) {
  alert("Should have include 00!");
}
boardService.unMissileCoordinate(board, "00");
if (board.missileAttempts.includes("00")) {
  alert("Should have not include 00!");
}

// Test allShipsSank
board = new Board(2);
console.log(board);

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
