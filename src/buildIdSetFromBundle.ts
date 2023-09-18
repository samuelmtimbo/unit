import { evaluate } from './spec/evaluate'
import { getTree, TreeNodeType } from './spec/parser'
import _classes from './system/_classes'
import _specs from './system/_specs'
import { Spec } from './types'
import { BaseSpec } from './types/BaseSpec'
import { BundleSpec } from './types/BundleSpec'
import { GraphSpec } from './types/GraphSpec'
import { UnitBundleSpec } from './types/UnitBundleSpec'

export function buildIdSet(
  spec: Spec,
  idSet: Set<string> = new Set()
): Set<string> {
  const { units = {} } = spec as GraphSpec

  if (idSet.has(spec.id)) {
    return idSet
  }

  idSet.add(spec.id)

  for (const unitId in units) {
    const unit = units[unitId]

    const { id, input = {} } = unit

    for (const inputId in input) {
      const _input = input[inputId]

      const { data } = _input

      if (data) {
        const tree = getTree(data)

        if (tree.type === TreeNodeType.Unit) {
          const str = tree.value.substring(1)

          const bundle = evaluate(str, _specs, _classes) as UnitBundleSpec

          idSet.add(bundle.unit.id)

          for (const specId in bundle.specs) {
            const spec = bundle.specs[specId]

            buildIdSet(spec, idSet)
          }
        }
      }
    }

    const unit_spec = _specs[id]

    if (unit_spec) {
      buildIdSet(unit_spec, idSet)
    } else {
      //
    }
  }

  ;(spec as BaseSpec).deps?.forEach((id) => {
    const dep_spec = _specs[id]

    buildIdSet(dep_spec, idSet)
  })

  return idSet
}

export function buildIdSetFromBundle(
  bundle: BundleSpec,
  idSet: Set<string> = new Set()
): Set<string> {
  const { spec = {}, specs = {} } = bundle

  buildIdSet(spec, idSet)

  for (const specId in specs) {
    const spec = specs[specId]

    buildIdSet(spec, idSet)
  }

  return idSet
}
