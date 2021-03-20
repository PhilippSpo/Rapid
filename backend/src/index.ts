"use strict";

import Hapi from "@hapi/hapi";
import { Server as SocketServer } from "socket.io";
import { Game } from "./Game";

const init = async () => {
  const game = new Game();
  const server = Hapi.server({
    port: 4000,
    host: "192.168.178.126",
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
    const name = socket.handshake.auth.name;
    console.log("player connected", name);
    try {
      const player = game.addPlayer(name);
      player.setActive();

      socket.emit("clients", game.players);
      socket.emit("playingField", game.playingField);
      socket.broadcast.emit("clients", game.players);
      socket.broadcast.emit("playingField", game.playingField);
      socket.on("disconnect", () => {
        console.log("disconnected", player);
        player.setInactive();
        socket.broadcast.emit("clients", game.players);
      });
      socket.on(
        "moveCard",
        (payload: {
          slot: { row: number; column: number };
          sourceIndex: number;
          targetIndex: number;
          source: "philgrettoStack" | "row" | "deliveryStack";
          target: "playingField" | "row";
        }) => {
          console.log(payload);
          try {
            if (
              payload.source === "philgrettoStack" &&
              payload.target === "playingField"
            ) {
              game.placePhilgrettoCardOnPlayingField(player.name, payload.slot);
            }
            if (payload.source === "row" && payload.target === "playingField") {
              game.placeRowCardOnPlayingField(
                player.name,
                payload.sourceIndex,
                payload.slot
              );
            }
            if (
              payload.source === "deliveryStack" &&
              payload.target === "playingField"
            ) {
              game.placeDeliveryStackCardOnPlayingField(
                player.name,
                payload.slot
              );
            }
            if (
              payload.source === "philgrettoStack" &&
              payload.target === "row"
            ) {
              game.placePhilgrettoCardOnRow(player.name, payload.targetIndex);
            }
            if (payload.source === "row" && payload.target === "row") {
              game.placeRowCardOnRow(
                player.name,
                payload.sourceIndex,
                payload.targetIndex
              );
            }
          } catch (e) {
            console.error(e);
          }
          socket.emit("playingField", game.playingField);
          socket.broadcast.emit("playingField", game.playingField);
          socket.emit("clients", game.players);
          socket.broadcast.emit("clients", game.players);
          console.log(game.scores);
          socket.emit("scores", game.scores);
          socket.broadcast.emit("scores", game.scores);
        }
      );
      socket.on("turnHandCardsToDeliveryStack", () => {
        try {
          player.deck.moveCardsFromHandToDeliveryStack();
        } catch (e) {
          console.error(e);
        }
        socket.emit("clients", game.players);
        socket.broadcast.emit("clients", game.players);
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
