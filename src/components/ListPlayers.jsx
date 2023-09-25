// import { useEffect } from "react"

// const listUsers = () => {
//     fetch("http://127.0.0.1:8000/players/")
//     .then(response => response.json())
//     .catch(data => console.log(data))
// }

function ListPlayers({className}){
    return <ul class="box is-primary" style={{
        "gridArea": "list",
        "justify-self": "stretch"}}>
        <li class="media">
            <div class="media-left">
                <figure class="image is-32x32">
                +☈+ 
                </figure>
            </div>
            <div class="media-content">
                <p class="content">Mengano</p>
            </div>
        </li>
        <li class="media"><p>+☉+ Funalo</p></li>
        <li class="media"><p>+☠+ LosNombresMásTristesYFeosQueSeMeOcurrieron</p></li>
    </ul>
    
}

export default ListPlayers