import { Graph } from '../Class/Graph'
import { boot } from '../client/platform/node/boot'
import { unitFromId } from '../spec/fromId'
import _classes from '../system/_classes'
import _components from '../system/_components'
import _specs from '../system/_specs'
import { keys } from '../system/f/object/Keys/f'
import { clone } from '../util/clone'

const [system] = boot(
  clone({
    specs: _specs,
    classes: _classes,
    components: _components,
  })
)

const specIds = keys(system.specs)

const spec = system.emptySpec()

const graph = new Graph<{ number: number }, { sum: number }>(spec, {}, system)

for (const id of specIds) {
  const unit = unitFromId(system, id, system.specs, system.classes, {}, true)

  let unitId: string

  do {
    unitId = `${Math.random()}`
  } while (graph.hasUnit(unitId))

  graph.addUnit(unitId, unit)

  unit.destroy()
}
