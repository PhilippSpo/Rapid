import { CardSet, CardSetColor } from "./CardSet";
import { Deck } from "./Deck";

export class Player {
  name: string;
  color: CardSetColor;
  cardSet: CardSet;
  deck: Deck;
  isActive = true;
  constructor(name: string, color: CardSetColor, numberOfPlayers: number) {
    this.name = name;
    this.color = color;
    this.cardSet = new CardSet(color);
    this.deck = new Deck(this.cardSet, numberOfPlayers);
  }
  resetDeck(numberOfPlayers: number) {
    this.cardSet = new CardSet(this.color);
    this.deck = new Deck(this.cardSet, numberOfPlayers);
  }
  setInactive() {
    this.isActive = false;
  }
  setActive() {
    this.isActive = true;
  }
}
