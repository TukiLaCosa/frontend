import axios from 'axios'

export const makeRequest = async (url, body) => {
  const response = await axios.post(url, body)
  if (!response.ok) {
    console.error(response)
  }
}

export const defendBetterRun = async (
  playerId,
  gameName,
  eventBetterRun,
  setContentModal,
  setButtons,
  setHandleFunction) => {
  const cardsToDefend = eventBetterRun?.defense_cards
  const url = `http://localhost:8000/games/${gameName}/play-defense-card`
  const body = {
    player_id: playerId
  }
  if (cardsToDefend.length > 0) {
    console.log('Te podes defender, selecciona una carta para defenderte')

    const buttons = [
      {
        text: 'Defenderme',
        value: true
      },
      {
        text: 'No Defenderme',
        value: false
      }
    ]

    const handleMouseDown = async (event) => {
      body.card_id = parseInt((event.target.id).replace('card_', ''))
      await makeRequest(url, body)
    }

    const handleMouseUp = (element) => {
      element.removeEventListener('mousedown', handleMouseDown)
    }

    const handleDefense = async (defense) => {
      if (defense) {
        cardsToDefend.forEach((card) => {
          const idCard = `card_${card}`
          const cardElement = document.getElementById(idCard)
          cardElement.addEventListener('mousedown', handleMouseDown)
          cardElement.addEventListener('mouseup', () => handleMouseUp(cardElement))
        })
      }
    }
    setHandleFunction(() => handleDefense)
    setButtons(buttons)
    setContentModal('Quieren intercambiar de lugar con vos, te queres defender?, Si es asi selecciona una carta')
  } else {
    await makeRequest(url, body)
  }
}

const tryChangePlace = async (body, gameName) => {
  const url = `http://localhost:8000/games/${gameName}/play-action-card`
  await makeRequest(url, body)
}

export const playBetterRun = (
  cardId,
  playerId,
  gameName,
  players,
  setPlayers,
  setContentModal) => {
  const handleMouseDown = async (event) => {
    const objective = event.target.id
    const body = {
      card_id: cardId,
      player_id: playerId,
      objective_player_id: objective
    }
    console.log(`Mouse Down ${objective}`)
    await tryChangePlace(body, gameName)
  }

  const handleMouseUp = (element) => {
    element.removeEventListener('mousedown', handleMouseDown)
  }

  players.forEach((player) => {
    const playerButton = document.getElementById(player.id)
    playerButton.addEventListener('mousedown', handleMouseDown)
    playerButton.addEventListener('mouseup', () => handleMouseUp(playerButton))
  })
  const message = 'Selecciona un jugador para cambiar de lugar'
  setContentModal(message)
}
