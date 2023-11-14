import axiosClient from "./http-client/axios-client"

export const deleteGame = async (gameName) => {
  try {
    const url = `games/${gameName}`
    const response = await axiosClient.delete(url)
    if (!response?.ok) {
      console.log(response)
    }
  } catch (error) {
    console.error('Error deleting game:', error)
  }
}