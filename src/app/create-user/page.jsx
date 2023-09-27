"use client"

import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

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

    async function createUser() {
        if (isCorrect) {
            const newUser = { name: document.getElementById("name").value };

            try {
                const response = await axios.post('http://localhost:8000/players/', newUser);
                if (response?.status == 201) {
                    document.getElementById("name").setAttribute("disabled", "");
                    document.getElementById("create-game").removeAttribute("disabled");
                    document.getElementById("search-game").removeAttribute("disabled");
                    setClassName('is-success');
                }
            }
            catch (error) {
                if (error.code === "ERR_BAD_REQUEST") {
                    console.log("Request error");
                }
                else {
                    console.log("Server Error");
                }
            }
        }
    }

    return (
        <section className="hero is-halfheight">
            <div className="hero-body is-flex is-flex-direction-column is-align-items-center is-justify-content-space-evenly has-text-centered">
                <h2 className='title is-3'>Ingresa tu nombre</h2>
                <div className="columns">
                    <input type="text" id="name" className={`input is-medium ${className} column is-two-thirds`} onInput={checkUserName} placeholder="Nombre" />
                    <button id='create-user' className="button is-tuki is-medium column" onClick={createUser}>Crear usuario</button>
                </div>
                <div className="buttons are-large">
                    <Link href="/create-game">
                        <button id="create-game" className="button is-tuki" disabled>Crear Partida</button>
                    </Link>
                    <Link href="/search-game">
                        <button id='search-game' className="button is-tuki" disabled>Buscar Partida</button>
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default CrearUsuario;