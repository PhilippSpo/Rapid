import React, { useEffect, useRef } from "react";
import { Player } from "../../pages";
import { styled } from "../../stitches.config";

const StyledPlayerCards = styled("div", {
  display: "grid",
  gridTemplateColumns: "repeat(var(--numberOfPlayerCards), 1fr)",
  gridGap: "$1",
});

const PlayerCards = (props: { player: Player; children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.style.setProperty(
        "--numberOfPlayerCards",
        // Philgretto Stack, Row, Button, Delivery Stack
        `${1 + props.player.deck.row.length + 1 + 1}`
      );
    }
  }, []);
  return <StyledPlayerCards ref={ref}>{props.children}</StyledPlayerCards>;
};

export default PlayerCards;
