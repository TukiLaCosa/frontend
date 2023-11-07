import axios from "axios"

export const exchangeIntention = async (cardId, userId,gameName) => {
    const makePostRequest = (userId, cardId) => {
      console.log(userId)
      console.log(cardId)
        return {
          'player_id': userId,
          'card_id': cardId,
        }
      }
      const request = makePostRequest(userId, cardId)
      try {
        const response = await axios.patch(
          `http://localhost:8000/games/${gameName}/intention-to-interchange-card`,
          request
        )
      } catch (error) {
        console.error('intention-to-interchange-card', error)
      }     
}

export const exchangeResponse = async (selectedCardId, userId, gameName, eventTurn) => {
  const makePostRequest = (selectedCardId,userId, event) => {
    console.log(selectedCardId)
    console.log(userId)
      return {
        'player_id': userId,
        'card_id': selectedCardId,
        'objective_player_id': event.player_id, //ID del jugador que inicia la intencion
        'objective_card_id': event.card_to_exchange
      }
    }
    const request = makePostRequest(selectedCardId, userId, eventTurn)
    try {
      const response = await axios.patch(
        `http://localhost:8000/games/${gameName}/card-interchange-response`,
        request
      )
    } catch (error) {
      console.error('card-interchange-response', error)
    }  
}