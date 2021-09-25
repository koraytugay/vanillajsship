import Ship from '../modal/ship.js';

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

function isSank({coordinateIsHitByMissileMap}) {
  return Object.values(coordinateIsHitByMissileMap).every(isHit => isHit);
}

function missile({coordinateIsHitByMissileMap}, coordinate) {
  if (Object.keys(coordinateIsHitByMissileMap).includes(coordinate)) {
    coordinateIsHitByMissileMap[coordinate] = true;
    return true;
  }
  return false;
}

function unMissile({coordinateIsHitByMissileMap}, coordinate) {
  if (Object.keys(coordinateIsHitByMissileMap).includes(coordinate)) {
    coordinateIsHitByMissileMap[coordinate] = false;
  }
}

function hasPartOnCoordinate({coordinateIsHitByMissileMap}, coordinate) {
  return Object.keys(coordinateIsHitByMissileMap).includes(coordinate);
}

function isShipBoundariesOccupiesCoordinates({coordinateIsHitByMissileMap}, coordinates) {
  let occupiesCoordinate = false;

  Object.keys(coordinateIsHitByMissileMap).forEach(shipCoordinate => {
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

// this is exporting an object because it is using export default
// export {isSank, missile, ..} would have just exported a list of values
export default {
  isSank,
  missile,
  unMissile,
  hasPartOnCoordinate,
  isShipBoundariesOccupiesCoordinates,
  newRandomShip
}
