import Board from '../modal/board.js';
import boardService from './boardService.js';
import Game from '../modal/game.js';
import shipService from './shipService.js';

// Generates a random number between 0 (inclusive) and max (exclusive)
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function newGame() {
  const board = new Board(4 + getRandomInt(5));
  // Try adding a few ships
  for (let i = 0; i < (getRandomInt(6) + 6); i++) {
    let ship = shipService.newRandomShip(board.boardSize);
    try {
      boardService.addShip(board, ship);
    }
    catch (ignored) {
      // this is ok..
    }
  }
  return new Game(board);
}

function sendMissile(game, coordinate) {
  game.missileHistory = [...game.missileHistory.slice(0, game.currentTimeStamp + 1), coordinate];
  game.currentTimeStamp++;
  return boardService.missileCoordinate(game.board, coordinate);
}

function undo(game) {
  if (game.currentTimeStamp === -1) {
    throw "There is no history to undo!";
  }
  boardService.unMissileCoordinate(game.board, game.missileHistory[game.currentTimeStamp]);
  game.currentTimeStamp--;
}

function redo(game) {
  if (game.currentTimeStamp === (game.missileHistory.length - 1)) {
    throw "There is no history to redo!";
  }
  game.currentTimeStamp++;
  return boardService.missileCoordinate(game.board, game.missileHistory[game.currentTimeStamp]);
}

export default {
  newGame,
  sendMissile,
  undo,
  redo
}
