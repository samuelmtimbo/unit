import { NOOP } from '../NOOP'
import { Dict } from '../types/Dict'
import { Unlisten } from '../types/Unlisten'
import { callAll } from '../util/call/callAll'
import { addListener } from './addListener'
import { Component } from './component'
import { makeCustomListener } from './event/custom'
import { makeResizeListener } from './event/resize'
import { camelToDashed } from './id'
import { cssTextToObj, objToCssText } from './rawExtractStyle'

export const isVValue = (value: string) => {
  return value.endsWith('vh') || value.endsWith('vw')
}

export function reactToFrameSize(
  value: string,
  component: Component,
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
    }

    immediateResize()

    unlistenComponent = component.addEventListeners([
      makeCustomListener('mount', () => {
        immediateResize()

        if (unlistenContext) {
          unlistenContext()
        }

        addContextListener()
      }),
      makeCustomListener('unmount', removeContextListener),
    ])

    return callAll([removeContextListener, unlistenComponent])
  }

  return NOOP
}

export function applyDynamicStyle(
  component: Component<any>,
  $element: any,
  style: Dict<string>
): Unlisten {
  let { fontSize, width, height } = style

  let styleUnlisten = component.$propUnlisten['style']

  if (styleUnlisten) {
    styleUnlisten()

    delete component.$propUnlisten['style']
  }

  const unlistenAll = []

  if (typeof fontSize === 'number') {
    fontSize = `${fontSize}px`
  }

  const set = (name: string, value: number) => {
    if (component.$moving) {
      return
    }

    const px = value + 'px'

    style[name] = px

    component.$element.style[name] = px
  }

  if (fontSize && isVValue(fontSize)) {
    delete style.fontSize

    unlistenAll.push(
      reactToFrameSize(fontSize, component, (value) => {
        set('fontSize', value)
      })
    )
  }

  if (width && isVValue(width)) {
    delete style.width

    unlistenAll.push(
      reactToFrameSize(width, component, (value) => {
        set('width', value)
      })
    )
  }

  if (height && isVValue(height)) {
    delete style.height

    unlistenAll.push(
      reactToFrameSize(height, component, (value) => {
        set('height', value)
      })
    )
  }

  applyStyle($element, style)

  styleUnlisten = callAll(unlistenAll)

  component.$propUnlisten['style'] = styleUnlisten

  return styleUnlisten
}

export function removeStyle(element: HTMLElement | SVGElement) {
  element.style.cssText = ''
}

export function applyStyle(
  element: HTMLElement | SVGElement,
  style: Dict<string>
) {
  element.style.cssText = objToCssText(style)
}

export function getStyleObj(element: HTMLElement | SVGElement): Dict<string> {
  return cssTextToObj(element.style.cssText)
}

export function mergeStyle(
  element: HTMLElement | SVGElement,
  style: Dict<string>
) {
  const current = getStyleObj(element)

  for (const key in style) {
    const value = style[key]

    current[camelToDashed(key)] = value
  }

  applyStyle(element, current)
}
