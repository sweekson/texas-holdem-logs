
module.exports = class Action {
  constructor(action, player) {
    this.type = action.action;
    action.amount && (this.amount = action.amount);
    this.chips = action.chips;
    this.bet = player.bet;
  }
}