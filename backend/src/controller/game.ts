import { IRoomsRepo, ISocketRepository } from "./interfaces";

export class GameController {
  constructor(
    private roomsRepo: IRoomsRepo,
    private socket: ISocketRepository,
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
    this.socket.sendEventToRoom(
      room.code,
      "playingField",
      room.game.playingField
    );
    this.socket.sendEventToRoom(room.code, "clients", room.game.players);

    this.socket.sendEventToRoom(room.code, "room", {
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
      player.deck?.transferCardsFromReserveToDiscardPile();
    } catch (e) {
      console.error(e);
    }
    this.socket.sendEventToRoom(room.code, "clients", room.game.players);
  }
}
