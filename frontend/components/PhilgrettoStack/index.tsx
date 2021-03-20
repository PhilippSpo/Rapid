import { Card as CardType } from "../../pages";
import { Card } from "../Card";
import CardStack from "../CardStack";
import RandomRotate from "../RandomRotate";

const PhilgrettoStack = (props: {
  philgrettoStack: (CardType | undefined)[];
}) => (
  <CardStack>
    {props.philgrettoStack.map((philgrettoStackCard, index) =>
      philgrettoStackCard ? (
        <li key={`${philgrettoStackCard.color}-${philgrettoStackCard.digit}`}>
          <RandomRotate
            interactive={index === props.philgrettoStack.length - 1}
          >
            <Card
              card={philgrettoStackCard}
              source={
                index === props.philgrettoStack.length - 1
                  ? "philgrettoStack"
                  : undefined
              }
            />
          </RandomRotate>
        </li>
      ) : null
    )}
  </CardStack>
);

export default PhilgrettoStack;
