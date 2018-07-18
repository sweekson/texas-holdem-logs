
const fs = require('fs');

class FileWriter {}

FileWriter.json = (file, data) => {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
};

FileWriter.folder = (path, mode) => {
  !fs.existsSync(path) && fs.mkdirSync(path, mode);
};

module.exports = FileWriter;
