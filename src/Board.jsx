import * as React from 'react'
import PropTypes from 'prop-types'
import { MCTSBot } from 'boardgame.io/ai'

import Game from './Game'

import './Board.css'

const isWinner = ctx => ctx.gameover && ctx.gameover.winner

const cellContents = value => {
  if (value === 'first') return '🚘'
  if (value === 1) return '🌲'
  return null
}

const simulate = async (state) => {
  const closenessToFinishLine = {
    weight: 0,
    checker: (G) => {
      closenessToFinishLine.weight = G.road.length - G.players.first.y
      return true
    },
  }
  const bot = new MCTSBot({
    game: Game,

    enumerate: () => (
      [{ move: 'keepGoing' }, { move: 'switchLanes' }]
    ),

    iterationCallback: (...args) => {
      console.log('iterationCallback', args)
    },

    iterations: (G) => G.road.length,
    playoutDepth: (G) => G.road.length * G.road.length,
    objectives: () => ({ closenessToFinishLine }),
  })
  bot.setOpt('async', true)

  const { action } = await bot.play(state, state.ctx.currentPlayer)

  const move = action.payload.type
  console.log('move', move)
  state.moves[move]()
}

const Board = (state) => (
  <main>
    <h1>&nbsp;{isWinner(state.ctx) && `You Win! score: ${state.ctx.gameover.score}`}</h1>
    <table>
      <tbody>
        {state.G.road.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => (
              <td key={j}>{cellContents(cell)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
    <button onClick={() => simulate(state, 1)}>Simulate</button>
  </main>
)

Board.propTypes = {
  G: PropTypes.shape({
    road: PropTypes.arrayOf(PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    )),
  }),
  ctx: PropTypes.shape({
    gameover: PropTypes.shape({
      winner: PropTypes.bool,
    }),
  }),
}

export default Board