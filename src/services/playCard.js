import { setPath } from './setPath'
import { removeFromHand } from './removeFromHand'
import cards from './cards.JSON'

export const playCard = (setCardsPlayer, setPlayBG, activeId) => {
  const activeCard = cards.cards[activeId - 1].name

  if (activeCard === 'The Thing' ||
    activeCard === 'Infected!') {
    alert('¡No se puede jugar esta carta!')
    return false
  }

  if (confirm('¿Quieres jugar esta carta?')) {
    const path = setPath(activeId)
    setPlayBG(path)
    removeFromHand(setCardsPlayer, activeId)

    switch (activeCard) {
      case 'Infected!':
        console.log('Infected!')
        break
      case 'Flamethrower':
        console.log('Flamethrower')
        break
      case 'Analysis':
        console.log('Analysis')
        break
      case 'Axe':
        console.log('Axe')
        break
      case 'Suspicion':
        console.log('Suspicion')
        break
      case 'Whisky':
        console.log('Whisky')
        break
      case 'Determination':
        console.log('Determination')
        break
      case 'Watch Your Back':
        console.log('Watch Your Back')
        break
      case 'Switch':
        console.log('Switch')
        break
      case 'You Better Run':
        console.log('You Better Run')
        break
      case 'Seduction':
        console.log('Seduction')
        break
      case 'Frightening':
        console.log('Frightening')
        break
      case 'Im Fine Here':
        console.log('Im Fine Here')
        break
      case 'No, Thanks!':
        console.log('No, Thanks!')
        break
      case 'You Missed!':
        console.log('You Missed!')
        break
      case 'No Barbacue':
        console.log('No Barbacue')
        break
      case 'Quarantine':
        console.log('Quarantine')
        break
      case 'Locked Door':
        console.log('Locked Door')
        break
      case 'Rotten Ropes':
        console.log('Rotten Ropes')
        break
      case 'One, Two...':
        console.log('One, Two...')
        break
      case 'Three, Four...':
        console.log('Three, Four...')
        break
      case 'Is The Party Here?':
        console.log('Is The Party Here?')
        break
      case 'Get Out Of Here!':
        console.log('Get Out Of Here!')
        break
      case 'Forgetful':
        console.log('Forgetful')
        break
      case 'Round And Round':
        console.log('Round And Round')
        break
      case 'We Can Not Be Friends?':
        console.log('We Can Not Be Friends?')
        break
      case 'Blind Date':
        console.log('Blind Date')
        break
      case 'Ups!':
        console.log('Ups!')
        break
      case 'Let Stay It Between Us':
        console.log('Let Stay It Between Us')
        break
      case 'Revelations':
        console.log('Revelations')
        break
      default:
        console.log('No lo se rick')
        break
    }
    return true
  }
}
