
const path = require('path');
const fs = require('fs');
const glob = require('glob');
const split = require('split');

const FileReader = require('./FileReader');
const FileWriter = require('./FileWriter');
const Game = require('./Game');
const PlayerAction = require('./PlayerAction');
const PlayerRoundEndResult = require('./PlayerRoundEndResult');
const Winner = require('./Winner');

module.exports = class LogParser {
  constructor(options) {
    this.options = options;
    this.games = new Map();
    this.bet = new Map();
    this.buffer = [];
    this.lines = 0;
    this.patterns = {
      table: />>> table (\d+) >>>/,
      round_start: />>> table \d+ >>> new round : 1$/,
      action: />>> event SHOW_ACTION >>>/,
      round_end: />>> event ROUND_END >>>/,
      game_over: />>> event GAME_OVER >>>/,
    };
    this.profile = null;
    this.init();
  }

  init() {
    const cwd = this.options.cwd;
    const filepath = path.join(cwd, '.profile.json');
    this.profile = FileReader.json(filepath);
    this.profile.filepath = filepath;
  }

  parse() {
    const cwd = this.options.cwd;
    const files = glob.sync(this.options.src, { cwd });

    files.forEach(file => {
      console.log(`Parsing file: ${file}`);
      const filepath = path.join(cwd, file);
      const reader = fs.createReadStream(filepath).pipe(split());

      this.lines = 0;

      reader.on('data', line => {
        ++this.lines;
        this.patterns.round_start.test(line) && this.onGameStart(file, line);
        this.patterns.action.test(line) && this.onPlayerAction(line);
        this.patterns.round_end.test(line) && this.onRoundEnd(line);
        this.patterns.game_over.test(line) && this.onGameOver(line);
      });

      reader.on('end', _ => this.onFileEnd());
    });
  }

  onGameStart(source, line) {
    const [ , table ] = line.match(this.patterns.table);
    this.games.set(Number(table), new Game(Number(table), source));
  }

  onPlayerAction(line) {
    const [ , text ] = line.split(this.patterns.action);
    const { data } = JSON.parse(text);
    const { table, players } = data;
    const game = this.games.get(Number(table.tableNumber));
    if (!game) { return; }
    const player = players.find(v => v.playerName === data.action.playerName);
    const action = new PlayerAction(data.action, table, player, this.lines);
    this.bet.set(action.player.name, action.player.bet + action.action.bet);
    game.actions.push(action);
    game.players = players.map(v => v.playerName);
  }

  onRoundEnd(line) {
    const [ , text ] = line.split(this.patterns.round_end);
    const { data } = JSON.parse(text);
    const { table, players } = data;
    const game = this.games.get(Number(table.tableNumber));
    if (!game) { return; }
    players.forEach(player => {
      const bet = this.bet.get(player.playerName);
      const result = new PlayerRoundEndResult(table, player, bet, this.lines);
      game.actions.push(result);
    });
  }

  onGameOver(line) {
    const [ , text ] = line.split(this.patterns.game_over);
    const { data } = JSON.parse(text);
    const { table, players, winners } = data;
    const game = this.games.get(Number(table.tableNumber));
    if (!game) { return; }
    game.winners = winners.map(data => new Winner(data));
    game.players.forEach(player => this.bet.set(player, 0));
    this.buffer.push(game);
    this.buffer.length === this.options.batch && this.flush();
  }

  onFileEnd() {
    this.flush();
  }

  flush() {
    ++this.profile.total;
    const total = this.profile.total;
    const number = String(this.profile.total).padStart(5, '0');
    const rotate = this.options.rotate;
    const base = Math.floor((this.profile.total - 1) / rotate);
    const start = String((base * 20) + 1).padStart(5, '0');
    const end = String((base + 1) * rotate).padStart(5, '0');
    const folder = path.join(this.options.dest, `${start}-${end}`);
    const filename = `${number}.json`;
    const filepath = path.join(folder, filename);
    FileWriter.folder(folder, 0o775);
    FileWriter.json(filepath, this.buffer);
    FileWriter.json(this.profile.filepath, { total });
    this.buffer.splice(0);
    console.log(`File ${filename} created`);
  }
}
