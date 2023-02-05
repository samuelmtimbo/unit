import { proxyWrap } from '../../../proxyWrap'
import { S } from '../S'
import { $S, $S_C, $S_R, $S_W } from './$S'
import { AsyncGraph } from './AsyncGraph'

export const AsyncSCall = (system: S): $S_C => {
  return {}
}

export const AsyncSWatch = (system: S): $S_W => {
  return {}
}

export const AsyncSRef = (system: S): $S_R => {
  return {
    $newGraph({ bundle, _ }) {
      const _bundle = system.fromBundle(bundle)

      const [graph, unlisten] = system.newGraph(_bundle)

      graph.play()

      const $graph = AsyncGraph(graph)

      return [proxyWrap($graph, _), unlisten]
    },
  }
}

export const AsyncS = (system: S): $S => {
  return {
    ...AsyncSCall(system),
    ...AsyncSWatch(system),
    ...AsyncSRef(system),
  }
}
