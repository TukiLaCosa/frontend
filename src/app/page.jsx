import CrearUsuario from '@/app/create-user/page';

export default function Home() {
  return (
    <div className="hero is-flex is-flex-direction-column is-justify-content-center is-fullheight">
      <h1 className="title is-1 has-text-centered section">Tuki La Cosa</h1>
      <CrearUsuario></CrearUsuario>
    </div>
  )
}
