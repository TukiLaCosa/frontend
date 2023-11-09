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
    setUser({
      id,
      name,
      position,
      status,
      quarentine
    })
  }

  const setGameValues = ({ name, nextCard, turn, cards, theThing, doors }) => {
    setGame({
      name,
      nextCard,
      turn,
      cards,
      theThing,
      doors
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
