
module.exports = class Game {
  constructor(table, source) {
    this.id = 0;
    this.source = source;
    this.table = { number: table, rounds: 0 };
    this.players = [];
    this.actions = [];
    this.winners = [];
  }
}
