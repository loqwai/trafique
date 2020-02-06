import './App.css'
import { Client } from 'boardgame.io/react'
import Board from './Board.jsx'

const renderRoad = ({ road, player: { x, y } }) => {
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

const generateRoad = (ctx) => {
  let road = []

  for (let i = 0; i < 30; i++) {
    let potentialTree = ctx.random.Die(2) - 1
    let lane = ctx.random.Die(2) - 1
    let row = [0, 0]
    row[lane] = potentialTree
    road.push(row)
  }

  road[road.length-1][0] = 'first'

  return road
}


export const Trafique = {
  setup: (ctx) => {
    const road = generateRoad(ctx)

    const first = {
      x: 0,
      y: road.length - 1,
    }

    return ({ road, players: { first } })
  },
  moves: {
    keepGoing: (G) => {

      const { road, players } = G
      const player = getKeepGoingPlayer(players.first, road)

      return ({
        ...G,
        road: renderRoad({ road, player }),
        players: {
          first: player,
        },
      })
    },
    switchLanes: (G) => {
      const player = getSwitchLanesPlayer(G.players.first, G.road)

      return {
        ...G,
        road: renderRoad({ road: G.road, player }),
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


