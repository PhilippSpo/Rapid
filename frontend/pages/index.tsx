import Head from "next/head";
import { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { io, Socket } from "socket.io-client";
import { Card } from "../components/Card";
import DeliveryStack from "../components/DeliveryStack";
import GameArea from "../components/GameArea";
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
  deck: Deck;
};

type Score = {
  player: Player;
  score: number;
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
  const [scores, setScores] = useState<Score[]>([]);
  const [playingField, setPlayingField] = useState<PlayingField>([]);
  const [name, setName] = useState(
    typeof window !== "undefined"
      ? localStorage.getItem("playerName") || ""
      : ""
  );
  const [socket, setSocket] = useState<Socket | null>();
  const [Backend, setBackend] = useState<typeof HTML5Backend | null>(null);
  const me = clients.find((client) => client.name === name);
  console.log("me", me);
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
        setSocket(io("ws://192.168.178.126:4000", { auth: { name } }));
      }
      return;
    }
    return () => {
      console.log("disconnect");
      socket.disconnect();
    };
  }, [socket, name]);
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
    // socket.on("user connected", (connectedClient: Player) => {
    //   setClients((prevClients) => [...prevClients, connectedClient]);
    // });
    socket.on("user disconnected", (disconnectedClient: Player) => {
      setClients((prevClients) =>
        prevClients.filter((client) => disconnectedClient.name !== client.name)
      );
    });
    socket.on("playingField", (playingField: PlayingField) => {
      setPlayingField(playingField);
    });
    socket.on("scores", (scores: Score[]) => {
      setScores(scores);
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
            {!me || !socket ? (
              <SignUpForm
                onSubmit={(name) => {
                  setName(name);
                  localStorage.setItem("playerName", name);
                }}
              />
            ) : (
              <>
                {scores.length > 0 ? (
                  <ul>
                    {scores.map((score) => (
                      <li>
                        {score.player.name}: {score.score}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <GameArea
                    numberOfRowsAndColumns={playingField.length}
                    numberOfPlayers={clients.length}
                  >
                    <PlayingField socket={socket} playingField={playingField} />
                    <PlayerCards player={me}>
                      <PhilgrettoStack
                        philgrettoStack={me.deck.philgrettoStack}
                      />
                      <Row row={me.deck.row} socket={socket} />
                      <Button
                        onClick={() => {
                          socket.emit("turnHandCardsToDeliveryStack");
                        }}
                      >
                        🔄
                      </Button>
                      <DeliveryStack deliveryStack={me.deck.deliveryStack} />
                    </PlayerCards>
                  </GameArea>
                )}
                <PlayerList players={clients} />
              </>
            )}
          </Main>
        </DndProvider>
      )}
    </Container>
  );
}
