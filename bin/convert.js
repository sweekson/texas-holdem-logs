
const path = require('path');
const glob = require('glob');
const grab = require('ps-grab');

const LogConverter = require('../model/LogConverter');

class LogFilters {
  winner(data) {
    return data.chips > 3000;
  }
}

class ActionModelHandlers {
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

const source = grab('--source');
const pattern = grab('--pattern');
const options = {
  cwd: path.join(__dirname, '..', 'data/logs'),
  dest: path.join(__dirname, '..', 'data/train'),
  filters: new LogFilters(),
  handlers: new ActionModelHandlers()
};
const convert = options => new LogConverter(options).convert();
const foreach = async files => {
  for (const file of files) {
    options.src = file;
    await convert(options);
  }
};

foreach(source ? [source] : glob.sync(pattern, { cwd: options.cwd }));