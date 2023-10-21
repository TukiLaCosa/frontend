import { addToHand } from './addToHand'
import { turnStates } from './handlerTurn'

export const newCard = (setCardsPlayer, setTurnState, turnState) => {
  if (turnState !== turnStates.DRAW) return
  const random = Math.floor(Math.random() * (108 - 2 + 1) + 2)
  addToHand(setCardsPlayer, random)
  setTurnState(turnStates.PLAY)
}
