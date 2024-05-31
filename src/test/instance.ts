import { Graph } from '../Class/Graph'
import { boot } from '../client/platform/node/boot'
import { unitFromId } from '../spec/fromId'
import _classes from '../system/_classes'
import _components from '../system/_components'
import _specs from '../system/_specs'
import { clone } from '../util/object'

const [system] = boot(
  clone({
    specs: _specs,
    classes: _classes,
    components: _components,
  })
)

const spec = system.emptySpec()

const graph = new Graph<{ number: number }, { sum: number }>(spec, {}, system)

for (const id in system.specs) {
  const unit = unitFromId(system, id, system.specs, system.classes)

  let unitId: string

  do {
    unitId = `${Math.random()}`
  } while (graph.hasUnit(unitId))

  graph.addUnit(unitId, unit)
}
