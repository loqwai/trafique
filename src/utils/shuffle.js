export const shuffle = (array) => {
  for (let i = 0; i < array.length; i++) {
    const randomIndex = Math.floor(Math.random() * i)

    const temp = array[i]
    array[i] = array[randomIndex]
    array[randomIndex] = temp
  }

  return array
}