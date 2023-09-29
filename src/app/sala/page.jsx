import DataGame from "@/components/DataGame";
import ListPlayers from "@/components/ListPlayers";
import Chat from "@/components/Chat";
import ExitAndStart from "@/components/ExitAndStart";
import '@/styles/grid.scss';
import data from "../../../dataGame.json"

function Sala(){

    return  <div className="conteiner">
        <DataGame data={data}/>
        <ListPlayers className="listPlayers"/>
        <Chat className="chat"/>
        <ExitAndStart curP={data.cur_players} minP={data.min_players} isHost={true}/>
    </div>
}

export default Sala;