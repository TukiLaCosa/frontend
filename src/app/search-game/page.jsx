import React from 'react';

function BotonUnirse() {
    return (
        <div class="has-text-centered">
            <h2 class="title is-1 is-uppercase is-italic has-text-centered section">Partidas Disponibles</h2>
            <section class="has-text-centered">
                <div class="columns is-multiline is-centered">
                    <div class="column is-one-third">
                        <ul class="box has-text-centered">
                            <li>
                                <div class="partida is-tuki">
                                    <h3>Partida 1</h3>
                                    <p>Jugadores: 4/6</p>
                                    <button class="button is-primary is-tuki">Unirse</button>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>

    )
}

export default BotonUnirse;