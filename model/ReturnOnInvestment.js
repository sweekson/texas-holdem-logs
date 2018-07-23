
module.exports = class ReturnOnInvestment {
  constructor(player, table, action) {
    this.investment = player.bet + action.bet;
    this.reward = table.bet - this.investment;
    this.rate = Number((this.reward / this.investment).toFixed(2));
  }
};