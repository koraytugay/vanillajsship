import shipService from './shipService.js';

function addShip({ships}, ship) {
  const shipCoordinates = Object.keys(ship.coordinateIsHitByMissileMap);

  if (ships.some(ship => shipService.isShipBoundariesOccupiesCoordinates(ship, shipCoordinates))) {
    throw "Ships is in the boundaries of another ship."
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
  let shipOnCoordinate = ships.filter(ship => shipService.hasPartOnCoordinate(ship, coordinate));
  return shipOnCoordinate ? shipOnCoordinate[0] : null;
}

export default {
  addShip,
  missileCoordinate,
  unMissileCoordinate,
  allShipsSank,
  findShipOccupyingCoordinateOnBoard
}
