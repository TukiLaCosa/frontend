import { useUserGame } from '@/services/UserGameContext'

const Record = () => {
  const { record } = useUserGame()

  return (
    <div className='is-flex is-flex-direction-column'>
      {
        record?.map((element, index) => {
          return (
            <div key={index}>
              {element}
            </div>
          )
        })
      }
    </div>
  )
}

export default Record
