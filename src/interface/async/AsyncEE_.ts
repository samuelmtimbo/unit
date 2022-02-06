import { $refEmitter } from '../../component/$component'
import { Callback } from '../../types/Callback'
import { Unlisten } from '../../types/Unlisten'
import { EE } from '../EE'
import { $EE, $EE_C, $EE_R, $EE_W } from './$EE'

export const AsyncEECall = (emitter: EE): $EE_C => {
  return {
    $emit({ type, data }: { type: string; data: any }, callback) {
      emitter.emit(type, data)
      callback()
    },
    $getEventNames(data: {}, callback) {
      const eventNames = emitter.eventNames()
      callback(eventNames)
    },
  }
}

export const AsyncEEWatch = (emitter: EE): $EE_W => {
  return {
    $addListener({ event }: { event: string }, callback: Callback): Unlisten {
      return emitter.addListener(event, callback)
    },
  }
}

export const AsyncEERef = (emitter: EE): $EE_R => {
  return {
    $refEmitter({}): $EE {
      return $refEmitter(emitter)
    },
  }
}

export const AsyncEE = (emitter: EE): $EE => {
  return {
    ...AsyncEECall(emitter),
    ...AsyncEEWatch(emitter),
    ...AsyncEERef(emitter),
  }
}
