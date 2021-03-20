import React, { useEffect, useRef } from "react";
import { styled } from "../../stitches.config";

const StyledRotate = styled("div", {
  transform: "rotate(var(--rotation))",
  transition: "50ms ease-in-out",
  height: "100%",
  variants: {
    interactive: {
      true: {
        ":hover": {
          transform: "rotate(0)",
        },
      },
      false: {},
    },
  },
});

const RandomRotate = (props: {
  children: React.ReactNode;
  interactive?: boolean;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.style.setProperty(
        "--rotation",
        `${Math.random() * 10 - 5}deg`
      );
    }
  }, []);
  return (
    <StyledRotate interactive={props.interactive} ref={ref}>
      {props.children}
    </StyledRotate>
  );
};

export default RandomRotate;
