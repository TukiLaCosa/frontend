import { initDefense } from './defense'

export const defenseFlamethrower = async (defCards, playerId, gameName, setContentModal, setButtons, setHandleFunction, setCardsPlayer) => {
  const msg = 'ALGUIEN TE QUEMA! Elegi una carta ¡Nada de Barbacoas! si queres defenderte.'
  try {
    const result = await initDefense(msg, defCards, playerId, gameName, setContentModal, setButtons, setHandleFunction, setCardsPlayer)
    return result
  } catch (error) {
    // Manejo de errores
    console.error('Error en la defensa de seducción:', error)

    return null
  }
}
