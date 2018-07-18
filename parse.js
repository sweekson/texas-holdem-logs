
const path = require('path');
const grab = require('ps-grab');

const LogParser = require('./model/LogParser');

const parser = new LogParser({
  cwd: path.join(__dirname, '/logs/raw'),
  src: grab('--name'),
  dest: path.join(__dirname, '/logs/json'),
  batch: 10,
  rotate: 20
});

parser.parse();

