import { $ } from '../../../Class/$'
import { Callback } from '../../Callback'
import { Unlisten } from '../../Unlisten'
import { EE } from '../EE'
import { $EE, $EE_C, $EE_G, $EE_R, $EE_W } from './$EE'

export const AsyncEEGet = (emitter: EE): $EE_G => {
  return {
    $eventNames(data: {}, callback) {
      const eventNames = emitter.eventNames()
      callback(eventNames)
    },
  }
}

export const AsyncEECall = (emitter: EE): $EE_C => {
  return {
    $emit({ event, data }: { event: string; data: any }, callback) {
      emitter.emit(event, data)
      callback()
    },
  }
}

export const AsyncEEWatch = (emitter: EE): $EE_W => {
  return {
    $addListener({ event }: { event: string }, callback: Callback): Unlisten {
      return emitter.addListener(event, (...args) => {
        args = args.map((arg) => {
          if (arg instanceof $) {
            return { globalId: arg.getGlobalId(), __: arg.getInterface() }
          } else {
            return arg
          }
        })

        callback(args)
      })
    },
  }
}

export const AsyncEERef = (emitter: EE): $EE_R => {
  return {}
}

export const AsyncEE = (emitter: EE): $EE => {
  return {
    ...AsyncEEGet(emitter),
    ...AsyncEECall(emitter),
    ...AsyncEEWatch(emitter),
    ...AsyncEERef(emitter),
  }
}
