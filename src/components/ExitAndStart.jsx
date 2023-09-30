'use client';
import { useState, Link } from "react";


function ExitAndStart({curP,minP,isHost}){
    const [ready,setReady] = useState(curP>=minP)
   

    const handleStartClick = () => {
        if (ready){
            alert("funciona")
        }else{
            alert("No hay suficientes jugadores")
        }
    }
    const handleExitClick = () =>{
        
    }
    return <div className="colums buttons">
            <div className="column">
            <button className="button is-danger is-large" onClick={handleExitClick}>Abandonar</button>
            </div>
            <div className="column">
            {
            ready ?
            <Link href="/">
            <button className="button is-success is-large" onClick={handleStartClick}>Iniciar</button>
            </Link>
            :
            <button className="button is-success is-large" disabled>Iniciar</button>
            }
    
            </div>
    </div>
}

export default ExitAndStart;