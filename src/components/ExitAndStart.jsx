'use client';
import { useState } from "react";
import Link from 'next/link';

function ExitAndStart({curP, minP, isHost, name}){
    const ready = (curP >= minP);
    const [showModal, setShowModal] = useState(false);

    const handleStartClick = () => {
        if (ready){
            alert("funciona");
        }else{
            alert("No hay suficientes jugadores");
        }
    }

    const handleExitClick = () => {
        setShowModal(true);
    }

    const closeModal = () => {
        setShowModal(false);
    }

    return (
        <div className="colums buttons">
            <div className="column">
                <button className="button is-danger is-large" onClick={handleExitClick}>Abandonar</button>
            </div>
            <div className="column">
            {
                ready && isHost ?
                <Link href={`/game/${name}`}>
                    <button className="button is-success is-large" onClick={handleStartClick}>Iniciar</button>
                </Link>
                :
                <button className="button is-success is-large" disabled>Iniciar</button>
            }
            </div>

            {showModal && (
                <div className="modal is-active">
                    <div className="modal-background" onClick={closeModal}></div>
                    <div className="modal-card">
                        <header className="modal-card-head">
                            <p className="modal-card-title">¿Realmente vas a dejar plantada a la gente?</p>
                            <button className="delete" aria-label="close" onClick={closeModal}></button>
                        </header>
                        <section className="modal-card-body">
                            Dale, ¿Que tenés que hacer que es más importante? Una partidita no más, y después te vas.
                        </section>
                        <footer className="modal-card-foot">
                            <Link href="/search-game" className="button is-danger">
                                Irse
                            </Link>
                            <button className="button is-tuki" onClick={closeModal}>{"Irsen't"}</button>
                        </footer>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ExitAndStart;
