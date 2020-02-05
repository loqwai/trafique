import './App.css'
import { Client } from 'boardgame.io/react'
import Board from './Board.jsx'

const generateRoad = ({ road, player: { x, y } }) => {
  road = road.map(lane => lane.map(() => 0))
  road[y][x] = 'first'
  return road
}

const getKeepGoingPlayer = ({ x, y }, road) => {
  const obstacle1 = getObjectOnRoad({ road, x, y: y - 1 })
  if (obstacle1) {
    return { x, y }
  }

  const obstacle2 = getObjectOnRoad({ road, x, y: y - 2 })
  if (obstacle2) {
    return { x, y: y - 1 }
  }

  return { x, y: y - 2 }
}

const getObjectOnRoad = ({ road, x, y }) => {
  if (!road[y]) return 1
  return road[y][x]
}

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

      const obstacle1 = getObjectOnRoad({ road: G.road, x: x + 1, y: y - 1 })
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
            y: G.players.first.y - 1,
          },
        },
      }
    },
  },
  endIf: ({ players: { first: { y } } }) => {
    if (y <= 0) {
      return { winner: true }
    }
  },
}

export default Client({ game: Trafique, board: Board, numPlayers: 1 })


