"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Deck = void 0;
const utils_1 = require("./utils");
const getNumberOfRowCards = (numberOfPlayers) => {
    if (numberOfPlayers <= 2) {
        return 5;
    }
    if (numberOfPlayers <= 3) {
        return 4;
    }
    return 3;
};
class Deck {
    constructor(cardSet, numberOfPlayers) {
        cardSet.shuffle();
        this.philgrettoStack = cardSet.pull(10);
        // TODO number of cards in the row depend on number of players
        this.row = cardSet.pull(getNumberOfRowCards(numberOfPlayers));
        this.hand = cardSet.cards;
        this.deliveryStack = [];
    }
    pullCardFromRowAtPosition(position) {
        this.row[position] = undefined;
    }
    moveCardsFromHandToDeliveryStack(numberOfCardsToMove = 3) {
        if (this.hand.length < numberOfCardsToMove) {
            this.hand = [...this.hand, ...this.deliveryStack];
            this.deliveryStack = [];
            utils_1.shuffle(this.hand);
        }
        const cardsToMove = this.hand.splice(-numberOfCardsToMove, numberOfCardsToMove);
        this.deliveryStack.push(...cardsToMove);
    }
}
exports.Deck = Deck;
