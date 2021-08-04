class Game {
  board;
  missileHistory;
  currentTimeStamp;

  constructor(board) {
    this.board = board;
    this.missileHistory = [];
    this.currentTimeStamp = -1;
  }
}

export default Game;
