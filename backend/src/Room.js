"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Game_1 = require("./Game");
class Room {
    constructor() {
        this.code = Math.floor(Math.random() * 100000).toString();
        this.game = new Game_1.Game();
    }
}
exports.default = Room;
