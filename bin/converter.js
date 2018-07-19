
const path = require('path');
const grab = require('ps-grab');

const LogConverter = require('./model/LogConverter');

class LogFilters {
  winner(data) {
    return data.chips > 3000;
  }
}

class LogHandlers {
  input(original, formatted) {
    const { table, player, action } = original;
    return [].concat(
      player.name.slice(0, 5),
      player.cards,
      table.board,
      table.players,
      player.chips,
      action.type,
      action.bet,
      table.bet,
      (player.bet + action.bet),
      Number(((player.bet + action.bet) / table.bet).toFixed(2)),
    );
  }

  output(original, formatted) {
    const { table, player, action } = original;
    const outputs = [0, 0, 0, 0, 0, 0];
    outputs.splice(formatted.action.type, 1, 1);
    return outputs;
  }
}

const converter = new LogConverter({
  cwd: path.join(__dirname, '/logs/json'),
  src: '00001-00020/00019.json',
  dest: path.join(__dirname, '/train'),
  filters: new LogFilters(),
  handlers: new LogHandlers(),
  model: {
    inputs: [0, 0, 0, 0, 0, 0, 0, 0],
    outputs: [0, 0, 0, 0, 0, 0]
  }
});

converter.convert();