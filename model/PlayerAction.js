
const Table = require('./Table');
const Player = require('./Player');
const Action = require('./Action');

module.exports = class PlayerAction {
  constructor(action, table, player, lines) {
    this.lines = lines;
    this.table = new Table(table);
    this.player = new Player(player);
    this.action = new Action(action, player);
  }
}
