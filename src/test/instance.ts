import { Graph } from '../Class/Graph'
import { unitFromId } from '../spec/fromId'
import { system } from './util/system'

// const [system] = boot(
//   clone({
//     specs: _specs,
//     classes: _classes,
//     components: _components,
//   })
// )

const specs_ = { ...system.specs }

const spec = system.emptySpec()

const graph = new Graph<{ number: number }, { sum: number }>(spec, {}, system)

for (const id in system.specs) {
  // if (id === '1c33668d-5aa9-4c45-bb8a-dfce14a2aded') {
  //   debugger
  // }

  const unit = unitFromId(system, id, system.specs, system.classes)

  let unitId: string

  do {
    unitId = `${Math.random()}`
  } while (graph.hasUnit(unitId))

  graph.addUnit(unitId, unit)
}
