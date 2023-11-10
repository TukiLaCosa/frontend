import axios from 'axios'

// obtiene los adyacentes
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

    const left = document.getElementById(adyc?.left.id) // obtengo el boton del izq
    const right = document.getElementById(adyc?.right.id) // obtengo el boton del der

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
            const response = await axios.post( // en teoria dsp de pegarle a este endpoint, el back devuelve las cartas q tiene la victima en su mano
                // entonces, lo q sigue es muy parecido al whisky (lo que está en el handlerWhisky)
                `http://localhost:8000/games/${game?.name}/play-action-card`,
                request
            )
            if (response?.status !== 200) {
                console.log(response)
            }
            console.log(response)
            console.log(response.data)
            const data = response.data // guardo la data
            const cards = await data.map((card) => { // mapeo los datos q trae
                return {
                    id: card.id,
                    name: card.name
                }
            })
            console.log(cards)
            const cardNames = cards.map((card) => card.name) // obtengo solo los nombres
            const cardNamesString = cardNames.join(', ')

            const buttons = [
                {
                    text: 'Entendido',
                    value: true
                }
            ]
            setButtons(buttons)
            const handleEntendido = (value) => {
                setContentModal('')
            }
            setHandleFunction(() => handleEntendido)
            setContentModal(`Las cartas de ${idVictim} son: ${cardNamesString}`) // NECESITO EL NOMBRE DE LA VICTIMA!!
            // funciona pero ojo con el modal del intercambio obligatorio
        } catch (error) {
            console.error('play-action-card-error', error)
        }
    }
}