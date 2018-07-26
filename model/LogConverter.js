
const path = require('path');

const FileReader = require('./FileReader');
const FileWriter = require('./FileWriter');
const Poker = require('./Poker');
const Board = require('./Board');

module.exports = class LogConverter {
  constructor(options) {
    this.options = options;
    this.filters = {
      winner: this.options.filters.winner || (_ => true),
    };
    this.inputs = [];
    this.outputs = [];
  }

  convert() {
    const cwd = this.options.cwd;
    const src = this.options.src;
    const filepath = path.join(cwd, src);
    const games = FileReader.json(filepath);
    const winners = new Map();

    games.forEach(game => {
      const players = game.players.length;

      winners.clear();
      game.winners.filter(this.filters.winner).forEach(v => winners.set(v.player, v));

      game.actions.filter(data => winners.has(data.player.name)).filter(v => v.action).forEach(data => {
        const { table, player, action } = data;
        const { rounds, stage } = table;
        const { name, chips, cards } = player;
        const board = new Board(table.board).cards.map(String);
        const original = {
          table: { players, rounds, stage, board, bet: table.bet },
          player: { name, chips, cards, bet: player.bet },
          action: { type: action.type, bet: action.bet }
        };
        const formatted = {
          table: {
            players,
            rounds,
            stage: Poker.stages.indexOf(stage),
            board: board.map(v => Poker.cards.indexOf(v)),
            bet: table.bet
          },
          player: {
            name,
            chips,
            cards: cards.map(v => Poker.cards.indexOf(v)),
            bet: player.bet,
          },
          action: {
            type: Poker.actions.indexOf(action.type),
            bet: action.bet,
          }
        };
        const handlers = this.options.handlers;
        const input = handlers.input(original, formatted);
        const output = handlers.output(original, formatted);

        this.inputs.push(input);
        this.outputs.push(output);
      });
    });

    this.flush();
  }

  exception(message) {
    console.log(`Exception. Message: ${message}`);
  }

  flush() {
    const options = this.options;
    const cwd = options.cwd;
    const src = options.src;
    const source = path.join(cwd, src);
    const suffix = path.extname(source);
    const basename = path.basename(source, suffix);
    const folder = path.dirname(src);
    const dest = path.join(options.dest, folder);
    const filename = {
      inputs: `${basename}.inputs.json`,
      outputs: `${basename}.outputs.json`,
    };
    const filepath = {
      inputs: path.join(dest, filename.inputs),
      outputs: path.join(dest, filename.outputs),
    };
    !FileReader.exists(dest) && FileWriter.folder(dest, 0o775);
    FileWriter.json(filepath.inputs, this.inputs);
    FileWriter.json(filepath.outputs, this.outputs);
    console.log(`File ${filename.inputs} created`);
    console.log(`File ${filename.outputs} created`);
  }
}
