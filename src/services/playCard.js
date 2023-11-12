import { removeFromHand } from './removeFromHand'
import { playFlamethrower } from './plays/playFlamethrower'
import { playSeduction } from './plays/playSeduction'
import { playWhisky } from './plays/playWhisky'
import { playWatchYourBack } from './plays/playWatchYourBack'
import { playSuspicion } from './plays/playSuspicion'
import cards from './cards.JSON'

export const playCard = (
  setCardsPlayer,
  activeId,
  user,
  game,
  players,
  setContentModal,
  setButtons,
  setHandleFunction,
  hand
) => {
  const activeCard = cards.cards[activeId - 1].name
  const playerId = user?.id
  const gameName = game?.name

  if (activeCard === 'La Cosa' || activeCard === '¡Infectado!') {
    setContentModal('¡No puedes jugar esta carta!')
    return
  }
  const buttons = [
    {
      text: 'Si',
      value: true
    },
    {
      text: 'No',
      value: false
    }
  ]
  setButtons(buttons)
  setHandleFunction(() => handleOption)
  setContentModal('¿Seguro que quieres jugar esta carta?')

  const handleOption = (value) => {
    if (value) {
      removeFromHand(setCardsPlayer, activeId)

      switch (activeCard) {
        case '¡Infectado!':
          console.log('Infected!')
          break
        case 'Lanzallamas':
          console.log('Flamethrower')
          playFlamethrower(activeId, user, game, players, setContentModal)
          break
        case 'Análisis':
          console.log('Analysis')
          break
        case 'Hacha':
          console.log('Axe')
          break
        case 'Sospecha':
          console.log('Suspicion')
          playSuspicion(activeId,user,gameName,players,setContentModal)
          break
        case 'Whisky': // whisky
          console.log('Whisky')
          playWhisky(activeId, playerId, gameName)
          break
        case 'Determinación':
          console.log('Determination')
          break
        case 'Vigila tus espaldas': // vigila tus espaldas
          console.log('Watch Your Back')
          playWatchYourBack(activeId, playerId, gameName)
          break
        case '¡Cambio de lugar!':
          console.log('Switch')
          break
        case '¡Más vale que corras!':
          console.log('You Better Run')
          break
        case 'Seducción':
          playSeduction(activeId, user.id, game.name, players, hand, setContentModal)
          console.log('Seduction')
          break
        case 'Aterrador':
          console.log('Frightening')
          break
        case 'Aquí estoy bien':
          console.log('Im Fine Here')
          break
        case '¡No, gracias!':
          console.log('No, Thanks!')
          break
        case '¡Fallaste!':
          console.log('You Missed!')
          break
        case '¡Nada de barbacoas!':
          console.log('No Barbacue')
          break
        case 'Cuarentena':
          console.log('Quarantine')
          break
        case 'Puerta atrancada':
          console.log('Locked Door')
          break
        case 'Cuerdas podridas':
          console.log('Rotten Ropes')
          break
        case 'Uno, dos…':
          console.log('One, Two...')
          break
        case 'Tres, cuatro…':
          console.log('Three, Four...')
          break
        case '¿Es aquí la fiesta?':
          console.log('Is The Party Here?')
          break
        case '¡Sal de aquí!':
          console.log('Get Out Of Here!')
          break
        case 'Olvidadizo':
          console.log('Forgetful')
          break
        case 'Vuelta y vuelta':
          console.log('Round And Round')
          break
        case '¿No podemos ser amigos?':
          console.log('We Can Not Be Friends?')
          break
        case 'Cita a ciegas':
          console.log('Blind Date')
          break
        case '¡Ups!':
          console.log('Ups!')
          break
        case 'Que quede entre nosotros…':
          console.log('Let Stay It Between Us')
          break
        case 'Revelaciones':
          console.log('Revelations')
          break
        default:
          console.log('No lo se rick')
          break
      }
    }
  }
}
