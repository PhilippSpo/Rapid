import { Card } from "./Card";
import { CardSet } from "./CardSet";
import { shuffle } from "../utils";

const getNumberOfRowCards = (numberOfPlayers: number) => {
  if (numberOfPlayers <= 2) {
    return 5;
  }
  if (numberOfPlayers <= 3) {
    return 4;
  }
  return 3;
};

export class Deck {
  philgrettoStack: Array<Card | undefined>;
  row: Array<Card | undefined>;
  faceDownReservePile: Card[];
  faceUpDiscardPile: Card[];

  constructor(cardSet: CardSet, numberOfPlayers: number) {
    cardSet.shuffle();
    this.philgrettoStack = cardSet.draw(10);
    this.row = cardSet.draw(getNumberOfRowCards(numberOfPlayers));
    this.faceDownReservePile = cardSet.cards;
    this.faceUpDiscardPile = [];
  }
  drawCardFromRowAtPosition(position: number) {
    this.row[position] = undefined;
  }
  transferCardsFromReserveToDiscardPile(numberOfCardsToMove = 3) {
    if (this.faceDownReservePile.length < numberOfCardsToMove) {
      this.faceDownReservePile = [...this.faceDownReservePile, ...this.faceUpDiscardPile];
      this.faceUpDiscardPile = [];
      shuffle(this.faceDownReservePile);
    }
    const cardsToMove = this.faceDownReservePile.splice(
      -numberOfCardsToMove,
      numberOfCardsToMove
    );
    this.faceUpDiscardPile.push(...cardsToMove);
  }
}
