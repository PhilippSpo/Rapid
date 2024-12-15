import { Card, Color, colors } from "./Card";
import { shuffle } from "../utils";

export const cardSetColors = ["pink", "lightgreen", "brown", "purple", "orange"] as const;
export type CardSetColor = typeof cardSetColors[number];

export class CardSet {
  color: CardSetColor;
  cards: Card[];
  constructor(color: CardSetColor) {
    this.color = color;
    this.cards = colors.flatMap((cardColor) =>
      Array.from({ length: 10 }).map(
        (_, index) => new Card(cardColor, index + 1, color)
      )
    );
  }
  shuffle() {
    shuffle(this.cards);
  }
  pull(numberOfCardsToPull: number) {
    return this.cards.splice(0, numberOfCardsToPull);
  }
}
