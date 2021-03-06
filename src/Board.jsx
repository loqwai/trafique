import * as React from 'react'
import PropTypes from 'prop-types'

import './Board.css'

const isWinner = ctx => ctx.gameover && ctx.gameover.winner

const cellContents = value => {
  if (value === 'first') return '🚘'
  if (value === 1) return '🌲'
  return null
}

const Board = ({ ctx, G, moves }) => {
  React.useEffect(() => {
    const keyUpHandler = ({ key }) => {
      if (key === 'ArrowUp') return moves.keepGoing()
      if (key === 'ArrowLeft') return moves.switchLanesLeft()
      if (key === 'ArrowRight') return moves.switchLanesRight()
    }
    window.addEventListener('keyup', keyUpHandler)
    return () => {
      window.removeEventListener('keyup', keyUpHandler)
    }
  })

  return (<main>
    <h1>&nbsp;{isWinner(ctx) && `You Win! Turns: ${ctx.turn}`}</h1>
    <table>
      <tbody>
        {G.road.map((row, i) => (<tr key={i}>
          {row.map((cell, j) => (<td key={j}>{cellContents(cell)}</td>))}
        </tr>))}
      </tbody>
    </table>
    <p>Use the arrow keys to move</p>
    <div className="keyboard">
      <button type="button" onClick={moves.switchLanesLeft}><span role="img" aria-label="switch lanes left">↖</span>️</button>
      <button type="button" onClick={moves.keepGoing}><span role="img" aria-label="keep going">⬆</span></button>
      <button type="button" onClick={moves.switchLanesRight}><span role="img" aria-label="switch lanes right">↗</span>️</button>
    </div>
  </main>)
}

Board.propTypes = {
  ctx: PropTypes.shape({
    gameover: PropTypes.shape({
      winner: PropTypes.string,
    }),
    turn: PropTypes.number,
  }),
  G: PropTypes.shape({
    road: PropTypes.arrayOf(PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    )),
  }),
  moves: PropTypes.shape({
    keepGoing: PropTypes.func,
    switchLanesLeft: PropTypes.func,
    switchLanesRight: PropTypes.func,
  }),
}

export default Board