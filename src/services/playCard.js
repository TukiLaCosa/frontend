import { removeFromHand } from './removeFromHand'
import { playFlamethrower } from './plays/playFlamethrower'
import cards from './cards.JSON'

export const playCard = (
  setCardsPlayer,
  activeId,
  user,
  game,
  players
) => {
  const activeCard = cards.cards[activeId - 1].name

  if (activeCard === 'La Cosa' || activeCard === '¡Infectado!') {
    alert('¡No se puede jugar esta carta!')
    return
  }

  if (confirm('¿Quieres jugar esta carta?')) {
    removeFromHand(setCardsPlayer, activeId)

    switch (activeCard) {
      case '¡Infectado!':
        console.log('Infected!')
        break
      case 'Lanzallamas':
        console.log('Flamethrower')
        // setShow('Flamethrower')
        playFlamethrower(activeId, user, game, players)
        break
      case 'Análisis':
        console.log('Analysis')
        break
      case 'Hacha':
        console.log('Axe')
        break
      case 'Sospecha':
        console.log('Suspicion')
        break
      case 'Whisky':
        console.log('Whisky')
        break
      case 'Determinación':
        console.log('Determination')
        break
      case 'Vigila tus espaldas':
        console.log('Watch Your Back')
        break
      case '¡Cambio de lugar!':
        console.log('Switch')
        break
      case '¡Más vale que corras!':
        console.log('You Better Run')
        break
      case 'Seducción':
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
    return true
  }
}
