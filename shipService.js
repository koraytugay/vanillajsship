import Ship from './ship.js';

const shipService = function() {
  // Generates a random number between 0 and max - exclusive.
  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  function newRandomShip(boardSize) {
    const MINIMUM_SHIP_LENGTH = 1;
    const MAXIMUM_SHIP_LENGTH = 4;
    const shipSize = MINIMUM_SHIP_LENGTH + getRandomInt(Math.min(boardSize, MAXIMUM_SHIP_LENGTH));
    const isHorizontal = Math.random() < 0.5;

    let shipCoordinateColumn;
    let shipCoordinateRow;

    if (isHorizontal) {
      shipCoordinateColumn = getRandomInt(boardSize - shipSize + 1);
      shipCoordinateRow = getRandomInt(boardSize);
    }
    else {
      shipCoordinateColumn = getRandomInt(boardSize);
      shipCoordinateRow = getRandomInt(boardSize - shipSize + 1);
    }

    let coordinates = [];
    for (let i = 0; i < shipSize; i++) {
      let coordinate;
      if (isHorizontal) {
        coordinate = (shipCoordinateColumn + i).toString().concat(shipCoordinateRow.toString());
      }
      else {
        coordinate = shipCoordinateColumn.toString().concat((shipCoordinateRow + i).toString());
      }
      coordinates.push(coordinate);
    }

    return new Ship(coordinates);
  }

  function isSank(ship) {
    return Object.values(ship.coordinateIsHitByMissileMap).every(isHit => isHit);
  }

  function missile(ship, coordinate) {
    if (Object.keys(ship.coordinateIsHitByMissileMap).includes(coordinate)) {
      ship.coordinateIsHitByMissileMap[coordinate] = true;
      return true;
    }
    return false;
  }

  function unMissile(ship, coordinate) {
    if (Object.keys(ship.coordinateIsHitByMissileMap).includes(coordinate)) {
      ship.coordinateIsHitByMissileMap[coordinate] = false;
    }
  }

  function hasPartOnCoordinate(ship, coordinate) {
    return Object.keys(ship.coordinateIsHitByMissileMap).includes(coordinate);
  }

  function isBoundariesOfShipInCoordinates(ship, coordinates) {
    let occupiesCoordinate = false;

    Object.keys(ship.coordinateIsHitByMissileMap).forEach(shipCoordinate => {
      [-1, 0, 1].forEach(columnIndex => {
        [-1, 0, 1].forEach(rowIndex => {
          if (coordinates.includes((parseInt(shipCoordinate[0]) + columnIndex).toString().concat(
              (parseInt(shipCoordinate[1]) + rowIndex).toString()))) {
            occupiesCoordinate = true;
          }
        });
      });
    });

    return occupiesCoordinate;
  }

  return {
    isSank,
    missile,
    unMissile,
    hasPartOnCoordinate,
    isBoundariesOfShipInCoordinates,
    newRandomShip
  }
}();

export default shipService;
