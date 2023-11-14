import axiosClient from './http-client/axios-client'

export const exchangeIntention = async (cardId, userId, gameName) => {
  const makePostRequest = (userId, cardId) => {
    console.log(userId)
    console.log(cardId)
    return {
      player_id: userId,
      card_id: cardId
    }
  }
  const request = makePostRequest(userId, cardId)
  try {
    const response = await axiosClient.patch(
      `games/${gameName}/intention-to-interchange-card`,
      request
    )
    if (!response.ok) {
      console.log(response)
    }
  } catch (error) {
    console.error('intention-to-interchange-card', error)
  }
}

export const exchangeResponse = async (selectedCardId, userId, gameName) => {
  const makePostRequest = (selectedCardId, userId) => {
    console.log(selectedCardId)
    console.log(userId)
    return {
      player_id: userId,
      card_id: selectedCardId
    }
  }
  const request = makePostRequest(selectedCardId, userId)
  try {
    const response = await axiosClient.patch(
      `games/${gameName}/card-interchange-response`,
      request
    )
    if (!response.ok) {
      console.log(response)
    }
  } catch (error) {
    console.error('card-interchange-response', error)
  }
}
