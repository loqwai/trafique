import { Trafique } from "./App";

describe("Trafique", () => {
  describe("moves", () => {
    describe("keepGoing", () => {
      describe("when the road is clear", () => {
        let state;

        beforeEach(() => {
          state = Trafique.moves.keepGoing({
            road: [
              [1, 0],
              [0, 0],
              [0, 0]
            ],
            players: { 1: { x: 0, y: 0 } }
          });
        });

        it("should let them go forward", () => {
          expect(state.players[1]).toMatchObject({
            x: 0,
            y: 2
          });
        });
      });
    });
  });
});
