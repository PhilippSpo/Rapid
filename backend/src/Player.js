"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
const CardSet_1 = require("./CardSet");
const Deck_1 = require("./Deck");
class Player {
    constructor(name, color, numberOfPlayers) {
        this.isActive = true;
        this.isReady = false;
        this.name = name;
        this.color = color;
        this.score = 0;
    }
    resetDeck(numberOfPlayers) {
        this.cardSet = new CardSet_1.CardSet(this.color);
        this.deck = new Deck_1.Deck(this.cardSet, numberOfPlayers);
    }
    setInactive() {
        this.isActive = false;
    }
    setActive() {
        this.isActive = true;
    }
    addScore(score) {
        this.score = this.score + score;
    }
    setReady() {
        this.isReady = true;
    }
    setUnready() {
        this.isReady = false;
    }
}
exports.Player = Player;
