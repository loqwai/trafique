import Game from './Game'

describe('Game', () => {
  describe('moves', () => {
    describe('keepGoing', () => {
      describe('when the road ahead is clear', () => {
        let state

        beforeEach(() => {
          state = Game.moves.keepGoing({
            road: [
              [0, 1],
              [0, 0],
              ['first', 0],
            ],
            players: { first: { x: 0, y: 2 } },
          })
        })

        it('should let them go forward', () => {
          expect(state.players.first).toMatchObject({
            x: 0,
            y: 0,
          })
        })

        it('should move the car forward on the road', () => {
          expect(state.road).toEqual([
            ['first', 1],
            [0, 0],
            [0, 0],
          ])
        })
      })

      describe('when the road is clear and the player is somewhere else', () => {
        let state

        beforeEach(() => {
          state = Game.moves.keepGoing({
            road: [
              [0, 0],
              [0, 0],
              [0, 'first'],
            ],
            players: { first: { x: 1, y: 2 } },
          })
        })

        it('should let them go forward', () => {
          expect(state.players.first).toMatchObject({
            x: 1,
            y: 0,
          })
        })

        it('should remove the old player position', () => {
          expect(state.road).toEqual([
            [0, 'first'],
            [0, 0],
            [0, 0],
          ])
        })
      })

      describe('when the road is not clear', () => {
        let state

        beforeEach(() => {
          state = Game.moves.keepGoing({
            road: [
              [1, 0],
              [0, 0],
              ['first', 0],
            ],
            players: { first: { x: 0, y: 2 } },
          })
        })

        it('should only let them go forward until the space before the obstacle', () => {
          expect(state.players.first).toMatchObject({
            x: 0,
            y: 1,
          })
        })
      })

      describe('when the obstacle is right in front of you', () => {
        let state

        beforeEach(() => {
          state = Game.moves.keepGoing({
            road: [
              [0, 0],
              [1, 0],
              ['first', 0],
            ],
            players: { first: { x: 0, y: 2 } },
          })
        })

        it('should only let them go forward until the space before the obstacle', () => {
          expect(state.players.first).toMatchObject({
            x: 0,
            y: 2,
          })
        })
      })

      describe('when the finish is within reach', () => {
        let state

        beforeEach(() => {
          state = Game.moves.keepGoing({
            road: [
              [0, 0],
              [0, 'first'],
              [0, 0],
            ],
            players: { first: { x: 0, y: 1 } },
          })
        })

        it('should let have them stop at 0', () => {
          expect(state.players.first).toMatchObject({
            x: 0,
            y: 0,
          })
        })
      })
    })

    describe('switchLanesLeft', () => {
      describe('when the player is in the right lane', () => {
        let state

        beforeEach(() => {
          state = Game.moves.switchLanesLeft({
            road: [
              [0, 0],
              [0, 0],
              [0, 'first'],
            ],
            players: { first: { x: 1, y: 2 } },
          })
        })

        it('should move up 1, and left 1', () => {
          expect(state.players.first).toMatchObject({
            x: 0,
            y: 1,
          })
        })

        it('should update the road', () => {
          expect(state.road).toEqual([
            [0, 0],
            ['first', 0],
            [0, 0],
          ])
        })
      })

      describe('when the player is in the left lane', () => {
        let state

        beforeEach(() => {
          state = Game.moves.switchLanesLeft({
            road: [
              [0, 0],
              [0, 0],
              ['first', 0],
            ],
            players: { first: { x: 0, y: 2 } },
          })
        })

        it('should keep the player where they be', () => {
          expect(state.players.first).toMatchObject({
            x: 0,
            y: 2,
          })
        })
      })

      describe('when the player is in the right lane and an obstacle is in the other lane', () => {
        let state

        beforeEach(() => {
          state = Game.moves.switchLanesLeft({
            road: [
              [0, 0],
              [1, 0],
              [0, 'first'],
            ],
            players: { first: { x: 1, y: 2 } },
          })
        })

        it('should move up 0, and left 1', () => {
          expect(state.players.first).toMatchObject({
            x: 0,
            y: 2,
          })
        })
      })

      describe('when the player is in the right lane and the left lane is full', () => {
        let state

        beforeEach(() => {
          state = Game.moves.switchLanesLeft({
            road: [
              [0, 0],
              [1, 0],
              [1, 0],
            ],
            players: { first: { x: 1, y: 2 } },
          })
        })

        it('should keep the player where they be', () => {
          expect(state.players.first).toMatchObject({
            x: 1,
            y: 2,
          })
        })
      })
    })

    describe('switchLanesRight', () => {
      describe('when the player is in the left lane', () => {
        let state

        beforeEach(() => {
          state = Game.moves.switchLanesRight({
            road: [
              [0, 0],
              [0, 0],
              ['first', 0],
            ],
            players: { first: { x: 0, y: 2 } },
          })
        })

        it('should move up 1, and right 1', () => {
          expect(state.players.first).toMatchObject({
            x: 1,
            y: 1,
          })
        })

        it('should update the road', () => {
          expect(state.road).toEqual([
            [0, 0],
            [0, 'first'],
            [0, 0],
          ])
        })
      })

      describe('when the player is in the right lane', () => {
        let state

        beforeEach(() => {
          state = Game.moves.switchLanesRight({
            road: [
              [0, 0],
              [0, 0],
              [0, 'first'],
            ],
            players: { first: { x: 1, y: 2 } },
          })
        })

        it('should keep the player where they be', () => {
          expect(state.players.first).toMatchObject({
            x: 1,
            y: 2,
          })
        })
      })

      describe('when the player is in the left lane and an obstacle is in the other lane', () => {
        let state

        beforeEach(() => {
          state = Game.moves.switchLanesRight({
            road: [
              [0, 0],
              [0, 1],
              ['first', 0],
            ],
            players: { first: { x: 0, y: 2 } },
          })
        })

        it('should move up 0, and right 1', () => {
          expect(state.players.first).toMatchObject({
            x: 1,
            y: 2,
          })
        })
      })

      describe('when the player is in the left lane and the right lane is full', () => {
        let state

        beforeEach(() => {
          state = Game.moves.switchLanesRight({
            road: [
              [0, 0],
              [0, 1],
              [0, 1],
            ],
            players: { first: { x: 0, y: 2 } },
          })
        })

        it('should keep the player where they be', () => {
          expect(state.players.first).toMatchObject({
            x: 0,
            y: 2,
          })
        })
      })
    })
  })
})
