"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const CardSet_1 = require("./CardSet");
const Player_1 = require("./Player");
class Game {
    constructor() {
        this.scores = [];
        this.status = "pending";
        this.playingField = [];
        this.players = [];
    }
    static initializePlayingField(numberOfPlayers) {
        const numberOfCardSlotsOnField = numberOfPlayers * 4;
        const numberOfRows = Math.ceil(Math.sqrt(numberOfCardSlotsOnField));
        const numberOfColumns = numberOfRows;
        return Array.from({ length: numberOfRows }).map(() => Array.from({ length: numberOfColumns }).map(() => []));
    }
    startGame() {
        if (this.players.every((player) => player.isReady)) {
            this.status = "started";
            this.playingField = Game.initializePlayingField(this.players.length);
            this.players.forEach((player) => {
                player.resetDeck(this.players.length);
            });
            this.scores = [];
        }
    }
    addPlayer(name) {
        const existingPlayer = this.getPlayerByName(name);
        if (existingPlayer) {
            return existingPlayer;
        }
        const color = CardSet_1.cardSetColors.find((color) => !this.players.some((player) => player.color === color));
        if (!color) {
            throw new Error("All player seats taken");
        }
        const player = new Player_1.Player(name, color, this.players.length + 1);
        this.players.push(player);
        return player;
    }
    getPlayerByName(name) {
        return this.players.find((player) => player.name === name);
    }
    placeCardOnPlayingField(card, row, column) {
        const stackToPutCardOn = this.playingField[row][column];
        const cardIsOne = card.digit === 1;
        if (cardIsOne) {
            const stackToPutCardOnIsEmpty = stackToPutCardOn.length === 0;
            if (stackToPutCardOnIsEmpty) {
                stackToPutCardOn.push(card);
            }
            else {
                throw new Error("Operation not allowed");
            }
        }
        else {
            const cardIsOneHigherThenCardOnStack = card.digit === stackToPutCardOn[stackToPutCardOn.length - 1].digit + 1;
            const cardHasSameColorAsStack = card.color === stackToPutCardOn[stackToPutCardOn.length - 1].color;
            if (cardIsOneHigherThenCardOnStack && cardHasSameColorAsStack) {
                stackToPutCardOn.push(card);
            }
            else {
                throw new Error("Operation not allowed");
            }
        }
    }
    placePhilgrettoCardOnPlayingField(playerName, slot) {
        const player = this.players.find((player) => player.name === playerName);
        if (!player) {
            throw new Error("player not found");
        }
        if (!player.deck) {
            console.error("player has no cards");
            return;
        }
        const card = player.deck.philgrettoStack[player.deck.philgrettoStack.length - 1];
        if (!card) {
            console.error("no philgretto card");
            return;
        }
        this.placeCardOnPlayingField(card, slot.row, slot.column);
        player.deck.philgrettoStack.pop();
        if (player.deck.philgrettoStack.length === 0) {
            this.finishGame();
        }
    }
    placeRowCardOnPlayingField(playerName, rowIndex, slot) {
        const player = this.players.find((player) => player.name === playerName);
        if (!player) {
            throw new Error("player not found");
        }
        if (!player.deck) {
            console.error("player has no cards");
            return;
        }
        const card = player.deck.row[rowIndex];
        if (!card) {
            console.error("no row card");
            return;
        }
        if (!player.deck) {
            console.error("player has no cards");
            return;
        }
        this.placeCardOnPlayingField(card, slot.row, slot.column);
        player.deck.row[rowIndex] = undefined;
    }
    placeDeliveryStackCardOnPlayingField(playerName, slot) {
        const player = this.players.find((player) => player.name === playerName);
        if (!player) {
            throw new Error("player not found");
        }
        if (!player.deck) {
            console.error("player has no cards");
            return;
        }
        const card = player.deck.deliveryStack[player.deck.deliveryStack.length - 1];
        if (!card) {
            console.error("no delivery stack card");
            return;
        }
        this.placeCardOnPlayingField(card, slot.row, slot.column);
        player.deck.deliveryStack.pop();
    }
    placeRowCardOnRow(playerName, rowSourceIndex, rowTargetIndex) {
        const player = this.players.find((player) => player.name === playerName);
        if (!player) {
            throw new Error("player not found");
        }
        if (!player.deck) {
            console.error("player has no cards");
            return;
        }
        const card = player.deck.row[rowSourceIndex];
        if (!card) {
            console.error("no row card");
            return;
        }
        if (!player.deck) {
            console.error("player has no cards");
            return;
        }
        player.deck.row[rowSourceIndex] = undefined;
        player.deck.row[rowTargetIndex] = card;
    }
    placePhilgrettoCardOnRow(playerName, rowTargetIndex) {
        const player = this.players.find((player) => player.name === playerName);
        if (!player) {
            throw new Error("player not found");
        }
        if (!player.deck) {
            console.error("player has no cards");
            return;
        }
        const card = player.deck.philgrettoStack[player.deck.philgrettoStack.length - 1];
        if (!card) {
            console.error("no philgretto card");
            return;
        }
        player.deck.philgrettoStack.pop();
        player.deck.row[rowTargetIndex] = card;
        if (player.deck.philgrettoStack.length === 0) {
            console.log("player finished game", player.name);
            this.finishGame();
        }
    }
    getPlayersCardsOnPlayingField(player) {
        return this.playingField.reduce((numberOfCardsOnPlayingField, row) => numberOfCardsOnPlayingField +
            row.reduce((numberOfCardsInRow, column) => numberOfCardsInRow +
                column.reduce((numberOfCardsInColumn, card) => {
                    if (card.cardSetColor === player.color) {
                        return numberOfCardsInColumn + 1;
                    }
                    return numberOfCardsInColumn;
                }, 0), 0), 0);
    }
    finishGame() {
        this.status = "finished";
        this.players.forEach((player) => {
            if (!player.deck) {
                console.error("player has no cards");
                return;
            }
            const numberOfPhilgrettoCards = player.deck.philgrettoStack.length;
            const numberOfCardsOnPlayingField = this.getPlayersCardsOnPlayingField(player);
            const score = numberOfCardsOnPlayingField - numberOfPhilgrettoCards * 2;
            this.scores.push({
                player,
                score,
            });
            player.addScore(score);
            player.setUnready();
        });
    }
}
exports.Game = Game;
