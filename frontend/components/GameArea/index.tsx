import React, { useEffect, useRef } from "react";
import DragLayer from "../DragLayer";
import { styled } from "../../stitches.config";

const StyledGameArea = styled("div", {
  userSelect: "none",

  display: "grid",
  gridTemplateRows: "var(--numberOfRowsAndColumnsFr) var(--lastRowHeight)",
  height: "100%",
  padding: "0.5rem",
  gridGap: "$4",

  landscape: {
    width: "50%",
  },
});

const GameArea = (props: {
  numberOfRowsAndColumns: number;
  numberOfPlayers: number;
  children: React.ReactNode;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.style.setProperty(
        "--lastRowHeight",
        `${props.numberOfPlayers <= 3 ? "0.5fr" : "1fr"}`
      );
      ref.current.style.setProperty(
        "--numberOfRowsAndColumns",
        `${props.numberOfRowsAndColumns}`
      );
      ref.current.style.setProperty(
        "--numberOfRowsAndColumnsFr",
        `${props.numberOfRowsAndColumns}fr`
      );
    }
  }, [props.numberOfRowsAndColumns, props.numberOfPlayers]);
  return (
    <StyledGameArea ref={ref}>
      {!window.matchMedia("(hover: hover)").matches ? <DragLayer /> : null}
      {props.children}
    </StyledGameArea>
  );
};

export default GameArea;
