import { addToHand } from './addToHand'

export const newCard = (setCardsPlayer) => {
  const random = Math.floor(Math.random() * (108 - 2 + 1) + 2)
  addToHand(setCardsPlayer, random)
}
