import axios from 'axios'

export const makePostRequest = (activeId, playerId, victimId) => {
  return {
    card_id: activeId,
    player_id: playerId,
    objective_player_id: victimId
  }
}

// función q se llamará al jugar la carta de Vigila tus espaldas
export const playWatchYourBack = async (activeId, playerId, gameName) => {
  const request = makePostRequest(activeId, playerId)
  try {
    const response = await axios.post( // desde el front se le pega al endpoint y luego el back manda el evento de played_card y el de new_turn
      `http://localhost:8000/games/${gameName}/play-action-card`,
      request
    )
    if (!response?.ok) {
      console.log(response)
    }
  } catch (error) {
    console.error('play-action-card-error', error)
  }
}
