import shipService from './shipService.js';

const boardService = function() {

  function addShip(board, ship) {
    const shipCoordinates = Object.keys(ship.coordinateIsHitByMissileMap);

    for (const shipOnBoard of board.ships) {
      if (shipService.isShipBoundariesOccupiesCoordinates(shipOnBoard, shipCoordinates)) {
        throw "Ships is in the boundaries of another ship."
      }
    }

    board.ships.push(ship);
  }

  function missileCoordinate(board, coordinate) {
    board.missileAttempts.push(coordinate);
    return board.ships.some(ship => shipService.missile(ship, coordinate));
  }

  function unMissileCoordinate(board, missileCoordinate) {
    board.missileAttempts = board.missileAttempts.filter(boardCoordinate => {
      return boardCoordinate !== missileCoordinate;
    });
    board.ships.forEach(ship => shipService.unMissile(ship, missileCoordinate));
  }

  function allShipsSank(board) {
    return board.ships.every(ship => shipService.isSank(ship));
  }

  function findShipOccupyingCoordinateOnBoard(board, coordinate) {
    let ships = board.ships.filter(ship => Object.keys(ship.coordinateIsHitByMissileMap).includes(coordinate));
    if (ships) {
      return ships[0];
    } else {
      return null;
    }
  }

  return {
    addShip,
    missileCoordinate,
    unMissileCoordinate,
    allShipsSank,
    findShipOccupyingCoordinateOnBoard
  }
}();

export default boardService;
