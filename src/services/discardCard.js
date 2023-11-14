import axiosClient from './http-client/axios-client'
import { removeFromHand } from './removeFromHand'

export const discardCard = (setCardsPlayer, cardId, userId, gameName) => {
  const patchDiscard = async () => {
    const url = `games/${gameName}/discard`
    const card = {
      player_id: userId,
      card_id: cardId
    }
    await axiosClient.patch(url, card)
  }

  patchDiscard()

  removeFromHand(setCardsPlayer, cardId)
}
