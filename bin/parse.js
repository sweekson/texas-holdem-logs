
const path = require('path');
const grab = require('ps-grab');

const LogParser = require('../model/LogParser');

const parser = new LogParser({
  cwd: path.join(__dirname, '..', 'data/syslogs'),
  src: grab('--name'),
  dest: path.join(__dirname, '..', 'data/logs'),
  batch: 10,
  rotate: 20
});

parser.parse();
