import { makeChangeListener } from './event/change'
import { makeCustomListener } from './event/custom'
import { makeInputListener } from './event/input'
import {
  makeKeydownListener,
  makeKeypressListener,
  makeKeyupListener,
} from './event/keyboard'
import { makePasteListener } from './event/paste'
import { makeClickListener } from './event/pointer/click'
import { makePointerDownListener } from './event/pointer/pointerdown'
import { makePointerEnterListener } from './event/pointer/pointerenter'
import { makePointerLeaveListener } from './event/pointer/pointerleave'
import { makePointerMoveListener } from './event/pointer/pointermove'
import { makePointerUpListener } from './event/pointer/pointerup'
import { Listener } from './Listener'

export function makeEventListener(
  event: string,
  callback: (data: any) => void
): Listener {
  switch (event) {
    case 'click':
      return makeClickListener({ onClick: callback })
    case 'dbclick':
      return makeClickListener({ onDoubleClick: callback })
    case 'longpress':
      return makeClickListener({ onLongPress: callback })
    case 'longclick':
      return makeClickListener({ onLongClick: callback })
    case 'pointerdown':
      return makePointerDownListener(callback)
    case 'pointermove':
      return makePointerMoveListener(callback)
    case 'pointerup':
      return makePointerUpListener(callback)
    case 'pointerenter':
      return makePointerEnterListener(callback)
    case 'pointerleave':
      return makePointerLeaveListener(callback)
    case 'input':
      return makeInputListener(callback)
    case 'change':
      return makeChangeListener(callback)
    case 'paste':
      return makePasteListener(callback)
    case 'keydown':
      return makeKeydownListener(callback)
    case 'keyup':
      return makeKeyupListener(callback)
    case 'keypress':
      return makeKeypressListener(callback)
    default:
      return makeCustomListener(event, callback)
  }
}
