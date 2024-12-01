import { Graph } from './Class/Graph'
import { fromSpec } from './spec/fromSpec'
import { fromUnitBundle } from './spec/fromUnitBundle'
import { System } from './system'
import { BundleSpec } from './types/BundleSpec'
import { GraphBundle } from './types/GraphClass'
import { UnitBundleSpec } from './types/UnitBundleSpec'
import { weakMerge } from './weakMerge'

export function start(
  system: System,
  bundle: BundleSpec,
  play: boolean = true
): Graph {
  const { classes } = system

  const { spec } = bundle

  if (!spec.id) {
    system.newSpec(spec)
  }

  const specs = weakMerge(bundle.specs ?? {}, system.specs)

  const Class = fromSpec(spec, specs, classes, {})

  return startClass(system, Class, play)
}

export function startClass(
  system: System,
  Class: GraphBundle,
  play: boolean = true
): Graph {
  const graph = new Class(system)

  if (play) {
    graph.play()
  }

  return graph
}

export function startUnit(
  system: System,
  bundle: UnitBundleSpec,
  play: boolean = true
): Graph {
  if (bundle.specs) {
    system.injectSpecs(bundle.specs)
  }

  const Class = fromUnitBundle(bundle, system.specs, {}) as GraphBundle

  return startClass(system, Class, play)
}
