import * as React from 'react'
import PropTypes from 'prop-types'

const Board = ({ G }) => (
  <main>
    <table>
      <tbody>
        {G.road.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => (
              <td key={j}>{cell}</td>
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
}

export default Board