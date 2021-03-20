import { Player } from "../../pages";
import { styled } from "../../stitches.config";

const StyledList = styled("ul", {
  display: "none",
  bp1: {
    display: "block",
  },
});

export const PlayerList = (props: { players: Player[] }) => (
  <StyledList>
    {props.players.map((message, index) => (
      <li key={index}>
        {message.name} ({message.color})
      </li>
    ))}
  </StyledList>
);
