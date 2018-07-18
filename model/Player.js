
module.exports = class Player {
  constructor(data) {
    this.name = data.playerName;
    this.chips = data.chips;
    this.cards = data.cards;
    this.bet = data.roundBet;
    this.status = {
      folded: data.folded,
      allin: data.allIn,
      survive: data.isSurvive,
      online: data.isOnline,
      human: data.isHuman
    };
  }
}
