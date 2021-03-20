import { Card as CardType } from "../../pages";
import { useDrag } from "react-dnd";
import { styled } from "../../stitches.config";

const StyledCard = styled("div", {
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "white",
  fontSize: "2rem",
  borderRadius: "0.2em",
  position: "relative",
  border: "0.05em solid",

  span: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  variants: {
    color: {
      green: {
        // TODO replace with tokens
        backgroundColor: "#61ad3a",
        borderColor: "#408020",
      },
      blue: {
        backgroundColor: "#1578c2",
        borderColor: "#064f86",
      },
      yellow: {
        backgroundColor: "#f0ae1f",
        borderColor: "#c78e14",
      },
      red: {
        backgroundColor: "#e5001b",
        borderColor: "#8f0111",
      },
    },
    isDragging: {
      true: {
        opacity: 0,
      },
    },
  },
});

export const Card = (props: {
  card: CardType;
  source?: "philgrettoStack" | "row" | "deliveryStack";
  locationIndex?: number;
}) => {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    item: {
      type: "card",
      card: props.card,
      source: props.source,
      locationIndex: props.locationIndex,
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    canDrag: () => {
      return props.source ? true : false
    },
  }), [props.source, props.card.color, props.card.digit, props.locationIndex]);
  return (
    <StyledCard ref={dragRef} color={props.card.color} isDragging={isDragging}>
      <span>{props.card.digit}</span>
    </StyledCard>
  );
};
