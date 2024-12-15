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
  hand: Card[];
  deliveryStack: Card[];

  constructor(cardSet: CardSet, numberOfPlayers: number) {
    cardSet.shuffle();
    this.philgrettoStack = cardSet.pull(10);
    // TODO number of cards in the row depend on number of players
    this.row = cardSet.pull(getNumberOfRowCards(numberOfPlayers));
    this.hand = cardSet.cards;
    this.deliveryStack = [];
  }
  pullCardFromRowAtPosition(position: number) {
    this.row[position] = undefined;
  }
  moveCardsFromHandToDeliveryStack(numberOfCardsToMove = 3) {
    if (this.hand.length < numberOfCardsToMove) {
      this.hand = [...this.hand, ...this.deliveryStack];
      this.deliveryStack = [];
      shuffle(this.hand);
    }
    const cardsToMove = this.hand.splice(
      -numberOfCardsToMove,
      numberOfCardsToMove
    );
    this.deliveryStack.push(...cardsToMove);
  }
}
