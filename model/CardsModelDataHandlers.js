
module.exports = class CardsModelDataHandlers {
  input(original, formatted) {
    const { table, player } = formatted;
    return [].concat(
      table.players,
      player.cards.map(v => v + 1),
      table.board.map(v => v + 1),
      player.chips,
    );
  }

  output(original, formatted) {
    const { action } = formatted;
    const outputs = [0, 0, 0, 0, 0, 0];
    outputs.splice(action.type, 1, 1);
    return outputs;
  }
}