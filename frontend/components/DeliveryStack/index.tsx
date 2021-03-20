import { Card as CardType } from "../../pages";
import { Card } from "../Card";
import CardStack from "../CardStack";
import RandomRotate from "../RandomRotate";

const DeliveryStack = (props: { deliveryStack: CardType[] }) => (
  <CardStack>
    {props.deliveryStack.map((deliveryStackCard, index) => (
      <li key={`${deliveryStackCard.color}-${deliveryStackCard.digit}`}>
        <RandomRotate interactive={index === props.deliveryStack.length - 1}>
          <Card
            card={deliveryStackCard}
            source={
              index === props.deliveryStack.length - 1
                ? "deliveryStack"
                : undefined
            }
          />
        </RandomRotate>
      </li>
    ))}
  </CardStack>
);

export default DeliveryStack;
