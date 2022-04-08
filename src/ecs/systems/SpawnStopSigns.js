import { System } from 'ecsy'
import { Intersection } from '../components/Intersection'
import { StopSign } from '../components/StopSign'

export class SpawnStopSigns extends System {
  execute = () => {
    this.queries.intersections.results.forEach(this._spawnStopSignsForIntersection)
  }

  _spawnStopSignsForIntersection = (entity) => {
    const intersection = entity.getComponent(Intersection)

    const stopSigns = this.queries.stopSigns.results.filter(e => e.getComponent(StopSign).intersectionId === entity.id)

    this._spawnStopSign(entity.id, stopSigns, 'northBound', intersection.northBoundStopSign())
    this._spawnStopSign(entity.id, stopSigns, 'southBound', intersection.southBoundStopSign())
    this._spawnStopSign(entity.id, stopSigns, 'westBound', intersection.westBoundStopSign())
    this._spawnStopSign(entity.id, stopSigns, 'eastBound', intersection.eastBoundStopSign())
  }

  _spawnStopSign = (intersectionId, stopSigns, locationName, { position, rotation }) => {
    const stopSign = this._findOrCreateStopSign(stopSigns, locationName, position, rotation, intersectionId)

    if (stopSign.getComponent(StopSign).position.equals(position)) {
      return
    }

    stopSign.getMutableComponent(StopSign).position = position
  }

  _findOrCreateStopSign = (stopSigns, locationName, position, rotation, intersectionId) => {
    const existing = stopSigns.find(e => e.getComponent(StopSign).locationName === locationName)
    if (existing) return existing

    return this.world
      .createEntity()
      .addComponent(StopSign, {
        position,
        intersectionId,
        locationName,
        rotation,
      })
  }
}

SpawnStopSigns.queries = {
  intersections: { components: [Intersection] },
  stopSigns: { components: [StopSign] },
}

