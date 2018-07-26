
const path = require('path');
const glob = require('glob');

const FileReader = require('./FileReader');
const FileWriter = require('./FileWriter');

module.exports = class FileBatcher {
  constructor(options) {
    this.options = options;
    this.buffer = [];
    this.state = {};
  }

  concat() {
    const state = this.state;
    const cwd = this.options.cwd;
    const pattern = this.options.pattern;
    const batch = this.options.batch;
    const files = glob.sync(pattern, { cwd });
    const last = files.length - 1;

    this.reset();

    files.forEach((file, index) => {
      const filepath = path.join(cwd, file);
      const list = FileReader.json(filepath);
      this.buffer = this.buffer.concat(list);
      !state.start && (state.start = index + 1);
      ++state.done;
      (state.done === batch || index === last) && (state.end = index + 1);
      state.start && state.end && this.flush();
    });
  }

  flush() {
    const state = this.state;
    const start = String(state.start).padStart(5, '0');
    const end = String(state.end).padStart(5, '0');
    const prefix = this.options.prefix || '';
    const suffix = this.options.suffix || '';
    const filename = `${prefix}${start}-${end}${suffix}.json`;
    const dest = this.options.dest;
    const filepath = path.join(dest, filename);
    FileWriter.json(filepath, this.buffer, null, 0);
    this.reset();
    console.log(`File ${filename} created`);
  }

  reset() {
    this.state.done = 0;
    this.state.start = 0;
    this.state.end = 0;
    this.buffer.splice(0);
  }
}