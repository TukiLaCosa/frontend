import axios from 'axios'
import { addToHand } from './addToHand'
import { turnStates } from './handlerTurn'

export const newCard = async (setCardsPlayer, turnState, userId, gameName) => {
  if (turnState === turnStates.DRAW) {
    const body = { player_id: userId }
    const url = `http://localhost:8000/games/${gameName}/draw-card`
    const response = await axios.patch(url, body)
    if (response?.status === 200) {
      addToHand(setCardsPlayer, response.data.id)
    } else {
      console.log('Error response: ', response)
    }
  } else {
    alert('No es tu turno')
  }
}
