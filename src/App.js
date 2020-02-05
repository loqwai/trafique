import "./App.css";
import { Client } from "boardgame.io/react";
import Board from "./Board.jsx";

export const Trafique = {
  setup: ctx => ({
    road: [
      [1, 0],
      [0, 0],
      [0, 0]
    ],
    players: {
      1: {
        x: 0,
        y: 0
      }
    }
  }),
  moves: {
    keepGoing: (G, ctx) => {
      const { x, y } = G.players.first;

      return {
        players: {
          first: { x, y: y + 2 }
        }
      };
    },
    switchLanes: (G, ctx) => null
  }
};

const App = Client({ game: Trafique, board: Board, numPlayers: 1 });

export default App;
