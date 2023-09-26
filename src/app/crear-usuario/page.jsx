"use client"

import { useState } from 'react';
import axios from 'axios';

function CrearUsuario() {

    let [className, setClassName] = useState("is-tuki");
    let userRegEx = /^[a-zA-Z][a-zA-Z0-9]{3,7}$/;
    let [isCorrect, setIsCorrect] = useState(false);

    function checkUserName() {
        let inputUserName = document.getElementById("name");
        if (!userRegEx.test(inputUserName.value)) {
            setIsCorrect(false);
            setClassName('is-danger');
        }
        else {
            setIsCorrect(true);
            setClassName('is-tuki');
        }
    }

    function createUser(){
        if(isCorrect){
            document.getElementById("name").setAttribute("disabled", "");
            // Hacer POST para generar usuario
            const article = { name: 'NOMBRENOMBREsbdkd' };
            axios.post('http://localhost:8000/players/', article)
            .then(response => console.log(response))
 
            // Si todo sale bien ->
            document.getElementById("create-game").removeAttribute("disabled");
            document.getElementById("search-game").removeAttribute("disabled");
            
            document.getElementById("create-game").addEventListener('click', createGame);
            document.getElementById("search-game").addEventListener('click', searchGame);
            setClassName('is-success');
        }
    }

    function createGame(){
        // Redireccionar
        console.log("Crear Partida");
    }

    function searchGame(){
        // Redireccionar
        console.log("Buscar Partida");
    }


    return (
        <section className="hero is-halfheight">
            <div className="hero-body is-flex is-flex-direction-column is-align-items-center is-justify-content-space-evenly has-text-centered">
                <h2 className='title is-3'>Ingresa tu nombre</h2>
                <div className="columns">
                    <input type="text" id="name" className={`input is-medium ${className} column is-two-thirds`} onInput={checkUserName} placeholder="Nombre"/>
                    <button id='create-user' className="button is-tuki is-medium column" onClick={createUser}>Crear usuario</button>
                </div>
                <div className="columns">
                    <button id="create-game" className="button is-tuki is-large column" disabled>Crear Partida</button>
                    <button id='search-game' className="button is-tuki is-large column" disabled>Buscar Partida</button>
                </div>
            </div>
        </section>
    )
}

export default CrearUsuario;