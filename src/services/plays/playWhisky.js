import axios from 'axios'

// para armar el body
export const makePostRequest = (activeId, playerId, victimId) => {
    return {
      card_id: activeId,
      player_id: playerId,
      objective_player_id: victimId
    }
  }
  
  // función q se llamará al jugar la carta de whisky
  export const playWhisky = async (activeId, playerId, gameName) => {
    const request = makePostRequest(activeId, playerId)
    try {
      const response = await axios.post(
        `http://localhost:8000/games/${gameName}/play-action-card`,
        request
      )
      if (!response?.ok) {
        console.log(response)
      }
    } catch (error) {
      console.error('play-actcion-card-error', error)
    }
  }