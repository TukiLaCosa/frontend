function Chair ({ rotation, size, type, className, player, turn }) {
  let source
  if (type === 'Whole') {
    source = '/backgrounds/sofa.png'
  } else {
    source = `/backgrounds/sofa${type}.png`
  }

  const buttonInTurn = turn === player?.id
    ? ''
    : 'is-light is-outlined'

  return (
    <div className={className}>
      <h2>
        <button
          id={player?.id}
          className={'button is-success ' + buttonInTurn}
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
