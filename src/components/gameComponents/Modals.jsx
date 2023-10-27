import { useUserGame } from '@/services/UserGameContext'
import { discardCard } from '@/services/discardCard'
import { deleteGame } from '@/services/deleteGame'
import { playFlamethrower } from '@/services/playCard'
import { exchangeIntention } from '@/services/exchange'

const confirmDiscard = (
  setShow,
  { setCardsPlayer, cardId },
  userId,
  gameName
) => {
  discardCard(setCardsPlayer, cardId, userId, gameName)
  setShow('')
}

const endedGame = (gameName, setShow) => {
  deleteGame(gameName)
  setShow('')
}

const flamethrower = (cardId, userId, victimId, gameName, setShow) => {
  playFlamethrower(cardId, userId, victimId, gameName)
  setShow('')
}

// exchangeInt(card.id, user.id, setShow)
// const exchangeInt = (cardId, userId, setShow) => {
//   exchangeIntention(cardId,userId,setShow)
//   setShow('')
// }

const getAdjacent = (players, index) => {
  const left = ((index - 1) % players.length === -1)
    ? players[players.length - 1]
    : players[(index - 1) % players.length]
  const right = players[(index + 1) % players.length]
  console.log('posicion:' + index)
  console.log('left' + left)
  console.log('right' + right)
  return {
    left,
    right
  }
}

function Modals ({
  show,
  setShow,
  discardParams,
  flamethrowerParams,
  endedGameParams,
  eliminatedPlayerParams,
  exchangeParams
}) {
  const { playingCardId, players } = flamethrowerParams
  const { winners, losers, wasTheThing } = endedGameParams
  const { eliminatedPlayerName } = eliminatedPlayerParams
  const { user, game } = useUserGame()
  const {cardsPlayer, setTurnState} = exchangeParams

  if (show === '') {
    return null
  } else if (show === 'discard') {
    return (
      <div className='modal is-active'>
        <div className='modal-background'></div>
        <div className='modal-card'>
          <header className='modal-card-head'>
            <p className='modal-card-title'>Confirmación</p>
            <button
              className='delete'
              aria-label='close'
              onClick={() => setShow('')}
            ></button>
          </header>
          <section className='modal-card-body has-text-centered'>
            ¿Realmente quieres descartar esta carta?
          </section>
          <footer className='modal-card-foot is-justify-content-center'>
            <button
              className='button is-success'
              onClick={() => {
                confirmDiscard(setShow, discardParams, user?.id, game?.name)
                setTurnState('EXCHANGE')
                setShow('exchange-intention')
              }}
            >
              Sí
            </button>
            <button className='button is-danger' onClick={() => setShow('')}>
              No
            </button>
          </footer>
        </div>
      </div>
    )
  } else if (show === 'Flamethrower') {
    return (
      <div className='modal is-active'>
        <div className='modal-background'></div>
        <div className='modal-card'>
          <header className='modal-card-head'>
            <p className='modal-card-head'>¿A quien quieres quemar?</p>
          </header>
          <section>
            {/* <button className='button is-danger' onClick={() => setShow('')}>
              Cancelar
            </button> */}
            <button
              className='button is-success'
              onClick={() =>
                flamethrower(
                  playingCardId,
                  user.id,
                  getAdjacent(players, user.position).left.id,
                  game.name,
                  setShow
                )}
            >
              Jugador: {getAdjacent(players, user.position).left.name}
            </button>
            <button
              className='button is-success'
              onClick={() =>
                flamethrower(
                  playingCardId,
                  user.id,
                  getAdjacent(players, user.position).right.id,
                  game.name,
                  setShow
                )}
            >
              Jugador: {getAdjacent(players, user.position).right.name}
            </button>
          </section>
        </div>
      </div>
    )
  } else if (show === 'gameEnded') {
    return (
      <div className='modal is-active'>
        <div
          className='modal-background'
          onClick={() => {
            setShow('')
          }}
        />
        <div className='modal-card'>
          <header className='modal-card-head'>
            <p className='modal-card-title'>
              La partida ha finalizado y estos son los resultados
            </p>
          </header>
          <section className='modal-card-body'>
            <div>
              <span className='title'>Ganadores:</span>
              <ul className='ul'>
                {winners.map((winner, index) => (
                  <li key={index}>{winner}</li>
                ))}
              </ul>
            </div>
            <div>
              <span className='title'>Perdedores:</span>
              <ul className='ul'>
                {losers.map((loser, index) => (
                  <li key={index}>{loser}</li>
                ))}
              </ul>
            </div>
            <div>
              <span className='title'>La Cosa:</span>
              <p>{wasTheThing}</p>
            </div>
          </section>
          <button
            className='button is-success is-tuki'
            onClick={() => {
              endedGame(game.name, setShow)
            }}
          >
            AFUERA
          </button>
        </div>
      </div>
    )
  } else if (show === 'playerEliminated') {
    return (
      <div className='modal is-active'>
        <div
          className='modal-background'
          onClick={() => {
            setShow('')
          }}
        />
        <div className='modal-card'>
          <header className='modal-card-head'>
            <p className='modal-card-title'>
              UN JUGADOR FUE ELIMNADO :0
            </p>
          </header>
          <section className='modal-card-body'>
            <div>
              <span className='title'>EL nombre del jugador eliminado: {eliminatedPlayerName}</span>
            </div>
          </section>
          <button
            className='button is-success is-tuki'
            onClick={() => {
              setShow('')
            }}
          >
            OK
          </button>
        </div>
      </div>
    )
  } else if (show == "exchange-intention") {
    return (
      <div className='modal is-active'>
        <div
          className='modal-background'
          onClick={() => {
            //setShow('') Queremos que si o si seleccione una carta
          }}
        />
        <div className='modal-card'>
          <header className='modal-card-head'>
            <p className='modal-card-title'>
              ¡ES MOMENTO DE INTERCAMBIAR UNA CARTA!
            </p>
          </header>
          <section className='modal-card-body'>
            <div>
              <span className='title'>DEBES ELEGIR UNA CARTA PARA INTERCAMBIAR:</span>
            </div>
          </section>
          {cardsPlayer.map((card, index) => (
          <button
            key={index} 
            className='button is-success is-tuki'
            onClick={() => {
            exchangeIntention(card.id, user.id, game?.name, setShow)
          }}
          > 
            {`${index + 1}º CARTA`}
          </button> 
          ))
          }

        </div>
      </div>
    )

  } else if (show == "exchange-response") {
    return (
      <div className='modal is-active'>
        <div
          className='modal-background'
          onClick={() => {
            //setShow('') Queremos que si o si seleccione una carta
          }}
        />
        <div className='modal-card'>
          <header className='modal-card-head'>
            <p className='modal-card-title'>
              ¡ES MOMENTO DE RESPONDER A UN INTERCAMBIO!
            </p>
          </header>
          <section className='modal-card-body'>
            <div>
              <span className='title'>DEBES ELEGIR UNA CARTA PARA INTERCAMBIAR:</span>
            </div>
          </section>
          {cardsPlayer.map((card, index) => (
          <button
            key={index} 
            className='button is-success is-tuki'
            onClick={() => {
            exchangeResponse(card.id, user.id, game?.name, setShow)
          }}
          > 
            {`${index + 1}º CARTA`}
          </button> 
          ))
          }

        </div>
      </div>
    )

  }
}

export default Modals
