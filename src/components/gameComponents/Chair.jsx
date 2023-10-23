function Chair ({ rotation, size, type, className, player, turn }) {
  let source
  const buttonInTurn = turn === player?.id
    ? 'button is-success is-light is-outlined'
    : 'button is-info is-light is-outlined'

  if (type === 'Whole') {
    source = '/backgrounds/sofa.png'
  } else {
    source = `/backgrounds/sofa${type}.png`
  }
  return (
    <div className={className}>
      <h2>
        <button
          className={buttonInTurn}
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
