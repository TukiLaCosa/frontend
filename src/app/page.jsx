import CrearUsuario from './crear-usuario/page';
import '@/styles/page.css';
import Sala from './sala/page';

export default function Home() {
  return (
    <main className="is-flex section main" >
      <h1 className="title is-1 has-text-centered">Tuki La Cosa</h1>
      <CrearUsuario></CrearUsuario>
    </main>
  )
}
