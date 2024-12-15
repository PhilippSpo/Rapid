"use strict";

import Hapi from "@hapi/hapi";
import { Server as SocketServer } from "socket.io";
import Room from "./domain/Room";

const init = async () => {
  const rooms: Record<string, Room> = {};
  const server = Hapi.server({
    port: 4000,
    host: "localhost",
  });

  server.route({
    method: "GET",
    path: "/",
    handler: () => {
      return "Hello World!";
    },
  });

  const io = new SocketServer(server.listener, {
    cors: { origin: "*" },
  });

  io.use((socket, next) => {
    const name = socket.handshake.auth.name;
    if (!name) {
      return next(new Error("invalid name"));
    }
    next();
  });

  io.on("connection", function (socket) {
    const { name } = socket.handshake.auth;
    console.log(`player ${name} trying to connect`);
    try {
      socket.on("createGame", () => {
        const room = new Room();
        rooms[room.code] = room;
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
      });
      socket.on("joinGame", (payload: { roomCode: string }) => {
        console.log(rooms, payload);
        const room = rooms[payload.roomCode];
        if (!room) {
          console.error(new Error("room not found"));
          return;
        }
        const player = room.game.addPlayer(name);
        player.setActive();

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
      });

      socket.on("leaveGame", (payload: { roomCode: string }) => {
        console.log("disconnected", name);
        const room = rooms[payload.roomCode];
        if (!room) {
          console.error(new Error("room not found"));
          return;
        }
        const player = room.game.getPlayerByName(name);
        if (!player) {
          console.error(new Error("player not found"));
          return;
        }
        player.setInactive();
        socket.to(room.code).emit("clients", room.game.players);
      });
      socket.on(
        "moveCard",
        (payload: {
          roomCode: string;
          slot: { row: number; column: number };
          sourceIndex: number;
          targetIndex: number;
          source: "philgrettoStack" | "row" | "deliveryStack";
          target: "playingField" | "row";
        }) => {
          const room = rooms[payload.roomCode];
          if (!room) {
            console.error(new Error("room not found"));
            return;
          }
          const player = room.game.getPlayerByName(name);
          if (!player) {
            console.error(new Error("player not found"));
            return;
          }
          try {
            if (
              payload.source === "philgrettoStack" &&
              payload.target === "playingField"
            ) {
              room.game.placePhilgrettoCardOnPlayingField(
                player.name,
                payload.slot
              );
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
            if (
              payload.source === "philgrettoStack" &&
              payload.target === "row"
            ) {
              room.game.placePhilgrettoCardOnRow(
                player.name,
                payload.targetIndex
              );
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
          socket.emit("playingField", room.game.playingField);
          socket.to(room.code).emit("playingField", room.game.playingField);
          socket.emit("clients", room.game.players);
          socket.to(room.code).emit("clients", room.game.players);
          socket.emit("room", {
            code: room.code,
            gameStatus: room.game.status,
            scores: room.game.scores,
          });
          socket.to(room.code).emit("room", {
            code: room.code,
            gameStatus: room.game.status,
            scores: room.game.scores,
          });
        }
      );
      socket.on(
        "turnHandCardsToDeliveryStack",
        (payload: { roomCode: string }) => {
          const room = rooms[payload.roomCode];
          if (!room) {
            console.error(new Error("room not found"));
            return;
          }
          const player = room.game.getPlayerByName(name);
          if (!player) {
            console.error(new Error("player not found"));
            return;
          }
          try {
            player.deck?.moveCardsFromHandToDeliveryStack();
          } catch (e) {
            console.error(e);
          }
          socket.emit("clients", room.game.players);
          socket.to(room.code).emit("clients", room.game.players);
        }
      );

      socket.on("playerReady", (payload: { roomCode: string }) => {
        const room = rooms[payload.roomCode];
        if (!room) {
          console.error(new Error("room not found"));
          return;
        }
        const player = room.game.getPlayerByName(name);
        if (!player) {
          console.error(new Error("player not found"));
          return;
        }
        player.setReady();
        room.game.startGame();
        socket.emit("clients", room.game.players);
        socket.to(room.code).emit("clients", room.game.players);
        socket.emit("playingField", room.game.playingField);
        socket.to(room.code).emit("playingField", room.game.playingField);
        socket.emit("room", {
          code: room.code,
          gameStatus: room.game.status,
          scores: room.game.scores,
        });
        socket.to(room.code).emit("room", {
          code: room.code,
          gameStatus: room.game.status,
          scores: room.game.scores,
        });
      });
      socket.on("playerUnready", (payload: { roomCode: string }) => {
        const room = rooms[payload.roomCode];
        if (!room) {
          console.error(new Error("room not found"));
          return;
        }
        const player = room.game.getPlayerByName(name);
        if (!player) {
          console.error(new Error("player not found"));
          return;
        }
        player.setUnready();
        socket.emit("clients", room.game.players);
        socket.to(room.code).emit("clients", room.game.players);
      });
    } catch (e) {
      console.error(e);
    }
  });

  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
