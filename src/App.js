import './App.css'
import { Client } from 'boardgame.io/react'
import Board from './Board.jsx'

const generateRoad = ({ road, player: { x, y } }) => {
  road = road.map(row => row.map(cell => cell === 'first' ? 0 : cell))
  road[y][x] = 'first'
  return road
}

const getObjectOnRoad = ({ road, x, y }) => {
  if (!road[y]) return 1
  return road[y][x]
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

const getSwitchLanesPlayer = (player, road) => {
  const { x, y } = player
  const obstacle1 = getObjectOnRoad({ road: road, x: x + 1, y: y - 1 })
  const obstacle2 = getObjectOnRoad({ road: road, x: x + 1, y })

  if (obstacle1) {
    if (obstacle2) {
      return { ...player, x, y }
    }

    return {
      ...player,
      x: ((x + 1) % 2),
      y,
    }
  }

  return {
    ...player,
    x: (x + 1) % 2,
    y: y - 1,
  }
}


export const Trafique = {
  setup: () => ({
    road: [
      [1, 0],
      [0, 0],
      ['first', 0],
    ],
    players: {
      first: {
        x: 0,
        y: 2,
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
      const player = getSwitchLanesPlayer(G.players.first, G.road)

      return {
        ...G,
        road: generateRoad({ road: G.road, player }),
        players: {
          first: player,
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

export default Client({ game: Trafique, board: Board, numPlayers: 1, ai: {
  enumerate: () => {
    return [{
      move: 'keepGoing',
    }, {
      move: 'switchLanes',
    }]
  },
} })


