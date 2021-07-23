import './App.css'

import { useEffect, useState } from 'react'
import { useWindowSize } from 'react-use'

import { Game } from './ecs/Game'

function App() {
  const [canvas, setCanvas] = useState(null)

  useEffect(() => {
    if (!canvas) return

    const game = new Game({ canvas })
    game.start()

    return () => game.stop()
  }, [canvas])

  const { width, height } = useWindowSize()

  return (
    <div className="App">
      <canvas ref={setCanvas} width={width} height={height} />
    </div>
  )
}

export default App
