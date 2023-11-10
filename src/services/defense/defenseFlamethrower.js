import { initDefense } from './defense'

export const defenseFlamethrower = (defCards, playerId, gameName, setContentModal, setButtons, setHandleFunction, setCardsPlayer) => {
  const msg = 'ALGUIEN TE QUEMA! Elegi una carta ¡Nada de Barbacoas! si queres defenderte.'
  initDefense(msg, defCards, playerId, gameName, setContentModal, setButtons, setHandleFunction, setCardsPlayer)
}
