import axios from 'axios'
import { removeFromHand } from './removeFromHand'

export const discardCard = (setCardsPlayer, cardId, userId, gameName) => {
  const patchDiscard = async () => {
    const url = `http://localhost:8000/games/${gameName}/discard`
    const card = {
      player_id: userId,
      card_id: cardId
    }
    await axios.patch(url, card)
  }

  patchDiscard()

  removeFromHand(setCardsPlayer, cardId)
}
