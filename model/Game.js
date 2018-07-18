
module.exports = class Game {
  constructor(table, source) {
    this.source = source;
    this.table = table;
    this.players = [];
    this.actions = [];
    this.winners = [];
  }
}
