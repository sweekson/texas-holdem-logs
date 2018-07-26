
module.exports = class ModelDataFilters {
  winner(data) {
    return data.chips > 3000;
  }
}