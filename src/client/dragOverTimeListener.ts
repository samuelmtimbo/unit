import { Unlisten } from '../types/Unlisten'
import { Component } from './component'
import { IODragAndDropEvent } from './dnd'

export function dragOverTimeListener(
  component: Component,
  t: number,
  callback: () => void
): Unlisten {
  const {
    api: {
      window: { setTimeout, clearTimeout },
    },
  } = component.$system

  const drag_enter_listener = ({}: CustomEvent<IODragAndDropEvent>) => {
    let i = 1

    const stopListener = () => {
      clearTimeout(over_timeout)

      component.$element.removeEventListener('_dragleave', stopListener)
      component.$element.removeEventListener('_dragdrop', stopListener)
    }

    let over_timeout: number

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

  component.$element.addEventListener('_dragenter', drag_enter_listener)

  return () => {
    component.$element.removeEventListener('_dragenter', drag_enter_listener)
  }
}
