import { Callback } from '../../Callback'
import { SEL, SelectionObject } from '../SEL'
import { $SEL, $SEL_C, $SEL_G, $SEL_R, $SEL_W } from './$SEL'

export const AsyncSELGet = (selectable: SEL): $SEL_G => {
  return {
    $getSelection: function (
      data: {},
      callback: Callback<SelectionObject[]>
    ): void {
      try {
        const selection = selectable.getSelection()

        callback(selection)
      } catch (err) {
        callback(undefined, err.message)
      }
    },
  }
}

export const AsyncSELCall = (selectable: SEL): $SEL_C => {
  return {
    $setSelectionRange: function (data: SelectionObject): void {
      selectable.setSelectionRange(data.start, data.end, data.direction)
    },
  }
}

export const AsyncSELSWatch = (selectable: SEL): $SEL_W => {
  return {}
}

export const AsyncSSELRef = (selectable: SEL): $SEL_R => {
  return {}
}

export const AsyncSEL = (selectable: SEL): $SEL => {
  return {
    ...AsyncSELGet(selectable),
    ...AsyncSELCall(selectable),
    ...AsyncSELSWatch(selectable),
    ...AsyncSSELRef(selectable),
  }
}
