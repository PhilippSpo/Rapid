import { FC } from "react";
import { XYCoord, useDragLayer } from "react-dnd";
import { styled } from "../../stitches.config";
import { Card } from "../Card";
import { StyledPlayingField } from "../PlayingField";

const Layer = styled("div", {
  position: "fixed",
  pointerEvents: "none",
  zIndex: 100,
  left: 0,
  top: 0,
  width: "100%",
  height: "100%",
  display: "grid",
  gridTemplateRows: "var(--numberOfRowsAndColumnsFr) 1fr",
  padding: "0.5rem",
  gridGap: "$4",
  landscape: {
    width: "50%",
  },
});

function getItemStyles(
  initialOffset: XYCoord | null,
  currentOffset: XYCoord | null
) {
  if (!initialOffset || !currentOffset) {
    return {
      display: "none",
    };
  }

  let { x, y } = currentOffset;

  const transform = `translate(${x}px, ${y}px)`;
  return {
    transform,
    WebkitTransform: transform,
    height: "100%",
    width: "100%",
  };
}

const DragLayer: FC = () => {
  const { isDragging, item, initialOffset, currentOffset } = useDragLayer(
    (monitor) => ({
      item: monitor.getItem(),
      initialOffset: monitor.getInitialSourceClientOffset(),
      currentOffset: monitor.getSourceClientOffset(),
      isDragging: monitor.isDragging(),
    })
  );

  if (!isDragging) {
    return null;
  }
  return (
    <Layer>
      <StyledPlayingField>
        <div style={getItemStyles(initialOffset, currentOffset)}>
          {item ? <Card card={item.card} /> : null}
        </div>
      </StyledPlayingField>
    </Layer>
  );
};

export default DragLayer;
