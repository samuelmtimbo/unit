import { MethodNotImplementedError } from '../../../exception/MethodNotImplementedError'
import { Callback } from '../../Callback'
import { B } from '../B'
import { $B, $B_C, $B_G, $B_R, $B_W } from './$B'

export const AsyncBGet = (blob: B): $B_G => ({
  $blob: function ({}: {}, callback: Callback<Blob>): void {
    throw new MethodNotImplementedError()
  },
})

export const AsyncBCall = (blob: B): $B_C => {
  return {}
}

export const AsyncBWatch = (blob: B): $B_W => {
  return {}
}

export const AsyncBRef = (blob: B): $B_R => {
  return {}
}

export const AsyncB = (blob: B): $B => {
  return {
    ...AsyncBGet(blob),
    ...AsyncBCall(blob),
    ...AsyncBWatch(blob),
    ...AsyncBRef(blob),
  }
}
