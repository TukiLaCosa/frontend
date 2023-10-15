function Game ({ game, handleClick, handleInput }) {
  return (
    <li className='box has-text-centered'>
      <div className='level'>
        <div className='level-left is-flex is-flex-direction-column'>
          <h3>{game.name}</h3>
          <p>Jugadores: {game.num_of_players}/{game.max_players}</p>
        </div>
        <div className='level-right buttons'>
          {
            game.is_private
              ? (
                <input
                  className='button'
                  type='password'
                  placeholder='Password'
                  onInput={(event) => handleInput(event, game.name)}
                />
                )
              : (
                <></>
                )
          }
          <button
            className='button is-primary is-tuki'
            onClick={() => handleClick(game.name)}
          >
            Unirse
          </button>
        </div>
      </div>
    </li>
  )
}

export default Game
