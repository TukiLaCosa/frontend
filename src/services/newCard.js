import axios from 'axios'
import { addToHand } from './addToHand'

export const newCard = (setCardsPlayer, setTurnState, turnState, turnStates, user, game) => {
  const userId = user?.id
  const gameName = game?.id
  const body = { player_id: userId }
  const url = `http://127.0.0.1/games/${gameName}/draw-card`
  const response = axios.patch(url, body)
  if (response?.ok && turnState === turnStates.DRAW) {
    addToHand(setCardsPlayer, response?.card.id)
  }
  setTurnState(turnStates.PLAY)
}
