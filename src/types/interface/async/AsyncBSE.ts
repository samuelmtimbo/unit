import { MethodNotImplementedError } from '../../../exception/MethodNotImplementedError'
import { Callback } from '../../Callback'
import { Unlisten } from '../../Unlisten'
import { BSE } from '../BSE'
import { $BC } from './$BC'
import { $BSE, $BSE_C, $BSE_G, $BSE_R, $BSE_W } from './$BSE'

export const AsyncBSEGet = (service: BSE): $BSE_G => ({
  $captureStream: function (
    { frameRate }: { frameRate: number },
    callback: Callback<MediaStream>
  ): Unlisten {
    throw new MethodNotImplementedError()
  },
})

export const AsyncBSECall = (service: BSE): $BSE_C => {
  return {}
}

export const AsyncBSEWatch = (service: BSE): $BSE_W => {
  return {}
}

export const AsyncBSERef = (service: BSE): $BSE_R => ({
  $getCharacteristic: function (data: { name: string }): $BC {
    throw new MethodNotImplementedError()
  },
})

export const AsyncBSE = (service: BSE): $BSE => {
  return {
    ...AsyncBSEGet(service),
    ...AsyncBSECall(service),
    ...AsyncBSEWatch(service),
    ...AsyncBSERef(service),
  }
}
