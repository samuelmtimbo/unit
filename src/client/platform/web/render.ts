import { AsyncGraph } from '../../../types/interface/async/AsyncGraph'
import { spawn, start } from '../../../spawn'
import { System } from '../../../system'
import { BundleSpec } from '../../../types/BundleSpec'
import { render } from '../../render'
import root from '../../root'
import webBoot from './boot'
import webInit from './init'
import { Unlisten } from '../../../types/Unlisten'
import callAll from '../../../util/call/callAll'

export default function webRender(bundle: BundleSpec): [System, Unlisten] {
  const { specs } = bundle

  const system = webBoot()

  const pod = spawn(system, specs)

  const graph = start(system, pod, bundle)

  const $graph = AsyncGraph(graph)

  const webUnlisten = webInit(system, window, root)

  const renderUnlisten = render(system, pod, $graph)

  const unlisten = callAll([webUnlisten, renderUnlisten])

  return [system, unlisten]
}
