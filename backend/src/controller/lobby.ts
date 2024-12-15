import Room from "../domain/Room";
import { IRoomsRepo, ISocketRepository } from "./interfaces";

export class LobbyController {
  constructor(
    private roomsRepo: IRoomsRepo,
    private socket: ISocketRepository,
    private playerName: string
  ) {}

  createGame() {
    const room = new Room();
    this.roomsRepo.add(room);
    room.game.addPlayer(this.playerName);

    this.socket.joinRoom(room.code);
    this.socket.sendEventToPlayer("room", {
      code: room.code,
      gameStatus: room.game.status,
      scores: room.game.scores,
    });
    this.socket.sendEventToPlayer("clients", room.game.players);
    this.socket.sendEventToPlayer("playingField", room.game.playingField);
    this.socket.sendEventToRoom(room.code, "clients", room.game.players);
    this.socket.sendEventToRoom(room.code, "playingField", room.game.playingField);
  }

  joinGame(roomCode: string) {
    const room = this.roomsRepo.load(roomCode);
    if (!room) {
      console.error(new Error("room not found"));
      return;
    }
    const player = room.game.addPlayer(this.playerName);
    player.setActive();

    this.socket.joinRoom(room.code);
    this.socket.sendEventToPlayer("room", {
      code: room.code,
      gameStatus: room.game.status,
      scores: room.game.scores,
    });
    this.socket.sendEventToPlayer("clients", room.game.players);
    this.socket.sendEventToPlayer("playingField", room.game.playingField);
    this.socket.sendEventToRoom(room.code, "clients", room.game.players);
    this.socket.sendEventToRoom(room.code, "playingField", room.game.playingField);
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
    this.socket.sendEventToRoom(room.code, "clients", room.game.players);
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
    this.socket.sendEventToPlayer("clients", room.game.players);
    this.socket.sendEventToRoom(room.code, "clients", room.game.players);
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
    this.socket.sendEventToPlayer("clients", room.game.players);
    this.socket.sendEventToRoom(room.code, "clients", room.game.players);
  }
}
