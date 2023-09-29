'use client';
import { useState } from "react";
import { useRouter } from 'next/router';

function ExitAndStart({curP,minP,isHost}){
    const [ready,setReady] = useState(curP>=minP)
    // const router = useRouter();
    // const handleStartClick = () => {
    //     if (ready){
    //         router.push('/crear-usuario');
    //     }else{
    //         alert("No hay suficientes jugadores")
    //     }
    // }
    return <div className="colums buttons">
            <div className="column">
            <button className="button is-danger is-large">Abandonar</button>
            </div>
            <div className="column">
            <button className="button is-success is-large">Iniciar</button>
            </div>
    </div>
}

export default ExitAndStart;