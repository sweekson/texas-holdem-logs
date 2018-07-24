
const fs = require('fs');

class FileReader {}

FileReader.json = file => {
  const text = fs.readFileSync(file);
  return JSON.parse(text);
};

FileReader.exists = file => fs.existsSync(file);

module.exports = FileReader;
