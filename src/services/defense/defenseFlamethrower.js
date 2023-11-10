import { fetchCards } from '@/components/gameComponents/Table'
import axios from 'axios'

export const defenseFlamethrower = (defCards, playerId, gameName, setContentModal, setButtons, setHandleFunction, setCardsPlayer) => {
  const selectionHandler = (e) => {
    axios.post(`http://localhost:8000/games/${gameName}/play-defense-card`,
      { player_id: playerId, card_id: e.target.dataset.cardId }
    )
    defCards.forEach(card => {
      const element = document.getElementById(`card_${card}`)
      element.removeEventListener('mousedown', selectionHandler)
    })
  }

  const defense = () => {
    defCards.forEach(card => {
      const element = document.getElementById(`card_${card}`)
      element.dataset.cardId = card
      element.addEventListener('mousedown', selectionHandler)
    })
    fetchCards(playerId, setCardsPlayer)
  }

  const noDefense = async () => {
    try {
      await axios.post(`http://localhost:8000/games/${gameName}/play-defense-card`,
        { player_id: playerId }
      )
    } catch (error) {
      console.error('Error getting cards:', error)
    }
  }
  if (defCards.length === 0) {
    noDefense()
    return
  }
  const handleFunction = (defDesicion) => {
    if (defDesicion) {
      defense()
    } else {
      noDefense()
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
  setContentModal('Elegi una carta ¡Nada de Barbacoas! si queres defenderte.')
}
