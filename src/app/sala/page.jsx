import DataGame from "@/components/DataGame";
import ListPlayers from "@/components/ListPlayers";
import Chat from "@/components/Chat";
import Button from "@/components/Button";
import '@/styles/grid.scss';

function Sala(){

    return  <div className="conteiner">
        <DataGame className="dataGame"/>
        <ListPlayers className="listPlayers"/>
        <Chat className="chat"/>
        <Button action="Abandonar" className="exit"/>
        <Button action="Iniciar" className="start"/>
    </div>
}

export default Sala;