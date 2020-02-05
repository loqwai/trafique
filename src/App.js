import './App.css'
import { Client } from 'boardgame.io/react'
import Board from './Board.jsx'

export const Trafique = {
  setup: () => ({
    road: [
      [1, 0],
      [0, 0],
      [0, 0],
    ],
    players: {
      1: {
        x: 0,
        y: 0,
      },
    },
  }),
  moves: {
    keepGoing: (G) => ({
      ...G,
      players: {
        first: getKeepGoingPlayer(G.players.first, G.road),
      },
    }),
    switchLanes: (G) => {
      const { x, y } = G.players.first

      const obstacle1 = getObjectAtIndex({ road: G.road, x: x + 1, y: y + 1 })
      const obstacle2 = getObjectAtIndex({ road: G.road, x: x + 1, y })

      if (obstacle1) {
        if (obstacle2) {
          return G
        }

        return {
          ...G,
          players: {
            first: {
              x: ((G.players.first.x + 1) % 2),
              y: G.players.first.y,
            },
          },
        }
      }

      return {
        ...G,
        players: {
          first: {
            x: ((G.players.first.x + 1) % 2),
            y: G.players.first.y + 1,
          },
        },
      }
    },
  },
}

const getKeepGoingPlayer = ({ x, y }, road) => {

  const obstacle1 = getObjectAtIndex({ road, x, y: y + 1 })
  if (obstacle1) {
    return { x, y }
  }

  const obstacle2 = getObjectAtIndex({ road, x, y: y + 2 })
  if (obstacle2) {
    return { x, y: y + 1 }
  }

  return { x, y: y + 2 }
}

const getObjectAtIndex = ({ road, x, y }) => {
  const realY = (road.length - y - 1)
  const realX = x
  const obstacle = road[realY][realX]
  return obstacle
}

const App = Client({ game: Trafique, board: Board, numPlayers: 1 })

export default App


