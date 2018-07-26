
const path = require('path');
const glob = require('glob');

const modules = {};

module.exports = {
  require(source, cwd) {
    glob.sync(`${source}.js`, { cwd }).forEach(file => {
      const suffix = path.extname(file);
      const basename = path.basename(file, suffix);
      modules[basename] = require(`${cwd}/${file}`);
    });
  },
  create(module, ...args) {
    return new modules[module](...args);
  }
};
