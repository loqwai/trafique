const renderRoad = ({ road, player: { x, y } }) => {
  road = road.map(row => row.map(cell => cell === 'first' ? 0 : cell))
  road[y][x] = 'first'
  return road
}

const getObjectOnRoad = ({ road, x, y }) => {
  if (!road[y]) return 1
  if (x < 0) return 1
  if (x >= road[y].length) return 1
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

const getSwitchLanesLeftPlayer = (player, road) => {
  const { x, y } = player
  const obstacle1 = getObjectOnRoad({ road: road, x: x - 1, y: y - 1 })
  const obstacle2 = getObjectOnRoad({ road: road, x: x - 1, y })

  if (obstacle1) {
    if (obstacle2) {
      return { ...player, x, y }
    }

    return {
      ...player,
      x: x - 1,
      y,
    }
  }

  return {
    ...player,
    x: x - 1,
    y: y - 1,
  }
}

const getSwitchLanesRightPlayer = (player, road) => {
  const { x, y } = player
  const obstacle1 = getObjectOnRoad({ road: road, x: x + 1, y: y - 1 })
  const obstacle2 = getObjectOnRoad({ road: road, x: x + 1, y })

  if (obstacle1) {
    if (obstacle2) {
      return { ...player, x, y }
    }

    return {
      ...player,
      x: x + 1,
      y,
    }
  }

  return {
    ...player,
    x: x + 1,
    y: y - 1,
  }
}

const generateRoad = (ctx) => {
  const length = ctx.random.Die(30)
  const width = ctx.random.Die(6)

  let road = []

  for (let i = 0; i < length; i++) {
    let row = Array(width).fill(0)

    let treeCount = ctx.random.Die(width) - 1
    for (let j = 0; j < treeCount; j++) {
      let lane = ctx.random.Die(width) - 1
      row[lane] = 1
    }

    road.push(row)
  }

  road[road.length-1][0] = 'first'

  return road
}

const Game = {
  setup: (ctx) => {
    const road = generateRoad(ctx)

    const first = {
      x: 0,
      y: road.length - 1,
    }

    return ({ road, players: { first } })
  },
  turn: {
    moveLimit: 1,
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
    switchLanesLeft: (G) => {
      const player = getSwitchLanesLeftPlayer(G.players.first, G.road)

      return {
        ...G,
        road: renderRoad({ road: G.road, player }),
        players: {
          first: player,
        },
      }
    },
    switchLanesRight: (G) => {
      const player = getSwitchLanesRightPlayer(G.players.first, G.road)

      return {
        ...G,
        road: renderRoad({ road: G.road, player }),
        players: {
          first: player,
        },
      }
    },
  },
  endIf: ({ road, players: { first: { y } } }, ctx) => {
    if (y <= 0) {
      return { 
        winner: ctx.currentPlayer, 
        score: road.length - ctx.turn,
      }
    }
  },
}

export default Game