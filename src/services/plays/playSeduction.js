import cards from '../cards.JSON'
import axios from 'axios'

export const playSeduction = async (activeId, idPlayer, gameName, players, hand, setContentModal) => {
  // Función para mostrar una alerta y esperar a que el jugador haga una selección.
  const waitForSelection = (message, options) => {
    return new Promise((resolve) => {
      setContentModal(message)

      const selectionHandler = (e) => {
        resolve(e.target.id)
      }

      options.forEach(option => {
        const element = document.getElementById(option)
        element.addEventListener('mousedown', selectionHandler)
      })

      // También debes eliminar los event listeners al resolver la promesa.
      const removeEventListeners = () => {
        options.forEach(option => {
          const element = document.getElementById(option)
          element.removeEventListener('mousedown', selectionHandler)
        })
      }

      // Asegúrate de que los event listeners se eliminen al resolver la promesa o cuando ocurra un error.
      resolve.removeListeners = removeEventListeners
    })
  }

  try {
    const objetives = players.filter((player) => player.position !== -1 && player.id !== idPlayer)
    const selectedVictim = await waitForSelection('Selecciona un jugador vecino para intercambiar', objetives.map(player => player.id))
    const cardIds = hand.map(card => card.id)
    const nonSelectableCards = cardIds.filter(cardId => {
      const nameCard = cards.cards[cardId - 1].name
      return nameCard === 'La Cosa' && nameCard === '¡Infectado!'
    })

    const selectableCards = cardIds.filter(cardId => !nonSelectableCards.includes(cardId))
    const selectedCard = await waitForSelection('Selecciona la carta que quieres intercambiar', selectableCards.map(cardId => 'card_' + cardId))
    const cardID = selectedCard.replace(/^card_/, '')

    const request = {
      card_id: activeId,
      player_id: idPlayer,
      objective_player_id: selectedVictim,
      card_to_exchange: cardID
    }
    await axios.post(`http://localhost:8000/games/${gameName}/play-action-card`, request)
  } catch (error) {
    console.error('play-action-card-error', error)
  }
}
