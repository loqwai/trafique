import * as React from 'react'

const useMapKeyToMoves = ({ moves }) => {
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
}

export default useMapKeyToMoves
