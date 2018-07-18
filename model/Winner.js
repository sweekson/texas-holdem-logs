
module.exports = class Winner {
  constructor(data) {
    this.player = data.playerName;
    this.chips = data.chips;
    this.hand = data.hand;
  }
}
