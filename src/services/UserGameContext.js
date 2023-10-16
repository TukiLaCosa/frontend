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

  const setUserValues = (id = 0, name = '') => {
    setUser({
      id,
      name: `${name}`
    })
  }

  const setGameValues = (name, typeNext, cards) => {
    setGame({
      name: `${name}`,
      nextCard: `${typeNext}`,
      cards: [cards]
    })
  }

  return (
    <UserGameContext.Provider value={{ user, game, setUserValues, setGameValues }}>
      {children}
    </UserGameContext.Provider>
  )
}

export const useUserGame = () => {
  return useContext(UserGameContext)
}
