import axios from "axios"


export const fetchCards = async (user, setCardsPlayer) => {
    const playerId = user?.id
    try {
      const response = await axios.get(
        `http://localhost:8000/players/${playerId}/hand`
      )
      const cards = await response.data.map((card) => {
        return {
          id: card.id,
          name: card.name
        }
      })
      setCardsPlayer(cards)
      console.log(cards)
    } catch (error) {
      console.error('Error getting cards:', error)
    }
  }