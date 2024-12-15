import { Socket } from "socket.io";
import Room from "./domain/Room";

type RoomsRepo = {
  add: (room: Room) => void;
};

export const createGame = (socket: Socket, roomsRepo: RoomsRepo) => {
  const { name } = socket.handshake.auth;
  const room = new Room();
  roomsRepo.add(room);
  // rooms[room.code] = room;
  room.game.addPlayer(name);
  socket.join(room.code);
  socket.emit("room", {
    code: room.code,
    gameStatus: room.game.status,
    scores: room.game.scores,
  });
  socket.emit("clients", room.game.players);
  socket.emit("playingField", room.game.playingField);
  socket.to(room.code).emit("clients", room.game.players);
  socket.to(room.code).emit("playingField", room.game.playingField);
};
