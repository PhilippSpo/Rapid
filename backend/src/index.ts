"use strict";

import Hapi from "@hapi/hapi";
import { Server as SocketServer } from "socket.io";
import { RoomsRepository } from "./repositories/rooms";
import { LobbyController } from "./controller/lobby";
import { GameController } from "./controller/game";

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
    const lobbyController = new LobbyController(roomsRepo, socket, name);
    const gameController = new GameController(roomsRepo, socket, name);
    console.log(`player ${name} trying to connect`);
    try {
      socket.on("createGame", () => {
        lobbyController.createGame();
      });
      socket.on("joinGame", (payload: { roomCode: string }) => {
        lobbyController.joinGame(payload.roomCode);
      });

      socket.on("leaveGame", (payload: { roomCode: string }) => {
        lobbyController.leaveGame(payload.roomCode);
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
