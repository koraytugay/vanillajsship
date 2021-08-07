export default function ship(coordinates) {
  this.coordinateIsHitByMissileMap = {};
  for (const coordinate of coordinates) {
    this.coordinateIsHitByMissileMap[coordinate] = false;
  }
}
