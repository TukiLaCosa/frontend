import axios from "axios"

export const deleteGame = async (gameName) => {
  try {
    const url = `http://localhost:8000/games/${gameName}`
    const response = await axios.delete(url)
    if (!response?.ok) {
      console.log(response)
    }
  } catch (error) {
    console.error('Error deleting game:', error)
  }
}