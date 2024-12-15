import { Socket } from "socket.io";
import Room from "../domain/Room";

export interface RoomsRepo {
  add: (room: Room) => void;
  load: (code: string) => Room | undefined;
}

export class LobbyController {
  constructor(
    private roomsRepo: RoomsRepo,
    private socket: Socket,
    private playerName: string
  ) {}

  createGame() {
    const room = new Room();
    this.roomsRepo.add(room);
    room.game.addPlayer(this.playerName);

    this.socket.join(room.code);
    this.socket.emit("room", {
      code: room.code,
      gameStatus: room.game.status,
      scores: room.game.scores,
    });
    this.socket.emit("clients", room.game.players);
    this.socket.emit("playingField", room.game.playingField);
    this.socket.to(room.code).emit("clients", room.game.players);
    this.socket.to(room.code).emit("playingField", room.game.playingField);
  }

  joinGame(roomCode: string) {
    const room = this.roomsRepo.load(roomCode);
    if (!room) {
      console.error(new Error("room not found"));
      return;
    }
    const player = room.game.addPlayer(this.playerName);
    player.setActive();

    this.socket.join(room.code);
    this.socket.emit("room", {
      code: room.code,
      gameStatus: room.game.status,
      scores: room.game.scores,
    });
    this.socket.emit("clients", room.game.players);
    this.socket.emit("playingField", room.game.playingField);
    this.socket.to(room.code).emit("clients", room.game.players);
    this.socket.to(room.code).emit("playingField", room.game.playingField);
  }

  leaveGame(roomCode: string) {
    console.log("disconnected", this.playerName);
    const room = this.roomsRepo.load(roomCode);
    if (!room) {
      console.error(new Error("room not found"));
      return;
    }
    const player = room.game.getPlayerByName(this.playerName);
    if (!player) {
      console.error(new Error("player not found"));
      return;
    }
    player.setInactive();
    this.socket.to(room.code).emit("clients", room.game.players);
  }

  playerReady(roomCode: string) {
    const room = this.roomsRepo.load(roomCode);
    if (!room) {
      console.error(new Error("room not found"));
      return;
    }
    const player = room.game.getPlayerByName(this.playerName);
    if (!player) {
      console.error(new Error("player not found"));
      return;
    }
    player.setReady();
    this.socket.emit("clients", room.game.players);
    this.socket.to(room.code).emit("clients", room.game.players);
  }

  playerUnready(roomCode: string) {
    const room = this.roomsRepo.load(roomCode);
    if (!room) {
      console.error(new Error("room not found"));
      return;
    }
    const player = room.game.getPlayerByName(this.playerName);
    if (!player) {
      console.error(new Error("player not found"));
      return;
    }
    player.setUnready();
    this.socket.emit("clients", room.game.players);
    this.socket.to(room.code).emit("clients", room.game.players);
  }
}
