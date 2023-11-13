import axios from 'axios'
import { removeFromHand } from '../removeFromHand'

export const updateCardsAfterDefense = async (playerId, setCardsPlayer) => {
  const url = `http://localhost:8000/players/${playerId}/hand`
  const response = await axios.get(url)
  if (response.status === 200) {
    setCardsPlayer(response.data)
  }
}

export const handleChangePlaces = (response) => {
  console.log(response)
}

export const makeRequest = async (url, body) => {
  console.log('haciendo request: ', url, body)
  const response = await axios.post(url, body)
  return response
}

export const defendBetterRun = async (
  playerId,
  gameName,
  eventBetterRun,
  setContentModal,
  setButtons,
  setHandleFunction,
  setCardsPlayer) => {
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
      console.log('POr llamar a la request')
      const response = await makeRequest(url, body)
      handleChangePlaces(response)
      removeFromHand(setCardsPlayer, body.card_id)
      updateCardsAfterDefense(playerId, setCardsPlayer)
    }

    const handleMouseUp = (element) => {
      element?.removeEventListener('mousedown', handleMouseDown)
    }

    const handleDefense = async (defense) => {
      if (defense) {
        cardsToDefend.forEach((card) => {
          const idCard = `card_${card}`
          const cardElement = document.getElementById(idCard)
          cardElement.addEventListener('mousedown', handleMouseDown)
          cardElement.addEventListener('mouseup', () => handleMouseUp(cardElement))
        })
      } else {
        const response = await makeRequest(url, body)
        handleChangePlaces(response)
      }
    }
    setHandleFunction(() => handleDefense)
    setButtons(buttons)
    setContentModal('Quieren intercambiar de lugar con vos, te queres defender?, Si es asi selecciona una carta')
  } else {
    const response = await makeRequest(url, body)
    handleChangePlaces(response)
  }
}

const tryChangePlace = async (body, gameName) => {
  console.log('Intentando cambio de lugar')
  const url = `http://localhost:8000/games/${gameName}/play-action-card`
  const response = await makeRequest(url, body)
  if (!response.ok) {
    console.log(response)
  }
}

export const playBetterRun = (
  cardId,
  playerId,
  gameName,
  players,
  setPlayers,
  setContentModal) => {
  const handleMouseDown = async (event) => {
    console.log('Manejando click')
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
    console.log(player)
    playerButton.addEventListener('mousedown', handleMouseDown)
    playerButton.addEventListener('mouseup', () => handleMouseUp(playerButton))
  })
  const message = 'Selecciona un jugador para cambiar de lugar'
  setContentModal(message)
}
