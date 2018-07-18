
module.exports = class Table {
  constructor(data) {
    this.rounds = data.roundCount;
    this.stage = data.roundName;
    this.board = data.board;
    this.bet = data.totalBet;
  }
}
