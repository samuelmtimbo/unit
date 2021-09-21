import ResizeObserver from 'resize-observer-polyfill'
import callAll from '../callAll'
import { Unlisten } from '../Unlisten'
import { animateThrottle } from './throttle'

export function parseTransformXY(
  transform: string,
  width: number,
  height: number
): [number, number, number, number] {
  let _transform_x = 0
  let _transform_y = 0

  let _scale_x = 1
  let _scale_y = 1

  if (transform !== 'none') {
    const regex = /(\w+)\(([^)]*)\)/g
    let match
    while ((match = regex.exec(transform)) !== null) {
      const f_str = match[1] as string
      const f_args_str = match[2] as string
      const _f_args_str = f_args_str.replace(' ', '')
      const f_args_str_list = _f_args_str.split(',')
      const f_args_list = f_args_str_list.map((s) => {
        // TODO account for font-size units (em, ch, etc.)
        const _match = /([\+\-]?[0-9]+([.][0-9]+)?)(px|deg|\%)?/.exec(s)
        const num_str = _match[1]
        const unit_str = _match[3]
        let num: number = Number.parseFloat(num_str)
        return [num, unit_str]
      }) as [number, string][]

      switch (f_str) {
        case 'translate':
          {
            const [xt, yt = xt] = f_args_list
            let [x, xu] = xt
            if (xu === '%') {
              x = (x * width) / 100
            }
            let [y, yu] = yt
            if (yu === '%') {
              y = (y * height) / 100
            }
            _transform_x += x
            _transform_y += y
          }
          break
        case 'translateX':
          {
            const [xt] = f_args_list
            let [x, xu] = xt
            if (xu === '%') {
              x = (x * width) / 100
            }
            _transform_x += x
          }
          break
        case 'translateY':
          {
            const [yt] = f_args_list
            let [y, yu] = yt
            if (yu === '%') {
              y = (y * height) / 100
            }
            _transform_y += y
          }
          break
        case 'scale':
          {
            const [xt, yt = xt] = f_args_list
            const [x] = xt
            const [y] = yt
            _scale_x *= x
            _scale_y *= y
          }
          break
        case 'scaleX':
          {
            const [xt] = f_args_list
            const [x] = xt
            _scale_x *= x
          }
          break
        case 'scaleY':
          {
            const [yt] = f_args_list
            const [y] = yt
            _scale_y *= y
          }
          break
        case 'rotate':
          // TODO
          break
        case 'rotateX':
          // TODO
          break
        case 'rotateY':
          // TODO
          break
        case 'rotateZ':
          // TODO
          break
        default:
          break
      }
    }
  }

  return [_transform_x, _transform_y, _scale_x, _scale_y]
}

export class PositionObserver {
  private _callback: (x: number, y: number, sx: number, sy: number) => void

  private _unlisten: () => void

  private _abort: () => void

  constructor(
    callback: (x: number, y: number, sx: number, sy: number) => void
  ) {
    // const { f: _callback } = animateThrottle(callback)
    // this._callback = _callback
    this._callback = callback
  }

