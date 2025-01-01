import { keys } from '../system/f/object/Keys/f'
import { BundleSpec } from '../types/BundleSpec'
import { Dict } from '../types/Dict'
import { GraphSpec } from '../types/GraphSpec'
import { GraphSpecs } from '../types/GraphSpecs'
import { GraphUnitSpec } from '../types/GraphUnitSpec'
import { UnitBundleSpec } from '../types/UnitBundleSpec'

const ALLOWED_BUNDLE_SPEC_KEY_SET = new Set(['spec', 'specs', 'metadata'])
const ALLOWED_UNIT_BUNDLE_SPEC_KEY_SET = new Set(['unit', 'specs', 'metadata'])

const ALLOWED_SPEC_KEY_SET = new Set([
  'name',
  'version',
  'id',
  'units',
  'merges',
  'data',
  'component',
  'metadata',
  'inputs',
  'outputs',
  'type',
  'render',
  'user',
])

export function validObjectKeys(obj: Dict<any>, set: Set<string>) {
  let valid = true

  const _keys = keys(obj)

  for (const key of _keys) {
    if (!set.has(key)) {
      valid = false

      break
    }
  }

  return valid
}

export function validateGraphSpec(spec: GraphSpec) {
  return validObjectKeys(spec, ALLOWED_SPEC_KEY_SET)
}

export function validateBundleSpec(bundle: BundleSpec) {
  if (!validObjectKeys(bundle, ALLOWED_BUNDLE_SPEC_KEY_SET)) {
    return false
  }

  const { spec = {}, specs = {}, metadata = {} } = bundle

  if (!validateGraphSpec(spec)) {
    return false
  }

  if (!validateSpecs(specs)) {
    return false
  }

  return true
}

export function validateSpecs(specs: GraphSpecs) {
  for (const specId in specs) {
    if (!validateGraphSpec(specs[specId])) {
      return false
    }
  }

  return true
}

export function validateUnitBundleSpec(bundle: UnitBundleSpec) {
  if (!validObjectKeys(bundle, ALLOWED_UNIT_BUNDLE_SPEC_KEY_SET)) {
    return false
  }

  const { unit, specs } = bundle

  if (!validateGraphUnitSpec(unit)) {
    return false
  }

  if (!validateSpecs(specs)) {
    return false
  }

  return true
}

export function validateGraphUnitSpec(unit: GraphUnitSpec) {
  // TODO

  return true
}
