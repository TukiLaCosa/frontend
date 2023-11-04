import axios from 'axios'

export const getAdjacent = (players, index) => {
  const alives = players.filter((player) => player.position !== -1)
  const left = ((index - 1) % alives.length === -1)
    ? alives[alives.length - 1]
    : alives[(index - 1) % alives.length]
  const right = alives[(index + 1) % alives.length]
  return {
    left,
    right
  }
}

export const playFlamethrower = async (activeId, user, game, players) => {
  const adyc = getAdjacent(players, user?.position)

  alert('Seleccion un jugador vecino para eliminar')

  const left = document.getElementById(adyc?.left.id)
  const right = document.getElementById(adyc?.right.id)

  left.addEventListener('click', (e) => {
    deleteVictim(adyc?.left.id)
  })

  right.addEventListener('click', (e) => {
    deleteVictim(adyc?.right.id)
  })

  const deleteVictim = async (id) => {
    const idVictim = id

    const makePostRequest = (activeId, userId, idVictim) => {
      return {
        card_id: activeId,
        player_id: userId,
        objective_player_id: idVictim
      }
    }

    const request = makePostRequest(activeId, user?.id, idVictim)

    try {
      const response = await axios.post(
        `http://localhost:8000/games/${game?.name}/play-action-card`,
        request
      )
      if (response?.status !== 200) {
        console.log(response)
      }
    } catch (error) {
      console.error('play-actcion-card-error', error)
    }
  }
}
