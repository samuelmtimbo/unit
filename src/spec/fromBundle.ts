import { Specs } from '../types'
import { BundleSpec } from '../types/BundleSpec'
import { Dict } from '../types/Dict'
import { GraphBundle } from '../types/GraphClass'
import { weakMerge } from '../types/weakMerge'
import { uuidNotIn } from '../util/id'
import { fromSpec } from './fromSpec'

export function fromBundle<
  I extends Dict<any> = any,
  O extends Dict<any> = any
>(
  bundle: BundleSpec,
  _specs: Specs,
  branch: { [path: string]: true } = {}
): GraphBundle<I, O> {
  const { spec = {}, specs = {} } = bundle

  if (!spec.id) {
    spec.id = uuidNotIn(_specs)
  }

  return fromSpec(spec, weakMerge(specs, _specs), branch)
}
