
const path = require('path');
const fs = require('fs');
const glob = require('glob');

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
    const files = glob.sync(this.options.src, { cwd });
    const winners = new Map();

    let exports = 0;

    files.forEach(file => {
      const filepath = path.join(cwd, file);
      const games = FileReader.json(filepath);

      winners.clear();

      games.forEach(game => {
        const players = game.players.length;

        game.winners.filter(this.filters.winner).forEach(v => winners.set(v.player, v));

        game.actions.filter(data => winners.has(data.player.name)).forEach(data => {
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

          exports === 0 && this.inputs.push(input);
          exports === 0 && this.outputs.push(output);
        });

        ++exports;
      });

      this.flush(file);
    });
  }

  exception(message) {
    console.log(`Exception. Message: ${message}`);
  }

  flush(filename) {
    const dest = this.options.dest;
    const inputs = path.join(dest, `${filename}.inputs.json`);
    const outputs = path.join(dest, `${filename}.outputs.json`);
    console.log(inputs, '\n\r');
    this.inputs.forEach((input) => console.log(input.join(', '), '\n\r'));
    // console.log(outputs, this.outputs);
    // FileWriter.json(inputs, this.inputs);
    // FileWriter.json(outputs, this.outputs);
  }
}
