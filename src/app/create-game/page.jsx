'use client'

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { check } from '../create-user/page';

// HACER LA LOGICA DE QUE MAX SEA MAYOR QUE MIN EN HTML -> rama SalaDeEspera
// HACER CHECK DE LA PASSWORD
// hacer lo q el host no puede abandonar la partida
// lo de lo astericos de los campos obligatorios
// la redireccion a la sala
let gameName;
let minPlayers;
let maxPlayers;
let pass;
let host;
let sendButton;


// check NOMBRE de la partida
export function checkNameGame(gameName, setClassGameName, setIsCorrectName) { // chequear los datos de la partida
    if (check(gameName)) { // hacer un check mas acorde para el nombre de la partida(?)
        setClassGameName('is-tuki');
        setIsCorrectName(true); // impide que la persona pueda crear la partida
    } else {
        setClassGameName('is-danger');
        setIsCorrectName(false); // impide que la persona pueda crear la partida
    }
}

// check de minimo de jugadores
export function checkMinPlayersGame(minPlayers, setClassMinPlayers, setIsCorrectMinPlayers) { // chequear los datos de la partida
    if ((minPlayers <= 12 && minPlayers >= 4)) {
        setClassMinPlayers('is-tuki');
        setIsCorrectMinPlayers(true);
    } else {
        setClassMinPlayers('is-danger');
        setIsCorrectMinPlayers(false); // impide que la persona pueda crear la partida
    }
}

// check de maximo de jugadores
export function checkMaxPlayersGame(maxPlayers, setClassMaxPlayers, setIsCorrectMaxPlayers) { // chequear los datos de la partida
    if ((maxPlayers <= 12 && maxPlayers >= 4)) {
        setClassMaxPlayers('is-tuki');
        setIsCorrectMaxPlayers(true);
    } else {
        setClassMaxPlayers('is-danger');
        setIsCorrectMaxPlayers(false); // impide que la persona pueda crear la partida
    }
}

// CHECK CONTRASEÑA
export function checkPasswordGame(password, setClassPassword, setIsCorrectPass) { // chequear los datos de la partida
    if (password === null || password === ''){ // hacer un check mas acorde para la password
        setClassPassword('is-tuki');
        setIsCorrectPass(true);
    } else if (check(password)) {
        setClassPassword('is-tuki');
        setIsCorrectPass(true);
    } else {
        console.log('Entre acaa');
        setClassPassword('is-danger');
        setIsCorrectPass(false);
    } 
}


export async function createGame(isCorrectName, isCorrectMinPlayers, isCorrectMaxPlayers, isCorrectPass) {
    if (isCorrectName && isCorrectMinPlayers && isCorrectMaxPlayers && isCorrectPass) {
        let password = pass.value !== '' ? pass.value : null
        const newGame = {
            "name": gameName.value,
            "min_players": minPlayers.value,
            "max_players": maxPlayers.value,
            "password": password,
            "host_player_id": host
        }
        try {
            const response = await axios.post('http://localhost:8000/games/', newGame);
            if (response?.status == 201) {
                gameName.setAttribute('disabled', ''); // es para q no pueda mandar dsp de que se creó
                minPlayers.setAttribute('disabled', '');
                maxPlayers.setAttribute('disabled', '');
                pass.setAttribute('disabled', '');
                sendButton.removeAttribute('disabled'); // en teoria esto deshabilita el boton
            }
        }
        catch (error) {
            if (error.code === 'ERR_BAD_REQUEST') {
                console.error('Request error', error);
            }
            else {
                console.error('Server Error', error);
            }
        }
    }
}


function CreateGame() {
    let [classGameName, setClassGameName] = useState('is-tuki');
    let [classMinPlayers, setClassMinPlayers] = useState('is-tuki');
    let [classMaxPlayers, setClassMaxPlayers] = useState('is-tuki');
    let [classPassword, setClassPassword] = useState('is-tuki');
    let [isCorrectName, setIsCorrectName] = useState(false);
    let [isCorrectMinPlayers, setIsCorrectMinPlayers] = useState(false);
    let [isCorrectMaxPlayers, setIsCorrectMaxPlayers] = useState(false);
    let [isCorrectPass, setIsCorrectPass] = useState(true);

    useEffect(() => { // obtengo los datos del documento
        gameName = document.getElementById('name');
        minPlayers = document.getElementById('minPlayers');
        maxPlayers = document.getElementById('maxPlayers');
        pass = document.getElementById('pass');
        host = JSON.parse(localStorage.getItem('user')).id; // para sacar el host de localstorage
        sendButton = document.getElementById('sendButton');
    }, []);

    return (
        <section className='hero is-halfheight is-flex is-flex-direction-column is-justify-content-space-evenly is-align-items-center'>
            <div className='level section'>
                <h2 className='title is-3 level-item'>Ingresa los datos de la partida</h2>
            </div>
            <div className='level section'>
                <form>
                    <div className='field'>
                        <label className='label'>Nombre de la partida:</label>
                        <div className='control'>
                            <input id='name' className={`input ${classGameName}`} onInput={() => { checkNameGame(gameName.value, setClassGameName, setIsCorrectName) }} type='text' placeholder='Nombre de la partida' required />
                        </div>
                    </div>
                    <div className='field'>
                        <label className='label'>Cantidad mínima de jugadores:</label>
                        <div className='control'>
                            <input id='minPlayers' className={`input ${classMinPlayers}`} onInput={() => { checkMinPlayersGame(minPlayers.value, setClassMinPlayers, setIsCorrectMinPlayers) }} placeholder='Cantidad mínima de jugadores' required />
                        </div>
                    </div>
                    <div className='field'>
                        <label className='label'>Cantidad máxima de jugadores:</label>
                        <div className='control'>
                            <input id='maxPlayers' className={`input ${classMaxPlayers}`} onInput={() => { checkMaxPlayersGame(maxPlayers.value, setClassMaxPlayers, setIsCorrectMaxPlayers) }} placeholder='Cantidad máxima de jugadores' required />
                        </div>
                    </div>
                    <div className='field'>
                        <label className='label'>Contraseña (opcional):</label>
                        <div className='control'>
                            <input id='pass' className={`input ${classPassword}`} onInput={() => { checkPasswordGame(pass.value, setClassPassword, setIsCorrectPass) }} type='password' placeholder='Contraseña' />
                        </div>
                    </div>
                    <div className='field is-grouped'>
                        <div className='control'>
                            <button id='sendButton' className='button is-tuki' onClick={() => { createGame(isCorrectName, isCorrectMinPlayers, isCorrectMaxPlayers, isCorrectPass) }} >Enviar</button>
                        </div>
                    </div>
                </form>
            </div>
        </section>
    )
}

export default CreateGame;