function Chair ({ rotation, size, type, className, player, turn, user, theThing }) {
  let source
  if (type === 'Whole') {
    source = '/backgrounds/sofa.png'
  } else {
    source = `/backgrounds/sofa${type}.png`
  }

  let buttonStyles = ''
  if (player?.position === -1) {
    buttonStyles = 'is-danger'
  } else if (!player?.id) {
    buttonStyles = 'is-light is-outlined'
  } else if (turn === player?.id && user?.id === player?.id) {
    buttonStyles = 'is-player-turn'
  } else if (turn === player?.id && user?.id !== player?.id) {
    buttonStyles = 'is-turn'
  } else if (turn !== player?.id && user?.id === player?.id) {
    buttonStyles = 'is-player'
  } else {
    buttonStyles = 'is-success is-light is-outlined'
  }

  if (player?.id === theThing && player?.id !== user?.id) {
    buttonStyles = 'is-tuki'
  }

  return (
    <div className={className}>
      <h2>
        <button
          id={player?.id}
          className={'button ' + buttonStyles}
          style={{ margin: '10px', padding: '10px' }}
        >{player?.name}
        </button>
      </h2>
      <img
        src={source}
        width={size}
        style={{
          transform: `rotate(${rotation}deg)`
        }}
      />
    </div>
  )
}

export default Chair
