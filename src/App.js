import './App.css'
import { Client } from 'boardgame.io/react'
import Board from './Board.jsx'
import Game from './Game.js'

export default Client({ game: Game, board: Board, numPlayers: 1, ai: {
  enumerate: () => (
    [
      { move: 'keepGoing' }, 
      { move: 'switchLanesLeft' }, 
      { move: 'switchLanesRight' },
    ]
  ),
} })