import axios from "axios"


//exchangeIntention(card.id, user.id, game?.name, setShow)
export const exchangeIntention = async (cardId, userId,gameName, setShow) => {
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
        setShow('')
      } catch (error) {
        console.error('intention-to-interchange-card', error)
      }
      
}