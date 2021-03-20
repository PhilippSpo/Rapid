import { Socket } from "socket.io-client";
import { PlayingField as PlayingFieldType } from "../../pages/index";
import { styled } from "../../stitches.config";
import { Slot } from "../Slot";

export const StyledPlayingField = styled("div", {
  display: "grid",
  gridGap: "0.2rem",
  gridTemplateColumns: "repeat(var(--numberOfRowsAndColumns), 1fr)",
  gridTemplateRows: "repeat(var(--numberOfRowsAndColumns), 1fr)",
});

const PlayingField = (props: {
  playingField: PlayingFieldType;
  socket: Socket;
}) => (
  <StyledPlayingField>
    {props.playingField.flatMap((row, rowIndex) =>
      row.map((column, columnIndex) => (
        <Slot
          key={`${rowIndex}-${columnIndex}`}
          cards={column}
          moveCard={(item) => {
            console.log(rowIndex, columnIndex, item);
            props.socket.emit("moveCard", {
              source: (item as any).source,
              target: "playingField",
              card: (item as any).card,
              sourceIndex: (item as any).locationIndex,
              slot: { row: rowIndex, column: columnIndex },
            });
          }}
        />
      ))
    )}
  </StyledPlayingField>
);

export default PlayingField;
