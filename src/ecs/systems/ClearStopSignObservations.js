import { System } from 'ecsy'
import { Observer } from '../components/Observer'
import { StopSign } from '../components/StopSign'

export class ClearStopSignObservations extends System {
  execute() {
    this.queries.stopSigns.results.forEach(this.#clearObservations)
  }

  #clearObservations = (entity) => entity.getMutableComponent(Observer).observations.length = 0
}

ClearStopSignObservations.queries = {
  stopSigns: {
    components: [StopSign, Observer],
  },
}