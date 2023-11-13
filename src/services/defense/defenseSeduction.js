import { initDefense } from './defense'

export const defenseSeduction = async (defCards, playerId, gameName, setContentModal, setButtons, setHandleFunction, setCardsPlayer) => {
  const msg = 'Quieren intercambiar. Elegi una carta ¡Aterrador!, ¡No, Gracias! o ¡Fallaste!'

  try {
    const result = await initDefense(msg, defCards, playerId, gameName, setContentModal, setButtons, setHandleFunction, setCardsPlayer);
    return result
  } catch (error) {
    // Manejo de errores
    console.error('Error en la defensa de seducción:', error)

    return null
  }
}
