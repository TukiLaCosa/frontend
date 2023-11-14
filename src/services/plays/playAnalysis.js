import axiosClient from "../http-client/axios-client"

// función q obtiene los adyacentes
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

export const playAnalysis = async (activeId, user, game, players, setContentModal, setButtons, setHandleFunction) => {
    const adyc = getAdjacent(players, user?.id) // obtengo los adyacentes

    setContentModal('Selecciona un jugador vecino para mirar sus cartas')

    const left = document.getElementById(adyc?.left.id)
    const right = document.getElementById(adyc?.right.id)

    left.addEventListener('click', (e) => {
        selectVictim(adyc?.left.id)
    })

    right.addEventListener('click', (e) => {
        selectVictim(adyc?.right.id)
    })

    const selectVictim = async (id) => {
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
            const response = await axiosClient.post(
                `games/${game?.name}/play-action-card`,
                request
            )
        } catch (error) {
            console.error('play-action-card-error', error)
        }
    }
}