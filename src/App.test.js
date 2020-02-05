import { Trafique } from './App'

describe('Trafique', () => {
  describe('moves', () => {
    describe('keepGoing', () => {
      describe('when the road is clear', () => {
        let state

        beforeEach(() => {
          state = Trafique.moves.keepGoing({
            road: [
              [0, 0,],
              [0, 0,],
              [0, 0,],
            ],
            players: { first: { x: 0, y: 0 } },
          })
        })

        it('should let them go forward', () => {
          expect(state.players.first).toMatchObject({
            x: 0,
            y: 2,
          })
        })
      })

      describe('when the road is clear and the player is somewhere else', () => {
        let state

        beforeEach(() => {
          state = Trafique.moves.keepGoing({
            road: [
              [0, 0,],
              [0, 0,],
              [0, 0,],
            ],
            players: { first: { x: 1, y: 0 } },
          })
        })

        it('should let them go forward', () => {
          expect(state.players.first).toMatchObject({
            x: 1,
            y: 2,
          })
        })
      })

      describe('when the road is not clear', () => {
        let state

        beforeEach(() => {
          state = Trafique.moves.keepGoing({
            road: [
              [1, 0,],
              [0, 0,],
              [0, 0,],
            ],
            players: { first: { x: 0, y: 0 } },
          })
        })

        it.only('should only let them go forward until the space before the obstacle', () => {
          expect(state.players.first).toMatchObject({
            x: 0,
            y: 1,
          })
        })
      })
    })
  })
})
