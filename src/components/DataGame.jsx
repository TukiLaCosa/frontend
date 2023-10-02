import Image from 'next/image';

function DataGame({data, refresh}){
    return (
        <div className="notification is-tuki dataGame is-flex is-justify-content-space-between is-align-items-center">
            <div>
                <p>Partida: {data.name}</p>
                <p>Creador: {data.host_player_name}</p>
                <p>Jugadores: {data.num_of_players}/{data.max_players}</p>
                <p>Jugadores minimos: {data.min_players}</p>
            </div>

            <div>
                <button className="button is-warning is-large" onClick={() => refresh(true)}>
                    <Image src="/images/refresh.svg" alt="Refresh" width={64} height={64}/>
                </button>
            </div>
        </div>
    );
}

export default DataGame;