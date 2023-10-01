function DataGame({data}){
    return <div className="notification is-tuki dataGame">
        <p>Partida: {data.name}</p>
        <p>Creador: {data.host_player_name}</p>
        <p>Jugadores: {data.num_of_players+"/"+data.max_players}</p>
        <p>Jugadores minimos: {data.min_players}</p>
    </div>
}

export default DataGame;