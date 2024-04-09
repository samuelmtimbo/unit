import { Classes, Specs } from '../types'
import { BundleSpec } from '../types/BundleSpec'
import { Dict } from '../types/Dict'
import { GraphBundle } from '../types/GraphClass'
import { uuidNotIn } from '../util/id'
import { weakMerge } from '../weakMerge'
import { fromSpec } from './fromSpec'

export function fromBundle<
  I extends Dict<any> = any,
  O extends Dict<any> = any,
>(
  bundle: BundleSpec,
  specs: Specs,
  classes: Classes,
  branch: { [path: string]: true } = {}
): GraphBundle<I, O> {
  const { spec = {}, specs: _specs = {} } = bundle

  if (!spec.id) {
    spec.id = uuidNotIn(specs)
  }

  _specs[spec.id] = spec

  return fromSpec(spec, weakMerge(_specs, specs), classes, branch)
}
