
const Table = require('./Table');
const Player = require('./Player');
const PlayerChipsReward = require('./PlayerChipsReward');

module.exports = class PlayerRoundEndResult {
  constructor(table, player, bet, lines) {
    this.lines = lines;
    this.table = new Table(table);
    this.player = new Player(player);
    this.reward = new PlayerChipsReward(
      !player.winMoney ? player.chips + bet : player.chips + bet - player.winMoney,
      player.chips
    );
  }
}
