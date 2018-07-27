
const PokerHand = require('poker-hand-evaluator');
const Evaluator = require('./Evaluator');

module.exports = class CardScoreModelDataHandlers {
  input(original, formatted) {
    if (original.table.stage === 'Deal') { return null; }
    const { table, player, action } = original;
    const cards = player.cards.concat(table.board).filter(v => v !== '-1');
    const analysis = new Evaluator().describe(cards);
    const hand = new PokerHand(analysis.best.join(' '));
    return [].concat(
      table.players,
      hand.score,
      player.chips + action.bet,
    );
  }

  output(original, formatted) {
    if (original.table.stage === 'Deal') { return null; }
    const { action } = formatted;
    const outputs = [0, 0, 0, 0, 0, 0];
    outputs.splice(action.type, 1, 1);
    return outputs;
  }
}