import { fetchCards } from '@/components/gameComponents/Table'
import axios from 'axios'

export const initDefense = async (msg, defCards, playerId, gameName, setContentModal, setButtons, setHandleFunction, setCardsPlayer) => {
  const selectionHandler = async (e) => {
    try {
      await axios.post(`http://localhost:8000/games/${gameName}/play-defense-card`,
        { player_id: playerId, card_id: e.target.dataset.cardId }
      )
      defCards.forEach(card => {
        const element = document.getElementById(`card_${card}`)
        element.removeEventListener('mousedown', selectionHandler)
      })
      fetchCards(playerId, selectionHandler)
    } catch (error) {
      console.error(error)
    }
  }

  if (defCards.length === 0) {
    noDefense(gameName, playerId)
    return
  }
  const handleFunction = (defDesicion) => {
    if (defDesicion) {
      addDefense(defCards, selectionHandler)
    } else {
      noDefense(gameName, playerId)
    }
  }
  setHandleFunction(() => handleFunction)
  const buttons = [
    {
      text: 'Defenderse',
      value: true
    },
    {
      text: 'No defenderse',
      value: false
    }
  ]
  setButtons(buttons)
  setContentModal(msg)
}

export const noDefense = async (gameName, playerId) => {
  try {
    await axios.post(`http://localhost:8000/games/${gameName}/play-defense-card`,
      { player_id: playerId }
    )
  } catch (error) {
    console.error('Error getting cards:', error)
  }
}

const addDefense = (cards, selectionHandler) => {
  cards.forEach(card => {
    const element = document.getElementById(`card_${card}`)
    element.dataset.cardId = card
    element.addEventListener('mousedown', selectionHandler)
  })
}
