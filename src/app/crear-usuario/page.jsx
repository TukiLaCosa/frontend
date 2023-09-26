import '@/styles/crearUsuario.css'

function CrearUsuario() {
    return (
        <div className="is-flex has-text-centered crear-usuario">
            <h2 className='title is-3'>Ingresa tu nombre</h2>
            <input type="text" className="input is-large is-tuki" placeholder="Nombre" />
            <div className="is-flex buttons are-medium">
                <button className="button is-tuki">Crear Partida</button>
                <button className="button is-tuki">Buscar Partida</button>
            </div>
        </div>
    )
}

export default CrearUsuario;