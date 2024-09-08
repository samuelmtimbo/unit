import { MethodNotImplementedError } from '../../../exception/MethodNotImplementedError'
import { Callback } from '../../Callback'
import { IB } from '../IB'
import { $B } from './$B'
import { $IB_C, $IB_G, $IB_R, $IB_W } from './$IB'

export const AsyncIBGet = (imageBitmap: IB): $IB_G => ({
  $imageBitmap: async function (
    {}: {},
    callback: Callback<Blob>
  ): Promise<void> {
    throw new MethodNotImplementedError()
  },
})

export const AsyncIBCall = (imageBitmap: IB): $IB_C => {
  return {}
}

export const AsyncIBWatch = (imageBitmap: IB): $IB_W => {
  return {}
}

export const AsyncIBRef = (imageBitmap: IB): $IB_R => {
  return {}
}

export const AsyncIB = (imageBitmap: IB): $B => {
  return {
    ...AsyncIBGet(imageBitmap),
    ...AsyncIBCall(imageBitmap),
    ...AsyncIBWatch(imageBitmap),
    ...AsyncIBRef(imageBitmap),
  }
}
