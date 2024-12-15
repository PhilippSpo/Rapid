import { CardSet, CardSetColor } from "./CardSet";
import { Deck } from "./Deck";

export class Player {
  name: string;
  score: number;
  color: CardSetColor;
  cardSet?: CardSet;
  deck?: Deck;
  isActive = true;
  isReady = false;
  constructor(name: string, color: CardSetColor, numberOfPlayers: number) {
    this.name = name;
    this.color = color;
    this.score = 0;
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
  addScore(score: number) {
    this.score = this.score + score;
  }
  setReady() {
    this.isReady = true;
  }
  setUnready() {
    this.isReady = false;
  }
}
