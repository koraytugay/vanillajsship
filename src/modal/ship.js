export default function Ship(coordinates) {
  this.coordinateIsHitByMissileMap = {};
  coordinates.forEach(coordinate => this.coordinateIsHitByMissileMap[coordinate] = false);
}
