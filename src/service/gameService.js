import Board from '../modal/board.js';
import boardService from './boardService.js';
import Game from '../modal/game.js';
import shipService from './shipService.js';

const gameService = function() {
  // Generates a random number between 0 (inclusive) and max (exclusive)
  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  function newGame() {
    const board = new Board(4 + getRandomInt(5));
    // Try adding a few ships
    for (let i = 1; i < 24; i++) {
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
    let history = game.missileHistory.slice(0, game.currentTimeStamp + 1);
    history.push(coordinate);
    game.missileHistory = history;
    game.currentTimeStamp = game.currentTimeStamp + 1;
    let isHit = boardService.missileCoordinate(game.board, coordinate);
    return [game, isHit];
  }

  function undo(game) {
    if (game.currentTimeStamp === -1) {
      return [null, null];
    }
    let coordinateToUndo = game.missileHistory[game.currentTimeStamp];
    boardService.unMissileCoordinate(game.board, coordinateToUndo);
    game.currentTimeStamp = game.currentTimeStamp - 1;
    debugger;
    return [game, coordinateToUndo];
  }

  function redo(game) {
    if (game.currentTimeStamp === game.missileHistory.length) {
      return [null, null];
    }
    let coordinateToMissile = game.missileHistory[game.currentTimeStamp + 1];
    let isHit = boardService.missileCoordinate(game.board, coordinateToMissile);
    game.currentTimeStamp = game.currentTimeStamp + 1;
    return [game, coordinateToMissile, isHit];
  }

  return {
    newGame,
    sendMissile,
    undo,
    redo
  }
}()

export default gameService;
