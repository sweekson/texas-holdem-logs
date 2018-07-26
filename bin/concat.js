
const path = require('path');
const grab = require('ps-grab');

const FileBatcher = require('../model/FileBatcher');

const pattern = grab('--pattern');
const prefix = grab('--out-prefix');
const suffix = grab('--out-suffix');
const batch = grab('--batch') ? Number(grab('--batch')) : 100;
const options = {
  cwd: path.join(__dirname, '..', 'data/train'),
  dest: path.join(__dirname, '..', 'data/train'),
  pattern,
  prefix,
  suffix,
  batch
};
new FileBatcher(options).concat();
