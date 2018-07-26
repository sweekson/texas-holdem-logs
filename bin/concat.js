
const path = require('path');
const grab = require('ps-grab');

const FileBatcher = require('../model/FileBatcher');

const pattern = grab('--pattern');
const batch = grab('--batch') || 100;
const options = {
  cwd: path.join(__dirname, '..', 'data/train'),
  dest: path.join(__dirname, '..', 'data/train'),
  pattern,
  batch
};
new FileBatcher(options).concat();
