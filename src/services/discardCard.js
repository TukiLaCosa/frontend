import axios from 'axios'
import { setPath } from './setPath'
import { removeFromHand } from './removeFromHand'

export const discardCard = (setCardsPlayer, setDiscardBG, activeId, userId, gameName) => {
  const pathDiscard = async () => {
    const url = `http://localhost:8000/games/${gameName}/discard`
    const card = {
      player_id: userId,
      card_id: activeId
    }
    await axios.patch(url, card)
  }

  if (activeId === 1) {
    alert('¡No puedes descartar esta carta!')
  } else if (confirm('¿Quieres descartar esta carta?') === true) {
    pathDiscard()

    // Despues de que el back envie el evento "discard_card"
    const path = setPath(activeId)
    setDiscardBG(path)
    // Se pueden borrar las lineas de arriba

    removeFromHand(setCardsPlayer, activeId)
  } else {
    setDiscardBG('/cards/rev/revPanic.png')
  }
}
