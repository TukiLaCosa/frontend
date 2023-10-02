import Image from 'next/image';

function DataGame({ data, refresh }) {
  return (
    <div className="notification is-tuki-modified dataGame is-flex is-justify-content-space-between is-align-items-center">
      <div>
        <p className="title is-5">Partida: {data.name}</p>
        <p className="has-text-weight-bold">Creador: {data.host_player_name}</p>
        <p className="has-text-weight-bold">Jugadores: {data.num_of_players}/{data.max_players}</p>
        <p className="has-text-weight-bold">Jugadores mínimos: {data.min_players}</p>
      </div>
      <div>
        <button className="button is-warning is-large" onClick={() => refresh(true)}>
          <Image src="/images/refresh.svg" alt="Refresh" width={64} height={64} />
        </button>
      </div>
    </div>
  );
}

export default DataGame;