import { addToHand } from './addToHand'

export const newCard = (setCardsPlayer, setTurnState, turnState, turnStates) => {
  if (turnState !== turnStates.DRAW) return
  const random = Math.floor(Math.random() * (108 - 2 + 1) + 2)
  addToHand(setCardsPlayer, random)
  setTurnState(turnStates.PLAY)
}
