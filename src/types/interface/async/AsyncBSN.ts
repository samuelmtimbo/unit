import { BSN } from '../BSN'
import { $BSN, $BSN_C, $BSN_G, $BSN_R, $BSN_W } from './$BSN'

export const AsyncBSNGet = (bufferNode: BSN): $BSN_G => ({})

export const AsyncBSNCall = (bufferNode: BSN): $BSN_C => ({
  $start: function ({
    start,
    offset,
    duration,
  }: {
    start?: number
    offset?: number
    duration?: number
  }): void {
    void (async () => {
      bufferNode.start(start, offset, duration)
    })()
  },
})

export const AsyncBSNWatch = (bufferNode: BSN): $BSN_W => {
  return {}
}

export const AsyncBSNRef = (bufferNode: BSN): $BSN_R => ({})

export const AsyncBSN = (bufferNode: BSN): $BSN => {
  return {
    ...AsyncBSNGet(bufferNode),
    ...AsyncBSNCall(bufferNode),
    ...AsyncBSNWatch(bufferNode),
    ...AsyncBSNRef(bufferNode),
  }
}
