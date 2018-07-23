
module.exports = class PlayerChipsReward {
  constructor(chips, final) {
    this.chips = chips;
    this.final = final;
    this.changes = final - chips;
  }
}