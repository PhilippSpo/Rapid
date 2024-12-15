import { Socket } from "socket.io";
import Room from "../domain/Room";
import { RoomsRepo } from "./lobby";

export class GameController {
  constructor(
    private roomsRepo: RoomsRepo,
    private socket: Socket,
    private playerName: string
  ) {}

  moveCard(
    roomCode: string,
    payload: {
      slot: { row: number; column: number };
      sourceIndex: number;
      targetIndex: number;
      source: "philgrettoStack" | "row" | "deliveryStack";
      target: "playingField" | "row";
    }
  ) {
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
    try {
      if (
        payload.source === "philgrettoStack" &&
        payload.target === "playingField"
      ) {
        room.game.placePhilgrettoCardOnPlayingField(player.name, payload.slot);
      }
      if (payload.source === "row" && payload.target === "playingField") {
        room.game.placeRowCardOnPlayingField(
          player.name,
          payload.sourceIndex,
          payload.slot
        );
      }
      if (
        payload.source === "deliveryStack" &&
        payload.target === "playingField"
      ) {
        room.game.placeDeliveryStackCardOnPlayingField(
          player.name,
          payload.slot
        );
      }
      if (payload.source === "philgrettoStack" && payload.target === "row") {
        room.game.placePhilgrettoCardOnRow(player.name, payload.targetIndex);
      }
      if (payload.source === "row" && payload.target === "row") {
        room.game.placeRowCardOnRow(
          player.name,
          payload.sourceIndex,
          payload.targetIndex
        );
      }
    } catch (e) {
      console.error(e);
    }
    this.socket.emit("playingField", room.game.playingField);
    this.socket.to(room.code).emit("playingField", room.game.playingField);
    this.socket.emit("clients", room.game.players);
    this.socket.to(room.code).emit("clients", room.game.players);
    this.socket.emit("room", {
      code: room.code,
      gameStatus: room.game.status,
      scores: room.game.scores,
    });
    this.socket.to(room.code).emit("room", {
      code: room.code,
      gameStatus: room.game.status,
      scores: room.game.scores,
    });
  }

  turnHandCardsToDeliveryStack(roomCode: string) {
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
    try {
      player.deck?.moveCardsFromHandToDeliveryStack();
    } catch (e) {
      console.error(e);
    }
    this.socket.emit("clients", room.game.players);
    this.socket.to(room.code).emit("clients", room.game.players);
  }
}
