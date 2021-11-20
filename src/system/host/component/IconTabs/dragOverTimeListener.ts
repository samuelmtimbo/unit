import { Component } from '../../../../client/component'
import { Unlisten } from '../../../../Unlisten'

export function dragOverTimeListener(
  component: Component,
  t: number,
  callback: () => void
): Unlisten {
  const drag_enter_listener = ({
    detail: { pointerId },
  }: CustomEvent<PointerEvent>) => {
    const { $system } = component

    if ($system.cache.dragAndDrop[pointerId]) {
      let i = 1
      const stopListener = () => {
        clearTimeout(over_timeout)
        component.$element.removeEventListener('_dragleave', stopListener)
        component.$element.removeEventListener('_dragdrop', stopListener)
      }
      let over_timeout: NodeJS.Timeout
      const set_over_timeout = () => {
        over_timeout = setTimeout(() => {
          callback()
          i++
          set_over_timeout()
        }, i * t)
      }
      set_over_timeout()
      component.$element.addEventListener('_dragleave', stopListener)
      component.$element.addEventListener('_dragdrop', stopListener)
    }
  }

  component.$element.addEventListener('_dragenter', drag_enter_listener)

  return () => {
    component.$element.removeEventListener('_dragenter', drag_enter_listener)
  }
}
