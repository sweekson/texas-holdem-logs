
const fs = require('fs');
const fx = require('mkdir-recursive');

class FileWriter {}

FileWriter.json = (file, data, replacer = null, space = 2) => {
  fs.writeFileSync(file, JSON.stringify(data, replacer, space));
};

FileWriter.folder = (path, mode) => {
  !fs.existsSync(path) && fx.mkdirSync(path, mode);
};

module.exports = FileWriter;
