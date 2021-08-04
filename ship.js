class Ship {

  coordinateIsHitByMissileMap = {}

  constructor(/** String[] **/ coordinates) {
    for (const coordinate of coordinates) {
      this.coordinateIsHitByMissileMap[coordinate] = false;
    }
  }
}

export default Ship;
