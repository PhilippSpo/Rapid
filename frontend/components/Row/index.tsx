import React from "react";
import { Socket } from "socket.io-client";
import { Card as CardType } from "../../pages";
import { Card } from "../Card";
import { Slot } from "../Slot";

const Row = (props: {
  row: (CardType | undefined)[];
  socket: Socket;
  roomCode: string;
}) => (
  <>
    {props.row.map((card, index) =>
      card ? (
        <div key={`${card.color}-${card.digit}`}>
          <Card card={card} source="row" locationIndex={index} />
        </div>
      ) : (
        <div key={index}>
          <Slot
            cards={[]}
            moveCard={(item) => {
              console.log(item);
              props.socket?.emit("moveCard", {
                source: (item as any).source,
                target: "row",
                card: (item as any).card,
                sourceIndex: (item as any).locationIndex,
                targetIndex: index,
                roomCode: props.roomCode,
              });
            }}
          ></Slot>
        </div>
      )
    )}
  </>
);

export default Row;
