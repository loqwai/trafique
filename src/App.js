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
      first: {
        x: 0,
        y: 0,
      },
    },
  }),
  moves: {
    keepGoing: (G) => {

      const { road, players } = G
      const player = getKeepGoingPlayer(players.first, road)

      return ({
        ...G,
        road: generateRoad({ road, player }),
        players: {
          first: player,
        },
      })
    },
    switchLanes: (G) => {
      const { x, y } = G.players.first

      const obstacle1 = getObjectOnRoad({ road: G.road, x: x + 1, y: y + 1 })
      const obstacle2 = getObjectOnRoad({ road: G.road, x: x + 1, y })

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
  endIf: ({ players, road }) => {
    if (players.first.y >= road.length) {
      return { winner: true }
    }
  },
}

const generateRoad = ({ road, player }) => {
  const realY = (road.length - player.y - 1)
  const realX = player.x
  road[2][0] = 0
  road[realX][realY] = 'first'
  return road
}

const getKeepGoingPlayer = ({ x, y }, road) => {

  const obstacle1 = getObjectOnRoad({ road, x, y: y + 1 })
  if (obstacle1) {
    return { x, y }
  }

  const obstacle2 = getObjectOnRoad({ road, x, y: y + 2 })
  if (obstacle2) {
    return { x, y: y + 1 }
  }

  return { x, y: y + 2 }
}

const getObjectOnRoad = ({ road, x, y }) => {
  const realY = road.length - y - 1
  const realX = x
  const lane = road[realY]
  if (!lane) return
  const obstacle = lane[realX]
  return obstacle
}

const App = Client({ game: Trafique, board: Board, numPlayers: 1 })

export default App


