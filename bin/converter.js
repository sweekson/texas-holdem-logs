
const path = require('path');
const grab = require('ps-grab');

const LogConverter = require('../model/LogConverter');

class LogFilters {
  winner(data) {
    return data.chips > 3000;
  }
}

class ActionModelHandlers {
  input(original, formatted) {
    const { table, player, action } = original;
    return [].concat(
      player.name.slice(0, 5),
      player.cards,
      table.board,
      table.players,
      player.chips,
      table.bet,
      action.type,
      (player.bet + action.bet),
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
  cwd: path.join(__dirname, '..', 'data/logs'),
  src: '00001-00020/00019.json',
  dest: path.join(__dirname, '..', 'data/train'),
  filters: new LogFilters(),
  handlers: new ActionModelHandlers()
});

converter.convert();
