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
    {props.players.map((player, index) => (
      <li key={index}>
        {player.name} ({player.color}): {player.score}
      </li>
    ))}
  </StyledList>
);
