import { NOOP } from '../NOOP'
import { Dict } from '../types/Dict'
import { Unlisten } from '../types/Unlisten'
import { callAll } from '../util/call/callAll'
import { addListener } from './addListener'
import { Component } from './component'
import { makeCustomListener } from './event/custom'
import { makeResizeListener } from './event/resize'

export function reactToFrameSize(
  value: string,
  component: Component<HTMLElement | SVGElement>,
  setValue: (value: number) => void
): Unlisten {
  let unlistenComponent = NOOP
  let unlistenContext = NOOP

  const vh = value.endsWith('vh')
  const vw = value.endsWith('vw')

  if (vw || vh) {
    const percent = parseFloat(value.replace('vh', '').replace('vw', '')) / 100

    const resize = ({ width, height }) => {
      setValue(vw ? width * percent : height * percent)
    }

    const resizeListener = makeResizeListener(resize)

    const immediateResize = () => {
      const { $width: width, $height: height } = component.$context

      resize({ width, height })
    }

    const addContextListener = () => {
      const { $context } = component

      unlistenContext = addListener($context, resizeListener)
    }

    const removeContextListener = () => {
      unlistenContext()

      unlistenContext = NOOP
    }

    if (component.$mounted) {
      addContextListener()

      immediateResize()
    }

    unlistenComponent = component.addEventListeners([
      makeCustomListener('mount', () => {
        immediateResize()

        addContextListener()
      }),
      makeCustomListener('unmount', removeContextListener),
    ])

    return () => callAll([removeContextListener, unlistenComponent])()
  }

  return NOOP
}

export function applyDynamicStyle(
  component: Component<HTMLElement | SVGElement>,
  style: Dict<string>
): Unlisten {
  const { $element } = component

  removeStyle($element)

  const { fontSize } = style

  let unlistenResize = NOOP

  let styleUnlisten = component.$propUnlisten['style']

  if (styleUnlisten) {
    styleUnlisten()

    delete component.$propUnlisten['style']
  }

  if ($element instanceof HTMLElement) {
    if (fontSize) {
      delete $element.style.fontSize

      unlistenResize = reactToFrameSize(fontSize, component, (value) => {
        $element.style.fontSize = value + 'px'
      })
    }
  }

  mergeStyle($element, style)

  styleUnlisten = callAll([unlistenResize])

  component.$propUnlisten['style'] = styleUnlisten

  return styleUnlisten
}

export function removeStyle(element: HTMLElement | SVGElement) {
  const _style = element.style

  while (_style[0]) {
    _style.removeProperty(_style[0])
  }
}

export default function applyStyle(
  element: HTMLElement | SVGElement,
  style: Dict<string>
) {
  removeStyle(element)
  mergeStyle(element, style)
}

export function mergeStyle(
  element: HTMLElement | SVGElement,
  style: Dict<string>
) {
  const _style = element.style

  for (const key in style) {
    const value = style[key]

    _style[key] = value
  }
}
