import { S } from '../S'
import { $S, $S_C, $S_G, $S_R, $S_W } from './$S'
import { AsyncGraph } from './AsyncGraph'

export const AsyncSGet = (system: S): $S_G => {
  return {}
}

export const AsyncSCall = (system: S): $S_C => {
  return {}
}

export const AsyncSWatch = (system: S): $S_W => {
  return {}
}

export const AsyncSRef = (system: S): $S_R => {
  return {
    $start({ bundle }) {
      const graph = system.start(bundle)

      const $graph = AsyncGraph(graph)

      return $graph
    },
  }
}

export const AsyncS = (system: S): $S => {
  return {
    ...AsyncSGet(system),
    ...AsyncSCall(system),
    ...AsyncSWatch(system),
    ...AsyncSRef(system),
  }
}
