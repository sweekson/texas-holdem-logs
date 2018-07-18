
const fs = require('fs');

class FileReader {}

FileReader.json = file => {
  const text = fs.readFileSync(file);
  return JSON.parse(text);
};

module.exports = FileReader;
