function DataGame({data}){
    return <div className="notification is-tuki dataGame">
        <p>Partida: {data.name}</p>
        <p>Creador: {data.host}</p>
        <p>Jugadores: {data.curPlayer+"/"+data.maxPlayer}</p>
        <p>Jugadores minimos: {data.minPlayer}</p>
    </div>
}

export default DataGame;