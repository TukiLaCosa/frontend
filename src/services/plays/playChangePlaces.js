import axios from 'axios'

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
  const url = `http://localhost:8000/games/${gameName}/play-action-card`
  console.log(url, body)
  const response = await axios.post(url, body)
  console.log(response)
}

export const defendChangePlaces = async (
  playerId,
  gameName,
  eventChangePlaces,
  setContentModal,
  setButtons,
  setHandleFunction) => {
  const cardsToDefend = eventChangePlaces?.defense_cards
  console.log('Los que me llego es: ', cardsToDefend)
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
      body.card_id = (event.target.id).replace('card_', '')
      console.log('body url: ', body, url)
      const response = await axios.post(url, body)
      console.log(response)
    }

    const handleMouseUp = (element) => {
      console.log('Removiendo de: ', element)
      element.removeEventListener('mousedown', handleMouseDown)
    }

    const handleDefense = async (defense) => {
      if (defense) {
        console.log('Defendiendo con: ', cardsToDefend)
        cardsToDefend.forEach((card) => {
          const idCard = `card_${card}`
          const cardElement = document.getElementById(idCard)
          cardElement.addEventListener('mousedown', handleMouseDown)
          cardElement.addEventListener('mouseup', () => handleMouseUp(idCard))
        })
      }
    }
    setHandleFunction(() => handleDefense)
    setButtons(buttons)
    setContentModal('Quieren intercambiar de lugar con vos, te queres defender?, Si es asi selecciona una carta')
  } else {
    console.log('No puedo defenderme: ', url, body)
    const response = await axios.post(url, body)
    console.log(response)
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

  console.log(leftPlayer)
  console.log(rightPlayer)

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

  const handleMouseUp = (player) => {
    console.log('Mouse Up')
    player.removeEventListener('mousedown', handleMouseDown)
  }

  leftPlayer.addEventListener('mousedown', handleMouseDown)
  leftPlayer.addEventListener('mouseup', handleMouseUp(leftPlayer))
  rightPlayer.addEventListener('mousedown', handleMouseDown)
  rightPlayer.addEventListener('mouseup', () => handleMouseUp(rightPlayer))
}
