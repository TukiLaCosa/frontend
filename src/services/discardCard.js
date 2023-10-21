import axios from 'axios'
import { setPath } from './setPath'
import { removeFromHand } from './removeFromHand'

export const discardCard = (setCardsPlayer, setDiscardBG, cardId, userId, gameName) => {
  const pathDiscard = async () => {
    const url = `http://localhost:8000/games/${gameName}/discard`
    const card = {
      player_id: userId,
      card_id: cardId
    }
    await axios.patch(url, card)
  }

  pathDiscard()
  // Despues de que el back envie el evento "discard_card"
  const path = setPath(cardId)
  setDiscardBG(path)
  // Se pueden borrar las lineas de arriba
  removeFromHand(setCardsPlayer, cardId)
}
