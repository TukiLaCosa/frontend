import data from "../../dataGame.json"

function DataGame(){
    return <div className="notification is-tuki dataGame">
        <p>Partida: {data.name}</p>
        <p>Creador: {data.host}</p>
        <p>jugadores: {data.cur_players+"/"+data.max_players}</p>
    </div>
}

export default DataGame;