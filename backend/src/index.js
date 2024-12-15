"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hapi_1 = __importDefault(require("@hapi/hapi"));
const socket_io_1 = require("socket.io");
const Room_1 = __importDefault(require("./Room"));
const init = async () => {
    const rooms = {};
    const server = hapi_1.default.server({
        port: 4000,
        host: "192.168.178.24",
    });
    server.route({
        method: "GET",
        path: "/",
        handler: () => {
            return "Hello World!";
        },
    });
    const io = new socket_io_1.Server(server.listener, {
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
                const room = new Room_1.default();
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
            socket.on("joinGame", (payload) => {
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
            socket.on("leaveGame", (payload) => {
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
            socket.on("moveCard", (payload) => {
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
                    if (payload.source === "philgrettoStack" &&
                        payload.target === "playingField") {
                        room.game.placePhilgrettoCardOnPlayingField(player.name, payload.slot);
                    }
                    if (payload.source === "row" && payload.target === "playingField") {
                        room.game.placeRowCardOnPlayingField(player.name, payload.sourceIndex, payload.slot);
                    }
                    if (payload.source === "deliveryStack" &&
                        payload.target === "playingField") {
                        room.game.placeDeliveryStackCardOnPlayingField(player.name, payload.slot);
                    }
                    if (payload.source === "philgrettoStack" &&
                        payload.target === "row") {
                        room.game.placePhilgrettoCardOnRow(player.name, payload.targetIndex);
                    }
                    if (payload.source === "row" && payload.target === "row") {
                        room.game.placeRowCardOnRow(player.name, payload.sourceIndex, payload.targetIndex);
                    }
                }
                catch (e) {
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
            });
            socket.on("turnHandCardsToDeliveryStack", (payload) => {
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
                }
                catch (e) {
                    console.error(e);
                }
                socket.emit("clients", room.game.players);
                socket.to(room.code).emit("clients", room.game.players);
            });
            socket.on("playerReady", (payload) => {
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
            socket.on("playerUnready", (payload) => {
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
        }
        catch (e) {
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
