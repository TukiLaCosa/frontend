function DataGame({data}){
    return <div className="notification is-tuki dataGame">
        <p>Partida: {data.name}</p>
        <p>Creador: {data.host}</p>
        <p>Jugadores: {data.cur_players+"/"+data.max_players}</p>
        <p>Jugadores minimos: {data.min_players}</p>
    </div>
}

export default DataGame;