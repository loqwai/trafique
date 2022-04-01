import { System } from 'ecsy'

import { Car } from '../components/Car'
import { Collision } from '../components/Collision'
import { Score } from '../components/Score'

export class UpdateScore extends System {
  execute(delta, time) {
    const score = this.queries.score.results[0].getMutableComponent(Score)

    score.numCollisions = this.queries.collisions.results.length
    score.numArrived += this.queries.cars.removed.length
  }

}

UpdateScore.queries = {
  cars: { components: [Car], listen: { removed: true } },
  collisions: { components: [Collision] },
  score: { components: [Score] },
}