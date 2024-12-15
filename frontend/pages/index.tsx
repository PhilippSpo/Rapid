import Head from "next/head";
import { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { io, Socket } from "socket.io-client";
import { Card } from "../components/Card";
import CreateRoomForm from "../components/CreateRoomForm";
import DeliveryStack from "../components/DeliveryStack";
import GameArea from "../components/GameArea";
import { JoinRoomForm } from "../components/JoinRoomForm";
import PhilgrettoStack from "../components/PhilgrettoStack";
import PlayerCards from "../components/PlayerCards";
import { PlayerList } from "../components/PlayerList";
import PlayingField from "../components/PlayingField";
import Row from "../components/Row";
import { SignUpForm } from "../components/SignUpForm";
import { styled } from "../stitches.config";

export type PlayingField = Card[][][];

export type Card = {
  color: "blue" | "green" | "red" | "yellow";
  digit: number;
};

type Deck = {
  deliveryStack: Card[];
  hand: Card[];
  philgrettoStack: Array<Card | undefined>;
  row: Array<Card | undefined>;
};

export type Player = {
  name: string;
  color: string;
  deck?: Deck;
  score: number;
  isReady: boolean;
};

type Score = {
  player: Player;
  score: number;
};

type Room = {
  code: string;
  gameStatus: "pending" | "started" | "finished";
  scores: Score[];
};

const Container = styled("div", {
  height: "100%",
});

const Main = styled("div", {
  height: "100%",
});

const Button = styled("button", {
  fontSize: "2rem",
  padding: 0,
  appearance: "none",
  border: 0,
  background: "transparent",
});

export default function Home() {
  const [clients, setClients] = useState<Player[]>([]);
  const [playingField, setPlayingField] = useState<PlayingField>([]);
  const [name, setName] = useState(
    typeof window !== "undefined"
      ? localStorage.getItem("playerName") || ""
      : ""
  );
  const [room, setRoom] = useState<Room | null>(null);
  const [socket, setSocket] = useState<Socket | null>();
  const [Backend, setBackend] = useState<typeof HTML5Backend | null>(null);
  const me = clients.find((client) => client.name === name);
  console.log("room", room);
  useEffect(() => {
    const loadBackend = async () => {
      const backend = window.matchMedia("(hover: hover)").matches
        ? (await import("react-dnd-html5-backend")).HTML5Backend
        : (await import("react-dnd-touch-backend")).TouchBackend;
      setBackend(() => backend);
    };
    loadBackend();
  }, []);
  useEffect(() => {
    if (!socket) {
      if (name) {
        console.log("connect");
        const socket = io("ws://localhost:4000", { auth: { name } });
        setSocket(socket);
        if (localStorage.getItem("roomCode")) {
          socket.emit("joinGame", {
            roomCode: localStorage.getItem("roomCode"),
          });
        }
      }
      return;
    }
  }, [socket, name]);
  useEffect(() => {
    if (!socket) {
      return;
    }
    return () => {
      if (room) {
        socket.emit("leaveGame", {
          roomCode: room.code,
        });
      }
    };
  }, [socket, room]);
  useEffect(() => {
    if (!socket) {
      return;
    }
    return () => {
      console.log("disconnect");
      socket.disconnect();
    };
  }, [socket]);
  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.onAny((event, ...args) => {
      console.log(event, args);
    });
    socket.on("clients", (clients: Player[]) => {
      console.log("receive clients");
      setClients(clients);
    });
    socket.on("playingField", (playingField: PlayingField) => {
      setPlayingField(playingField);
    });
    socket.on("room", (room: Room) => {
      setRoom(room);
      localStorage.setItem("roomCode", room.code);
    });
  }, [socket]);

  return (
    <Container>
      <Head>
        <title>Philgretto</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {Backend && (
        <DndProvider backend={Backend}>
          <Main>
            {!name ? (
              <SignUpForm
                onSubmit={({ name }) => {
                  setName(name);
                  localStorage.setItem("playerName", name);
                }}
              />
            ) : null}
            {name && !room && socket ? (
              <>
                <JoinRoomForm
                  onSubmit={({ roomCode }) => {
                    socket.emit("joinGame", { roomCode });
                  }}
                />
                <CreateRoomForm
                  onSubmit={() => {
                    socket.emit("createGame");
                  }}
                />
              </>
            ) : null}
            {me && room && socket ? (
              <>
                {room.gameStatus === "finished" ? (
                  <ul>
                    {room.scores.map((score) => (
                      <li>
                        {score.player.name}: {score.score}
                      </li>
                    ))}
                  </ul>
                ) : null}
                {["pending", "finished"].includes(room.gameStatus) ? (
                  <button
                    onClick={() => {
                      if (!me.isReady) {
                        socket.emit("playerReady", { roomCode: room.code });
                      } else {
                        socket.emit("playerUnready", { roomCode: room.code });
                      }
                    }}
                  >
                    {me.isReady ? "unready" : "ready"}
                  </button>
                ) : null}
                {room.gameStatus === "started" ? (
                  <GameArea
                    numberOfRowsAndColumns={playingField.length}
                    numberOfPlayers={clients.length}
                  >
                    <PlayingField
                      socket={socket}
                      playingField={playingField}
                      roomCode={room.code}
                    />
                    {me.deck ? (
                      <PlayerCards player={me}>
                        <PhilgrettoStack
                          philgrettoStack={me.deck.philgrettoStack}
                        />
                        <Row
                          row={me.deck.row}
                          socket={socket}
                          roomCode={room.code}
                        />
                        <Button
                          onClick={() => {
                            socket.emit("turnHandCardsToDeliveryStack", {
                              roomCode: room.code,
                            });
                          }}
                        >
                          🔄
                        </Button>
                        <DeliveryStack deliveryStack={me.deck.deliveryStack} />
                      </PlayerCards>
                    ) : null}
                  </GameArea>
                ) : null}
                <PlayerList players={clients} />
              </>
            ) : null}
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
            >
              Logout
            </button>
            {room ? room.code : null}
          </Main>
        </DndProvider>
      )}
    </Container>
  );
}
