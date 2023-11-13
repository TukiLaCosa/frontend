import axios from 'axios'
import { removeFromHand } from '../removeFromHand'

export const updateCardsAfterDefense = async (playerId, setCardsPlayer) => {
  const url = `http://localhost:8000/players/${playerId}/hand`
  const response = await axios.get(url)
  if (response.status === 200) {
    setCardsPlayer(response.data)
  }
}

export const setFPlayers = async (gameName, setPlayers, eventTurn, setNewRecord) => {
  const url = `http://localhost:8000/games/${gameName}`
  const response = await axios.get(url)
  if (response.status === 200) {
    console.log(response)
    const players = response.data.list_of_players
    const playerA = players.findIndex((player) => player.id === eventTurn?.player_id)
    const playerB = players.findIndex((player) => player.id === eventTurn?.objective_player_id)
    const msg = players[playerA].name + ' cambio de lugar con ' + players[playerB].name
    const sortedPlayers = players.sort(
      (a, b) => a.position - b.position
    )
    setNewRecord(msg)
    setPlayers(sortedPlayers)
  } else {
    console.log(response)
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

export const getAdjacentIndex = (players, id) => {
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

const tryChangePlace = async (body, gameName) => {
  console.log('Intentando cambio de lugar')
  const url = `http://localhost:8000/games/${gameName}/play-action-card`
  const response = await makeRequest(url, body)
  if (!response.ok) {
    console.log(response)
  }
}

export const defendChangePlaces = async (
  playerId,
  gameName,
  eventChangePlaces,
  setContentModal,
  setButtons,
  setHandleFunction,
  setCardsPlayer) => {
  const cardsToDefend = eventChangePlaces?.defense_cards
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

export const playChangePlaces = (
  cardId,
  playerId,
  gameName,
  players,
  setPlayers,
  setContentModal
) => {
  const adyc = getAdjacentIndex(players, playerId)
  const message = 'Selecciona un jugador para cambiar de lugar'
  setContentModal(message)
  const leftId = adyc?.left.id
  const rightId = adyc?.right.id
  const leftPlayer = document.getElementById(leftId)
  const rightPlayer = document.getElementById(rightId)

  const handleMouseDown = async (event) => {
    const objective = event.target.id
    const body = {
      card_id: cardId,
      player_id: playerId,
      objective_player_id: objective
    }
    console.log('Manejando click')
    await tryChangePlace(body, gameName)
  }

  const handleMouseUp = (player) => {
    player.removeEventListener('mousedown', handleMouseDown)
  }
  console.log(leftPlayer)
  console.log(rightPlayer)
  leftPlayer.addEventListener('mousedown', handleMouseDown)
  leftPlayer.addEventListener('mouseup', handleMouseUp(leftPlayer))
  rightPlayer.addEventListener('mousedown', handleMouseDown)
  rightPlayer.addEventListener('mouseup', () => handleMouseUp(rightPlayer))
}
