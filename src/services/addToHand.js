export function addToHand(setCardsPlayer, id) {
    setCardsPlayer((cardsPlayer) => {
      if (cardsPlayer.length < 5) {
        return cardsPlayer.concat({ id: id, name: "5" });
      }
      return cardsPlayer;
    });
  }