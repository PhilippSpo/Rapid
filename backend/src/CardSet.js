"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardSet = exports.cardSetColors = void 0;
const Card_1 = require("./Card");
const utils_1 = require("./utils");
exports.cardSetColors = ["pink", "lightgreen", "brown", "purple", "orange"];
class CardSet {
    constructor(color) {
        this.color = color;
        this.cards = Card_1.colors.flatMap((cardColor) => Array.from({ length: 10 }).map((_, index) => new Card_1.Card(cardColor, index + 1, color)));
    }
    shuffle() {
        utils_1.shuffle(this.cards);
    }
    pull(numberOfCardsToPull) {
        return this.cards.splice(0, numberOfCardsToPull);
    }
}
exports.CardSet = CardSet;
