'use client'

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { check } from '../create-user/page';

function CreateGame() {


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
                            <input className='input' type='text' placeholder='Nombre de la partida' required />
                        </div>
                    </div>
                    <div className='field'>
                        <label className='label'>Cantidad mínima de jugadores:</label>
                        <div className='control'>
                            <input className='input' placeholder='Cantidad mínima de jugadores' required />
                        </div>
                    </div>
                    <div className='field'>
                        <label className='label'>Cantidad máxima de jugadores:</label>
                        <div className='control'>
                            <input className='input' placeholder='Cantidad máxima de jugadores' required />
                        </div>
                    </div>
                    <div className='field'>
                        <label className='label'>Contraseña (opcional):</label>
                        <div className='control'>
                            <input className='input' type='password' placeholder='Contraseña' />
                        </div>
                    </div>
                    <div className='field is-grouped'>
                        <div className='control'>
                            <button className='button is-tuki' type='submit'>Enviar</button>
                        </div>
                    </div>
                </form>
            </div>
        </section>
    )
}

export default CreateGame;