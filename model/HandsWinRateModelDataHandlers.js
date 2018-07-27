
const Pokereval = require('./Pokereval');

module.exports = class HandsWinRateModelDataHandlers {
  input(original, formatted) {
    if (original.table.stage !== 'Deal') { return null; }
    const { table, player, action } = original;
    const rate = Pokereval.rate(...player.cards);
    return [].concat(
      table.players,
      Number((rate).toFixed(2)),
      player.chips + action.bet,
    );
  }

  output(original, formatted) {
    if (!original.table.board.length) { return null; }
    const { action } = formatted;
    const outputs = [0, 0, 0, 0, 0, 0];
    outputs.splice(action.type, 1, 1);
    return outputs;
  }
}