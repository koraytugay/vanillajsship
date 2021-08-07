import Ship from '../src/modal/ship.js';
import shipService from '../src/service/shipService.js';

console.log("Running shipServiceTests.js");

// Test isSank
let ship = new Ship(["11"]);
if (shipService.isSank(ship)) {
  alert("Should have not been sank!");
}

ship.coordinateIsHitByMissileMap["11"] = true;
if (!shipService.isSank(ship)) {
  alert("Should have been sank!");
}

// Test missile
ship = new Ship(["11"]);
if (shipService.isSank(ship)) {
  alert("Should have not been sank!");
}

let hit = shipService.missile(ship, "22");
if (hit) {
  alert("Should have not been hit!");
}

if (shipService.isSank(ship)) {
  alert("Should have not been sank!");
}

hit = shipService.missile(ship, "11");
if (!hit) {
  alert("Should have been hit!");
}

if (!shipService.isSank(ship)) {
  alert("Should have been sank!");
}

// Test unMissile
ship = new Ship(["11"]);
ship.coordinateIsHitByMissileMap["11"] = true
if (!shipService.isSank(ship)) {
  alert("Should have been sank!");
}

shipService.unMissile(ship, "11");
if (shipService.isSank(ship)) {
  alert("Should have not been sank!");
}

if (ship.coordinateIsHitByMissileMap["11"]) {
  alert("Should have not been hit!");
}

// Test hasPartOnCoordinate
ship = new Ship(["11"]);
if (shipService.hasPartOnCoordinate(ship, "22")) {
  alert("Should have not had coordinate!");
}

if (!shipService.hasPartOnCoordinate(ship, "11")) {
  alert("Should have had coordinate!");
}

// Test isBoundariesOfShipInCoordinates
ship = new Ship(["44"])
assertInBoundaries(ship, ["33"]);
assertInBoundaries(ship, ["43"]);
assertInBoundaries(ship, ["53"]);

assertInBoundaries(ship, ["34"]);
assertInBoundaries(ship, ["44"]);
assertInBoundaries(ship, ["54"]);

assertInBoundaries(ship, ["35"]);
assertInBoundaries(ship, ["45"]);
assertInBoundaries(ship, ["55"]);

assertNotInBoundaries(ship, ["00"]);
assertNotInBoundaries(ship, ["66"]);

assertInBoundaries(ship, ["00", "55"]);

function assertInBoundaries(ship, coordinates) {
  if (!shipService.isBoundariesOfShipInCoordinates(ship, coordinates)) {
    alert("Should have been in boundaries!");
  }
}

function assertNotInBoundaries(ship, coordinates) {
  if (shipService.isBoundariesOfShipInCoordinates(ship, coordinates)) {
    alert("Should have not been in boundaries!");
  }
}

// Test newRandomShip
const boardSize = 8;
const populatedCoordinates = new Set();
const shipSizes = new Set();

for (let i = 0; i < 1000; i++) {
  const randomShip = shipService.newRandomShip(boardSize);
  shipSizes.add(Object.keys(randomShip.coordinateIsHitByMissileMap).length);
  Object.keys(randomShip.coordinateIsHitByMissileMap).forEach(it => populatedCoordinates.add(it));
}

if (shipSizes.size !== 4) {
  alert("Not all ships generated!");
}

if (shipSizes.has(0)) {
  alert("Ship cannot have a length of 0!");
}

if (shipSizes.has(5)) {
  alert("Ship cannot have a length of 5!");
}


if (populatedCoordinates.size !== 64) {
  alert(`Populated coordinates length was: ${populatedCoordinates.size}`);
}

for (const populatedCoordinate of populatedCoordinates) {
  if (parseInt(populatedCoordinate[0]) > 7 || parseInt(populatedCoordinate[1]) > 7) {
    alert("Populated coordinate must not be greater than 7.")
  }
  if (parseInt(populatedCoordinate[0]) < 0 || parseInt(populatedCoordinate[1]) < 0) {
    alert("Populated coordinate must not be less than 7.")
  }
}
