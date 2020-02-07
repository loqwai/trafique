import * as React from 'react'
import PropTypes from 'prop-types'

import './Board.css'

const isWinner = ctx => ctx.gameover && ctx.gameover.winner

const cellContents = value => {
  if (value === 'first') return '🚘'
  if (value === 1) return '🌲'
  return null
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