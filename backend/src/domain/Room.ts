import { Game } from "./Game";

class Room {
  code: string;
  game: Game;
  constructor() {
    this.code = Math.floor(Math.random() * 100000).toString();
    this.game = new Game();
  }
}

export default Room;
