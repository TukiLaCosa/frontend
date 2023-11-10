import { initDefense } from './defense'

export const defenseSeduction = (defCards, playerId, gameName, setContentModal, setButtons, setHandleFunction, setCardsPlayer) => {
  const msg = 'Parece que te seducen. Elegi una carta ¡Aterrador!, ¡No, Gracias! o ¡Fallaste!'
  initDefense(msg, defCards, playerId, gameName, setContentModal, setButtons, setHandleFunction, setCardsPlayer)
}
