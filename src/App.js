import './App.css'

import { useEffect, useRef, useState } from 'react'
import { useWindowSize } from 'react-use'

import { Game } from './ecs/Game'

function App() {
  const [canvas, setCanvas] = useState(null)
  const game = useRef()

  useEffect(() => {
    if (!canvas) return

    game.current = new Game({ canvas })
    game.current.start()

    return () => game.current.stop()
  }, [canvas])

  const { width, height } = useWindowSize()

  return (
    <div className="App">
      <canvas 
        ref={setCanvas} 
        width={width} 
        height={height} 
        onClick={(e) => game.current?.onClick(e)} 
      />
    </div>
  )
}

export default App
