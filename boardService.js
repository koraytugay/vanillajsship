import shipService from './shipService.js';

const boardService = function() {

  function addShip(board, ship) {
    const shipCoordinates = Object.keys(ship.coordinateIsHitByMissileMap);

    for (const existingShipOnBoard of board.ships) {
      if (shipService.isBoundariesOfShipInCoordinates(existingShipOnBoard, shipCoordinates)) {
        return false;
      }
    }

    board.ships.push(ship);
    return true;
  }

  function missileCoordinate(board, coordinate) {
    board.missileAttempts.push(coordinate);

    let isHit = false;
    for (const ship of board.ships) {
      isHit = isHit || shipService.missile(ship, coordinate);
    }

    return isHit;
  }

  function unMissileCoordinate(board, coordinate) {
    board.missileAttempts = board.missileAttempts.filter(item => {
      return item !== coordinate;
    });
    for (const ship of board.ships) {
      shipService.unMissile(ship, coordinate);
    }
  }

  function allShipsSank(board) {
    return board.ships.every(ship => shipService.isSank(ship));
  }

  return {
    addShip,
    missileCoordinate,
    unMissileCoordinate,
    allShipsSank
  }
}();

export default boardService;
