import { $ } from '../../../Class/$'
import { isObjNotNull } from '../../../system/f/object/DeepMerge/isObjNotNull'
import { mapObjKV } from '../../../util/object'
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
      return emitter.addListener(event, (data) => {
        const deref = (data) => {
          if (data instanceof $) {
            return { globalId: data.getGlobalId(), __: data.getInterface() }
          }

          if (Array.isArray(data)) {
            data = data.map(deref)
          } else if (isObjNotNull(data)) {
            data = mapObjKV(data, (key, value) => {
              return deref(value)
            })
          }

          return data
        }

        data = deref(data)

        callback(data)
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
