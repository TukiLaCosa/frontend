import axios from 'axios'

// obtiene los jugadores adyacentes
export const getAdjacent = (players, id) => {
  console.log(players)
  const index = players.map((e) => e.id).indexOf(id)
  const alives = players.filter((player) => player.position !== -1)
  const left = ((index - 1) % alives.length === -1)
    ? alives[alives.length - 1]
    : alives[(index - 1) % alives.length]
  const right = alives[(index + 1) % alives.length]
  return {
    left,
    right
  }
}

// para armar el body
export const makePostRequest = (activeId, playerId, victimId) => {
    return {
      card_id: activeId,
      player_id: playerId,
      objective_player_id: victimId
    }
  }
  
  // función q se llamará al jugar la carta de Analysys
  export const playAnalysis = async (activeId, playerId, gameName) => {
    const adyc = getAdjacent(players, idPlayer) // obtengo los adyacentes
    setContentModal('Selecciona un jugador vecino para mirar sus cartas')
  
    const left = document.getElementById(adyc?.left.id) // jugador de la izq
    const right = document.getElementById(adyc?.right.id) // jugador de la der
  
    left.addEventListener('click', (e) => {
      selectionVictim(adyc?.left.id)
    })
  
    left.addEventListener('click', (e) => {
      selectedVictim(adyc?.right.id)
    })
  
    const selectionVictim = async (id) => {
      const victimId = id
    }

    const request = makePostRequest(activeId, playerId, victimId)
    try {
      const response = await axios.post(
        `http://localhost:8000/games/${gameName}/play-action-card`,
        request
      )
      if (!response?.ok) {
        console.log(response)
      }
    } catch (error) {
      console.error('play-action-card-error', error)
    }
  }


// toma id de la carta de acc, id del jugador q la juega, nombre de la partida, jugadores(?), hand(?), seter
// export const playAnalysis = async (activeId, idPlayer, gameName, players, hand, setContentModal) => {
//   const adyc = getAdjacent(players, idPlayer)
//   setContentModal('Selecciona un jugador vecino para mirar sus cartas')

//   const left = document.getElementById(adyc?.left.id) // jugador de la izq
//   const rigth = document.getElementById(adyc?.right.id) // jugador de la der

//   left.addEventListener('click', (e) => {
//     selectionVictim(adyc?.left.id)
//   })

//   left.addEventListener('click', (e) => {
//     selectedVictim(adyc?.right.id)
//   })

//   const selectionVictim = async (id) => {
//     const victimId = id
//   }

//   // Función para mostrar una alerta y esperar a que el jugador haga una selección.
//   const waitForSelection = (message, options) => {
//     return new Promise((resolve) => {
//       setContentModal(message)

//       const selectionHandler = (e) => {
//         resolve(e.target.id)
//       }

//       options.forEach(option => {
//         const element = document.getElementById(option)
//         element.addEventListener('click', selectionHandler)
//       })

//       // También debes eliminar los event listeners al resolver la promesa.
//       const removeEventListeners = () => {
//         options.forEach(option => {
//           const element = document.getElementById(option)
//           element.removeEventListener('click', selectionHandler)
//         })
//       }

//       // Asegúrate de que los event listeners se eliminen al resolver la promesa o cuando ocurra un error.
//       resolve.removeListeners = removeEventListeners
//     })
//   }

//   try {
//     const objetives = players.filter((player) => player.position !== -1 && player.id !== idPlayer)
//     const selectedVictim = await waitForSelection('Selecciona un jugador vecino para mirar una de sus cartas', objetives.map(player => player.id))
//     const cardIds = hand.map(card => card.id)
//     const nonSelectableCards = cardIds.filter(cardId => {
//       const nameCard = cards.cards[cardId - 1].name
//       return nameCard === 'La Cosa' && nameCard === '¡Infectado!'
//     })

//     const selectableCards = cardIds.filter(cardId => !nonSelectableCards.includes(cardId))
//     const selectedCard = await waitForSelection('Selecciona la carta que quieres intercambiar', selectableCards.map(cardId => 'card_' + cardId))
//     const cardID = selectedCard.replace(/^card_/, '')

//     const request = {
//       card_id: activeId,
//       player_id: idPlayer,
//       objective_player_id: selectedVictim,
//       card_to_exchange: cardID
//     }
//     await axios.post(`http://localhost:8000/games/${gameName}/play-action-card`, request)
//   } catch (error) {
//     console.error('play-action-card-error', error)
//   }
// }