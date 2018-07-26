
const path = require('path');
const glob = require('glob');
const grab = require('ps-grab');

const DynamicRequire = require('../model/DynamicRequire');
const LogConverter = require('../model/LogConverter');
const ModelDataFilters = require('../model/ModelDataFilters');

DynamicRequire.require('*ModelDataHandlers', path.resolve(__dirname, '../model'));

const source = grab('--source');
const pattern = grab('--pattern');
const handler = grab('--handler');
const prefix = grab('--out-prefix');
const suffix = grab('--out-suffix');

if (!source && pattern) { return console.error('Source file is not assigned'); }
if (!handler) { return console.error('Model handler is not assigned'); }

const options = {
  cwd: path.join(__dirname, '..', 'data/logs'),
  dest: path.join(__dirname, '..', 'data/train'),
  filters: new ModelDataFilters(),
  handlers: DynamicRequire.create(`${handler}ModelDataHandlers`),
  prefix,
  suffix,
};
const convert = options => new LogConverter(options).convert();
const foreach = async files => {
  for (const file of files) {
    options.src = file;
    await convert(options);
  }
};

foreach(source ? [source] : glob.sync(pattern, { cwd: options.cwd }));