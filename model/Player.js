
module.exports = class Player {
  constructor(data) {
    this.name = data.playerName;
    this.chips = data.chips;
    this.cards = data.cards;
    this.bet = data.roundBet;
    this.folded = data.folded;
    this.allin = data.allIn;
    this.survive = data.isSurvive;
    this.online = data.isOnline;
    this.human = data.isHuman;
  }
}
