import { Card } from "./domain/Card";
import { Game } from "./domain/Game";

describe("game", () => {
  it("should initialize players with decks and different colors", () => {
    const game = new Game();
    const playerOne = game.addPlayer("One");
    const playerTwo = game.addPlayer("Two");
    expect(playerOne.deck.philgrettoStack).toHaveLength(10);
    expect(playerOne.deck.row).toHaveLength(3);
    expect(playerOne.deck.faceDownReservePile).toHaveLength(40 - 13);
    expect(playerOne.deck.faceUpDiscardPile).toHaveLength(0);
    expect(playerTwo.deck.philgrettoStack).toHaveLength(10);
    expect(playerTwo.deck.row).toHaveLength(3);
    expect(playerTwo.deck.faceDownReservePile).toHaveLength(40 - 13);
    expect(playerTwo.deck.faceUpDiscardPile).toHaveLength(0);
    expect(playerOne.color).not.toBe(playerTwo.color);
  });
  it("should allow to add a cards to the playing field", () => {
    const game = new Game();
    expect(() =>
      game.placeCardOnPlayingField(new Card("green", 2), 0, 0)
    ).toThrow();
    game.placeCardOnPlayingField(new Card("green", 1), 0, 0);
    expect(() =>
      game.placeCardOnPlayingField(new Card("blue", 2), 0, 0)
    ).toThrow();
    game.placeCardOnPlayingField(new Card("green", 2), 0, 0);
    // const cardOnPhilgrettoStack =
    //   playerOne.deck.philgrettoStack[playerOne.deck.philgrettoStack.length - 1];
    // if (cardOnPhilgrettoStack && cardOnPhilgrettoStack.digit === 1) {
    //   game.placeCardOnPlayingField(cardOnPhilgrettoStack, 0, 0);
    //   playerOne.deck.philgrettoStack.pop();
    // }
    // const cardIndexInRow = playerOne.deck.row.findIndex(
    //   (card) => card?.digit === 1
    // );
    // if (cardIndexInRow !== -1) {
    //   const cardInRow = playerOne.deck.row[cardIndexInRow];
    //   if (cardInRow) {
    //     game.placeCardOnPlayingField(cardInRow, 0, 0);
    //     playerOne.deck.pullCardFromRowAtPosition(cardIndexInRow);
    //   }
    // }
  });
});
