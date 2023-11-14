export const addToHand = (setCardsPlayer, id) => {
  setCardsPlayer((cardsPlayer) => {
    if (cardsPlayer.length < 5) {
      return cardsPlayer.concat({ id, name: '5' })
    }
    return cardsPlayer
  })
}
