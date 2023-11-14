import axiosClient from "../http-client/axios-client"


export const getAdjacent = (players, id) => {
    const index = players.map((e) => e.id).indexOf(id)
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

export const playSuspicion = async (activeId, user,gameName,players, setContentModal) => {
    const adyc = getAdjacent(players,user?.id)
    setContentModal('Debes seleccionar un jugador adyacente para revelarle una carta...')
    const left = document.getElementById(adyc?.left.id)
    const right = document.getElementById(adyc?.right.id)

    left.addEventListener('click', (e) => {
        suspicionPoint(adyc?.left.id)
    })

    right.addEventListener('click', (e) => {
        suspicionPoint(adyc?.right.id)
    })
    
    const suspicionPoint = async (idVictim) => {
        const makePostRequest = (activeId, userId, idVictim) => {
            return {
            card_id: activeId,
            player_id: userId,
            objective_player_id: idVictim
            }
        }
        const request = makePostRequest(activeId,user?.id, idVictim)
        try {
            const response = await axiosClient.post(
            `games/${gameName}/play-action-card`,
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