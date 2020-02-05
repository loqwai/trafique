import './App.css'
import { Client, } from 'boardgame.io/react'
import Board from './Board.jsx'

export const Trafique = {
  setup: (ctx) => ({
    road: [
      [1, 0,],
      [0, 0,],
      [0, 0,],
    ],
    players: {
      1: {
        x: 0,
        y: 0,
      },
    },
  }),
  moves: {
    keepGoing: (G) => {
      const { x, y } = G.players.first

      const obstacle = getObjectAtIndex({ ...G, x, y: y + 2 })
      if (obstacle) {
        return {
          players: {
            first: { x, y: y + 1 },
          },
        }
      }
      return {
        players: {
          first: { x, y: y + 2 },
        },
      }
    },
    switchLanes: () => null,
  },
}

const getObjectAtIndex = ({ road, x, y }) => {
  const realY = (road.length - y - 1)
  const realX = x
  const obstacle = road[realY][realX]
  console.log({ realX, realY, road, obstacle, x, y })
  return obstacle
}

const App = Client({ game: Trafique, board: Board, numPlayers: 1 })

export default App
