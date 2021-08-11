import shipService from './shipService.js';

const boardService = function() {

  function addShip({ships}, ship) {
    const shipCoordinates = Object.keys(ship.coordinateIsHitByMissileMap);

    for (const shipOnBoard of ships) {
      if (shipService.isShipBoundariesOccupiesCoordinates(shipOnBoard, shipCoordinates)) {
        throw "Ships is in the boundaries of another ship."
      }
    }

    ships.push(ship);
  }

  function missileCoordinate({ships}, coordinate) {
    return ships.some(ship => shipService.missile(ship, coordinate));
  }

  function unMissileCoordinate({ships}, missileCoordinate) {
    ships.forEach(ship => shipService.unMissile(ship, missileCoordinate));
  }

  function allShipsSank({ships}) {
    return ships.every(ship => shipService.isSank(ship));
  }

  function findShipOccupyingCoordinateOnBoard({ships}, coordinate) {
    let shipOnCoordinate = ships.filter(ship => Object.keys(ship.coordinateIsHitByMissileMap).includes(coordinate));
    if (shipOnCoordinate) {
      return shipOnCoordinate[0];
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