  public observe(element: HTMLElement): {
    x: number
    y: number
    sx: number
    sy: number
  } {
    if (this._abort) {
      this._abort()
      this._abort = undefined
    }

    // console.log(element)
    const { isConnected } = element

    if (!isConnected) {
      console.log('PositionObserver', 'observe', '!isConnected')
      return { x: 0, y: 0, sx: 1, sy: 1 }
      // throw new Error('element is not mounted')
    }

    let _x: number = 0
    let _y: number = 0

    let x: number = 0
    let y: number = 0

    let scale_x: number = 1
    let scale_y: number = 1

    let sx: number = 1
    let sy: number = 1

    let width: number = 0
    let height: number = 0

    let offset_x: number = 0
    let offset_y: number = 0

    let transform_x: number = 0
    let transform_y: number = 0

    let parent_x: number = 0
    let parent_y: number = 0

    let parent_scroll_top = 0
    let parent_scroll_left = 0

    let parent_scale_x = 1
    let parent_scale_y = 1

    let _transform: string | undefined

    const _update_local = (): void => {
      __update_local()

      update()
    }

    const __update_local = (): void => {
      const { offsetLeft, offsetTop, offsetWidth, offsetHeight, style } =
        element

      offset_x = offsetLeft
      offset_y = offsetTop

      const { transform } = style

      if (
        transform !== _transform ||
        width !== offsetWidth ||
        height !== offsetHeight
      ) {
        if (transform) {
          const [_transform_x, _transform_y, _scale_x, _scale_y] =
            parseTransformXY(transform, offsetWidth, offsetHeight)
          transform_x = _transform_x
          transform_y = _transform_y
          scale_x = _scale_x
          scale_y = _scale_y
        } else {
          transform_x = 0
          transform_y = 0
          scale_x = 1
          scale_y = 1
        }
        _transform = transform
      }

      width = offsetWidth
      height = offsetHeight
    }

    const { f: update_local, abort } = animateThrottle(_update_local)

    this._abort = abort

    // const update_local = _update_local

    const _update = (): void => {
      sx = scale_x * parent_scale_x
      sy = scale_y * parent_scale_y

      _x = x
      _y = y

      x =
        parent_x -
        parent_scroll_left +
        (offset_x + transform_x) * sx -
        ((width * sx) / 2) * (scale_x - 1)
      y =
        parent_y -
        parent_scroll_top +
        (offset_y + transform_y) * sy -
        ((height * sy) / 2) * (scale_y - 1)
    }

    const update = (): void => {
      _update()
      if (_x !== x || _y !== y) {
        // console.log('B', x, y)
        this._callback(x, y, sx, sy)
      }
    }

    const callback = function (mutationsList) {
      // for (const mutation of mutationsList) {
      //   console.log('element', mutation)
      //   if (mutation.type === 'childList') {
      //   } else if (mutation.type === 'attributes') {
      //   }
      // }
      update_local()
    }

    const config = {
      childList: false,
      subtree: false,
      attributes: true,
      attributeFilter: ['style'],
    }

    const mutationObserver = new MutationObserver(callback)

    mutationObserver.observe(element, config)

    const unlisten_self = () => {
      mutationObserver.disconnect()
    }

    const update_parent = (): (() => void) => {
      const { offsetParent, parentElement } = element

      const targetParent = offsetParent || parentElement

      if (targetParent) {
        const scrollParentUnlisten: Unlisten[] = []
        const pushScrollParent = (p: Element) => {
          const { scrollLeft, scrollTop } = p
          parent_scroll_top += scrollTop
          parent_scroll_left += scrollLeft
          let _scrollLeft = scrollLeft
          let _scrollTop = scrollTop
          const parentScrollListener = function () {
            const { scrollLeft, scrollTop } = p
            parent_scroll_left += scrollLeft - _scrollLeft
            parent_scroll_top += scrollTop - _scrollTop
            _scrollLeft = scrollLeft
            _scrollTop = scrollTop
            update()
          }
          const { f: _parentScrollListener } =
            animateThrottle(parentScrollListener)
          p.addEventListener('scroll', _parentScrollListener, {
            passive: true,
          })
          const unlisten = () => {
            p.removeEventListener('scroll', _parentScrollListener)
          }
          scrollParentUnlisten.push(unlisten)
        }
        let p = parentElement
        while (p !== targetParent) {
          pushScrollParent(p)
          p = p.parentElement
        }
        pushScrollParent(targetParent)
        const unlitenScroll = callAll(scrollParentUnlisten)

        const parentConfig = {
          childList: true,
          subtree: false,
          attributes: true,
          attributeFilter: ['style'],
        }

        const parentMutationCallback: MutationCallback = (mutationsList) => {
          // for (const mutation of mutationsList) {
          //   // console.log('parent', mutation)
          //   if (mutation.type === 'childList') {
          //     const { removedNodes } = mutation
          //     const removedNodesLength = removedNodes.length
          //     for (let i = 0; i < removedNodesLength; i++) {
          //       const removedNode = removedNodes.item(i)
          //       if (removedNode === element) {
          //         break
          //       }
          //     }
          //   } else if (mutation.type === 'attributes') {
          //   }
          // }
          update_local()
        }

        const parentMutationObserver = new MutationObserver(
          parentMutationCallback
        )

        parentMutationObserver.observe(targetParent, parentConfig)

        const parentPositionCallback = (
          _parent_x: number,
          _parent_y: number,
          _parent_scale_x: number,
          _parent_scale_y: number
        ) => {
          parent_x = _parent_x
          parent_y = _parent_y
          parent_scale_x = _parent_scale_x
          parent_scale_y = _parent_scale_y
          update_local()
        }

        const parentPostionObserver = new PositionObserver(
          parentPositionCallback
        )

        const {
          x: _parent_x,
          y: _parent_y,
          sx: _parent_scale_x,
          sy: _parent_scale_y,
        } = parentPostionObserver.observe(targetParent as HTMLElement)

        parent_x = _parent_x
        parent_y = _parent_y

        parent_scale_x = _parent_scale_x
        parent_scale_y = _parent_scale_y

        _update()

        const parentResizeObserverCallback = () => {
          update_local()
        }

        const parentResizeObserver = new ResizeObserver(
          parentResizeObserverCallback
        )

        parentResizeObserver.observe(targetParent)

        return () => {
          unlitenScroll()
          parentResizeObserver.disconnect()
          parentMutationObserver.disconnect()
          parentPostionObserver.disconnect()
        }
      } else {
        return () => {}
      }
    }

    const unlisten_parent = update_parent()

    const unlisten = () => {
      unlisten_self()
      unlisten_parent()
    }

    this._unlisten = unlisten

    // update_local()
    __update_local()
    _update()

    return { x, y, sx, sy }
  }

  disconnect() {
    if (this._unlisten) {
      this._unlisten()
      this._unlisten = undefined
    }
  }
}
