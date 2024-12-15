"use strict";

import Hapi from "@hapi/hapi";
import { Server as SocketServer } from "socket.io";
import { GameController } from "./controller/game";
import { LobbyController } from "./controller/lobby";
import { RoomsRepository } from "./repositories/rooms";
import { SocketRepository } from "./repositories/socket";

const init = async () => {
  const roomsRepo = new RoomsRepository();
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
    const socketRepository = new SocketRepository(socket);
    const lobbyController = new LobbyController(roomsRepo, socketRepository, name);
    const gameController = new GameController(roomsRepo, socketRepository, name);
    console.log(`player ${name} trying to connect`);
    try {
      socket.on("createRoom", () => {
        lobbyController.createRoom();
      });
      socket.on("joinRoom", (payload: { roomCode: string }) => {
        lobbyController.joinRoom(payload.roomCode);
      });

      socket.on("leaveRoom", (payload: { roomCode: string }) => {
        lobbyController.leaveRoom(payload.roomCode);
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
          gameController.moveCard(payload.roomCode, payload);
        }
      );
      socket.on(
        "turnHandCardsToDeliveryStack",
        (payload: { roomCode: string }) => {
          gameController.turnHandCardsToDeliveryStack(payload.roomCode);
        }
      );

      socket.on("playerReady", (payload: { roomCode: string }) => {
        lobbyController.playerReady(payload.roomCode);
      });
      socket.on("playerUnready", (payload: { roomCode: string }) => {
        lobbyController.playerUnready(payload.roomCode);
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
