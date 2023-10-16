import DataGame from '@/components/DataGame'
import ListPlayers from '@/components/ListPlayers'
import Chat from '@/components/Chat'
import ExitAndStart from '@/components/ExitAndStart'
import '@/styles/lobby.scss'

function Lobby () {
  return (
    <div className='conteiner'>
      <DataGame />
      <ListPlayers />
      <Chat />
      <ExitAndStart />
    </div>
  )
}

export default Lobby
