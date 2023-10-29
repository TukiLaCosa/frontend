import React, { createContext, useContext, useState } from 'react'

const UserGameContext = createContext()

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

  const setNewRecord = (msg) => {
    let newRecord = msg
    if (typeof newRecord !== 'string') {
      newRecord = newRecord?.toString()
    }
    setRecord(oldRecord => [...oldRecord, newRecord])
  }

  const setUserValues = ({ id, name, position }) => {
    setUser({
      id,
      name,
      position
    })
  }

  const setGameValues = ({ name, nextCard, turn, cards }) => {
    setGame({
      name,
      nextCard,
      turn,
      cards
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
