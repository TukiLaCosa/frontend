import '@/styles/page.css';
import Sala from './sala/page';

export default function Home() {
  return (
      <Sala/>
  )
}

let main = <main className="section" >
            <h1 className="title is-1">Tuki La Cosa</h1>
            <Sala/>
          </main >