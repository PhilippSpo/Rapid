import { DragObjectWithType, useDrop } from "react-dnd";
import { Card as CardType } from "../../pages";
import { styled } from "../../stitches.config";
import { Card } from "../Card";

const StyledSlot = styled("div", {
  width: "100%",
  height: "100%",
  borderRadius: "0.2em",
  border: "0.05em solid",
  // TODO replace with token
  backgroundColor: "#eaeaea",
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  // TODO replace with token
  color: "rgba(0,0,0,0.2)",

  "> *": {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },

  variants: {
    cardIsOverSlot: {
      true: {
        border: "0.2em solid deeppink",
      },
    },
  },
});

type SlotProps = {
  cards: CardType[];
  moveCard: (item: DragObjectWithType) => void;
};

export const Slot = (props: SlotProps) => {
  const [{ isOver }, dropRef] = useDrop(
    () => ({
      accept: ["card"],
      drop: (item) => {
        props.moveCard(item);
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    []
  );
  return (
    <StyledSlot ref={dropRef} cardIsOverSlot={isOver}>
      {props.cards.map((card) => (
        <div key={card.digit}>
          <Card card={card} />
        </div>
      ))}
    </StyledSlot>
  );
};
