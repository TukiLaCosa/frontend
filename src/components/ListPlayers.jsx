'use client';
import { useEffect } from "react"

const listUsers = () => {
    fetch("http://127.0.0.1:8000/players/")
    .then(response => response.json())
    .catch(data => console.log(data))
}

function ListPlayers({className}){
    return <ul className="box is-primary" style={{
        "gridArea": "list",
        "justify-self": "stretch"}}>
        <li className="media">
            <div className="media-left">
                <figure className="image is-32x32">
                +☈+ 
                </figure>
            </div>
            <div className="media-content">
                <p className="content">Mengano</p>
            </div>
        </li>
        <li className="media"><p>+☉+ Funalo</p></li>
        <li className="media"><p>+☠+ LosNombresMásTristesYFeosQueSeMeOcurrieron</p></li>
    </ul>
    
}

export default ListPlayers