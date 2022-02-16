import { AsyncGraph } from '../../../interface/async/AsyncGraph'
import { spawn, start } from '../../../spawn'
import { System } from '../../../system'
import { BundleSpec } from '../../../system/platform/method/process/BundleSpec'
import { render } from '../../render'
import root from '../../root'
import webBoot from './boot'
import webInit from './init'

export default function webRender(bundle: BundleSpec): System {
  const system = webBoot()

  const _pod = spawn(system)

  const graph = start(system, _pod, bundle)

  const $graph = AsyncGraph(graph)

  const unlisten = webInit(system, window, root)

  render(root, system, _pod, $graph)

  return system
}
