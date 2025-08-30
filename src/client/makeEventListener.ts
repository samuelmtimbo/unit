import { makeChangeListener } from './event/change'
import { makeDragEndListener } from './event/drag/dragend'
import { makeDragOverListener } from './event/drag/dragover'
import { makeDragStartListener } from './event/drag/dragstart'
import { makeDropListener } from './event/drag/drop'
import { makeEndedListener } from './event/ended'
import { makeInputListener } from './event/input'
import {
  makeKeydownListener,
  makeKeypressListener,
  makeKeyupListener,
} from './event/keyboard'
import { makeLoadListener } from './event/load'
import { makeLoadedDataListener } from './event/loadeddata'
import { makeMessageListener } from './event/message'
import { makePasteListener } from './event/paste'
import { makeClickListener } from './event/pointer/click'
import { makePointerDownListener } from './event/pointer/pointerdown'
import { makePointerEnterListener } from './event/pointer/pointerenter'
import { makePointerInListener } from './event/pointer/pointerin'
import { makePointerLeaveListener } from './event/pointer/pointerleave'
import { makePointerMoveListener } from './event/pointer/pointermove'
import { makePointerOutListener } from './event/pointer/pointerout'
import { makePointerUpListener } from './event/pointer/pointerup'
import { makeToggleListener } from './event/popover/toggle'
import { makeWheelListener } from './event/wheel'
import { Listener } from './Listener'

export type UIEventName =
  | 'click'
  | 'dbclick'
  | 'longpress'
  | 'longclick'
  | 'pointerdown'
  | 'pointermove'
  | 'pointerup'
  | 'pointerenter'
  | 'pointerleave'
  | 'pointerout'
  | 'pointerin'
  | 'dragstart'
  | 'dragover'
  | 'dragend'
  | 'drop'
  | 'input'
  | 'change'
  | 'paste'
  | 'keydown'
  | 'keyup'
  | 'keypress'
  | 'wheel'
  | 'message'
  | 'toggle'
  | 'show'
  | 'hide'
  | 'load'
  | 'ended'
  | 'loadeddata'

export const UI_EVENT_SET: Set<UIEventName> = new Set([
  'click',
  'dbclick',
  'longpress',
  'longclick',
  'pointerdown',
  'pointermove',
  'pointerup',
  'pointerenter',
  'pointerleave',
  'dragstart',
  'dragend',
  'dragover',
  'drop',
  'input',
  'change',
  'paste',
  'keydown',
  'keyup',
  'keypress',
  'wheel',
  'message',
  'toggle',
  'show',
  'hide',
  'load',
  'ended',
  'loadeddata',
])

export function makeUIEventListener(
  event: UIEventName,
  callback: (data: any, event: any) => void
): Listener {
  switch (event) {
    case 'message':
      return makeMessageListener(callback)
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
    case 'pointerin':
      return makePointerInListener(callback)
    case 'pointerout':
      return makePointerOutListener(callback)
    case 'dragstart':
      return makeDragStartListener(callback)
    case 'dragend':
      return makeDragEndListener(callback)
    case 'dragover':
      return makeDragOverListener(callback)
    case 'drop':
      return makeDropListener(callback)
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
    case 'wheel':
      return makeWheelListener(callback)
    case 'toggle':
      return makeToggleListener(callback)
    case 'load':
      return makeLoadListener(callback)
    case 'ended':
      return makeEndedListener(callback)
    case 'loadeddata':
      return makeLoadedDataListener(callback)
    default:
      throw new Error(`unknown UI event: ${event}`)
  }
}
