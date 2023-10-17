import { setPath } from './setPath'
import { removeFromHand } from './removeFromHand'

export const discardCard = (setCardsPlayer, setDiscardBG, activeId) => {
  if (activeId === 1) {
    alert('¡No puedes descartar esta carta!')
  } else if (confirm('¿Quieres descartar esta carta?') === true) {
    const path = setPath(activeId)
    console.log(activeId)
    console.log(path)
    setDiscardBG(path)
    removeFromHand(setCardsPlayer, activeId)
  } else {
    setDiscardBG('/cards/rev/revPanic.png')
  }
}
