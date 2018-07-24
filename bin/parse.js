
const path = require('path');
const glob = require('glob');
const grab = require('ps-grab');

const LogParser = require('../model/LogParser');

const source = grab('--source');
const pattern = grab('--pattern');
const regress = grab('--regress') !== null;
const options = {
  regress,
  cwd: path.join(__dirname, '..', 'data/syslogs'),
  dest: path.join(__dirname, '..', 'data/logs'),
  batch: 10,
  rotate: 20
};
const parse = options => new LogParser(options).parse();
const foreach = async files => {
  for (const file of files) {
    options.src = file;
    await parse(options);
    options.regress = false;
  }
};

foreach(source ? [source] : glob.sync(pattern, { cwd: options.cwd }));