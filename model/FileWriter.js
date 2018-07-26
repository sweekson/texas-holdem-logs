
const fs = require('fs');
const fx = require('mkdir-recursive');

class FileWriter {}

FileWriter.json = (file, data) => {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
};

FileWriter.folder = (path, mode) => {
  !fs.existsSync(path) && fx.mkdirSync(path, mode);
};

module.exports = FileWriter;
