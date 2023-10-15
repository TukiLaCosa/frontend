export const setPath = (id) => {
  const zeros = '0'.repeat((3 - id.toString().length) % 3)
  const path = `/cards/front/${zeros}${id}.png`
  return path
}
