import React, { useEffect, useRef } from "react";
import { styled } from "../../stitches.config";

const StyledCardStack = styled("ul", {
  listStyle: "none",
  margin: 0,
  position: "relative",

  li: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

const CardStack = (props: { children: React.ReactNode }) => {
  return <StyledCardStack>{props.children}</StyledCardStack>;
};

export default CardStack;
