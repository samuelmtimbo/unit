import { $ } from '../../../Class/$'
import { $refEmitter } from '../../../component/$emitter'
import { Callback } from '../../Callback'
import { Unlisten } from '../../Unlisten'
import { EE } from '../EE'
import { $EE, $EE_C, $EE_G, $EE_R, $EE_W } from './$EE'

export const AsyncEEGet = (emitter: EE & $): $EE_G => {
  return {
    $eventNames(data: {}, callback) {
      const eventNames = emitter.eventNames()
      callback(eventNames)
    },
  }
}

export const AsyncEECall = (emitter: EE & $): $EE_C => {
  return {
    $emit({ type, data }: { type: string; data: any }, callback) {
      emitter.emit(type, data)
      callback()
    },
  }
}

export const AsyncEEWatch = (emitter: EE & $): $EE_W => {
  return {
    $addListener({ event }: { event: string }, callback: Callback): Unlisten {
      return emitter.addListener(event, callback)
    },
  }
}

export const AsyncEERef = (emitter: EE & $): $EE_R => {
  return {
    $refEmitter({}): $EE {
      return $refEmitter(emitter, emitter.__system.async)
    },
  }
}

export const AsyncEE = (emitter: EE & $<any>): $EE => {
  return {
    ...AsyncEEGet(emitter),
    ...AsyncEECall(emitter),
    ...AsyncEEWatch(emitter),
    ...AsyncEERef(emitter),
  }
}
