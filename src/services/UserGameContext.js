import React, { createContext, useContext, useState } from 'react'

const UserGameContext = createContext()

export const playerStatus = {
  HUMAN: 'HUMAN',
  THETHING: 'THETHING',
  INFECTED: 'INFECTED'
}

export function UserGameProvider ({ children }) {
  /**
   * user = {
   *          "id": id,
   *          "name": "name"
   * }
   */
  const [user, setUser] = useState(null)

  /**
   * game = {
   *          "name": "name",
   *          "nextCard": "type"
   * }
   */
  const [game, setGame] = useState(null)
  const [record, setRecord] = useState([])

  function setNewRecord (msg) {
    let newRecord = msg
    if (typeof newRecord !== 'string') {
      newRecord = newRecord?.toString()
    }
    setRecord(oldRecord => [...oldRecord, newRecord])
  }

  const setUserValues = ({ id, name, position, status, quarentine }) => {
    setUser((user) => {
      return {
        id: id || user?.id,
        name: name || user?.name,
        position: position || user?.position,
        status: status || user?.status,
        quarentine: quarentine || user?.quarentine
      }
    })
  }

  const setGameValues = ({ name, nextCard, turn, cards, theThing, doors }) => {
    setGame((game) => {
      return {
        name: name || game?.name,
        nextCard: nextCard || game?.nextCard,
        turn: turn || game?.turn,
        cards: cards || game?.cards,
        theThing: theThing || game?.theThing,
        doors: doors || game?.doors
      }
    })
  }

  return (
    <UserGameContext.Provider value={{ user, game, record, setUserValues, setGameValues, setNewRecord }}>
      {children}
    </UserGameContext.Provider>
  )
}

export const useUserGame = () => {
  return useContext(UserGameContext)
}
