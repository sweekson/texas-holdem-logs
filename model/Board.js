
module.exports = class Board {
  constructor(board) {
    this.cards = [-1, -1, -1, -1, -1];
    [].splice.call(this.cards, 0, board.length, ...board);
  }
}
