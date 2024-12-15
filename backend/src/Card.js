"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Card = exports.colors = void 0;
exports.colors = ["green", "red", "yellow", "blue"];
class Card {
    constructor(color, digit, cardSetColor) {
        this.color = color;
        this.digit = digit;
        this.cardSetColor = cardSetColor;
    }
}
exports.Card = Card;
