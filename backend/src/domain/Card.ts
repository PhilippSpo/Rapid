import { CardSetColor } from "./CardSet";

export const colors = ["green", "red", "yellow", "blue"] as const;
export type Color = typeof colors[number];

export class Card {
  cardSetColor: CardSetColor;
  color: Color;
  digit: number;
  constructor(color: Color, digit: number, cardSetColor: CardSetColor) {
    this.color = color;
    this.digit = digit;
    this.cardSetColor = cardSetColor;
  }
}
