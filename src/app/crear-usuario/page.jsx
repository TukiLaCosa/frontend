import '@/styles/crearUsuario.css'

function CrearUsuario() {
    return (
        <div className="box is-flex has-text-centered crear-usuario">
            <label htmlFor="" className="label">Ingresa tu nombre</label>
            <input type="text" className="input is-medium is-tuki" placeholder="Nombre" />
            <button className="button is-tuki">Jugar!</button>
        </div>
    )
}

export default CrearUsuario;