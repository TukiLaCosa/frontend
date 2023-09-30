'use client'

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

let userNameInput;
let createGameButton;
let searchGameButton;

export function check(userName) {
    let userRegEx = /^[a-zA-Z][a-zA-Z0-9]{3,7}$/;

    return userRegEx.test(userName);
}

export function checkUserName(userName, setIsCorrect, setClassName) {
    if (check(userName)) {
        setIsCorrect(true);
        setClassName('is-tuki');
    }
    else {
        setIsCorrect(false);
        setClassName('is-danger');
    }
}

export async function createUser(isCorrect, setClassName) {
    if (isCorrect) {
        const newUser = { name: userNameInput.value };

        try {
            const response = await axios.post('http://localhost:8000/players/', newUser);
            localStorage.clear();
            if (response?.status == 201) {
                userNameInput.setAttribute('disabled', '');
                createGameButton.removeAttribute('disabled');
                searchGameButton.removeAttribute('disabled');
                setClassName('is-success');
                localStorage.setItem('user', `{ "id": ${response.data.id}, "name": "${response.data.name}"}`);
            }
        }
        catch (error) {
            if (error.code === 'ERR_BAD_REQUEST') {
                console.log('Request error');
            }
            else {
                console.log('Server Error');
            }
        }
    }
}

function CreateUser() {

    let [className, setClassName] = useState('is-tuki');
    let [isCorrect, setIsCorrect] = useState(false);

    useEffect(() => {
        userNameInput = document.getElementById('name');
        createGameButton = document.getElementById('create-game');
        searchGameButton = document.getElementById('search-game');
    }, [className]);

    return (
        <section className='hero is-halfheight is-flex is-flex-direction-column is-justify-content-space-evenly is-align-items-center'>
            <div className='level section'>
                <h2 className='title is-3 level-item'>Ingresa tu nombre</h2>
            </div>
            <div className='level'>
                <input type='text' id='name' className={`input is-large ${className}`} onInput={() => { checkUserName(userNameInput.value, setIsCorrect, setClassName) }} placeholder='Nombre' />
                <button id='create-user' className='button is-tuki is-large' onClick={() => { createUser(isCorrect, setClassName) }}>Crear usuario</button>
            </div>
            <div className='level buttons are-large'>
                <Link href='/create-game' className='section'>
                    <button id='create-game' className='button is-tuki' disabled>Crear Partida</button>
                </Link>
                <Link href='/search-game' className='section'>
                    <button id='search-game' className='button is-tuki' disabled>Buscar Partida</button>
                </Link>
            </div>
        </section>
    )
}

export default CreateUser;