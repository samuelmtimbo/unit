import { System } from '../system'
import {
  IPositionCallback,
  IPositionEntry,
  IPositionObserver,
} from '../types/global/IPositionObserver'
import { Unlisten } from '../types/Unlisten'
import callAll from '../util/call/callAll'
import { parseTransformXY } from './parseTransformXY'
import { animateThrottle } from './throttle'
import {
  addVector,
  angleToRad,
  rotateVector,
  subtractVector,
} from './util/geometry'

export class PositionObserver implements IPositionObserver {
  private _system: System

  private _callback: IPositionCallback
  private _unlisten: () => void
  private _abort: () => void

  constructor(system: System, callback: IPositionCallback) {
    this._system = system
    this._callback = callback
  }

  public observe(element: HTMLElement): IPositionEntry {
    const {
      api: {
        document: { MutationObserver, ResizeObserver },
      },
    } = this._system
    if (this._abort) {
      this._abort()
      this._abort = undefined
    }

    // console.log(element)
    const { isConnected } = element

    if (!isConnected) {
      console.log('PositionObserver', 'observe', '!isConnected')
      return { x: 0, y: 0, sx: 1, sy: 1, rx: 0, ry: 0, rz: 0 }
      // throw new Error('element is not mounted')
    }

    let x: number = 0
    let y: number = 0

    let sx: number = 1
    let sy: number = 1

    let rx: number = 0
    let ry: number = 0
    let rz: number = 0

    let width: number = 0
    let height: number = 0

    let offset_x: number = 0
    let offset_y: number = 0

    let transform_x: number = 0
    let transform_y: number = 0

    let scale_x: number = 1
    let scale_y: number = 1

    let rotate_x: number = 0
    let rotate_y: number = 0
    let rotate_z: number = 0

    let parent_x: number = 0
    let parent_y: number = 0

    let parent_scroll_top = 0
    let parent_scroll_left = 0

    let parent_scale_x = 1
    let parent_scale_y = 1

    let parent_rx = 0
    let parent_ry = 0
    let parent_rz = 0

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
          const [
            _transform_x,
            _transform_y,
            _scale_x,
            _scale_y,
            _rotate_x,
            _rotate_y,
            _rotate_z,
          ] = parseTransformXY(transform, offsetWidth, offsetHeight)
          transform_x = _transform_x
          transform_y = _transform_y
          scale_x = _scale_x
          scale_y = _scale_y
          rotate_x = _rotate_x
          rotate_y = _rotate_y
          rotate_z = _rotate_z
        } else {
          transform_x = 0
          transform_y = 0
          scale_x = 1
          scale_y = 1
          rotate_x = 0
          rotate_y = 0
          rotate_z = 0
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

      const rxr = angleToRad(rotate_x)
      const ryr = angleToRad(rotate_y)
      const rzr = angleToRad(rotate_z)

      rx = rxr + parent_rx
      ry = ryr + parent_ry
      rz = rzr + parent_rz

      const parent_rz_cos = Math.cos(parent_rz)
      const parent_rz_sin = Math.sin(parent_rz)

      const local_x = offset_x + transform_x
      const local_y = offset_y + transform_y

      const scaled_local_x = local_x * parent_scale_x
      const scaled_local_y = local_y * parent_scale_y

      const scaled_rotated_local_x =
        scaled_local_x * parent_rz_cos - scaled_local_y * parent_rz_sin
      const scaled_rotated_local_y =
        scaled_local_y * parent_rz_cos + scaled_local_x * parent_rz_sin

      const px =
        parent_x -
        parent_scroll_left +
        scaled_rotated_local_x * scale_x -
        ((width * sx) / 2) * (scale_x - 1)

      const py =
        parent_y -
        parent_scroll_top +
        scaled_rotated_local_y * scale_y -
        ((height * sy) / 2) * (scale_y - 1)

      const cx =
        px +
        (width * parent_scale_x * parent_rz_cos -
          height * parent_scale_y * parent_rz_sin) /
          2
      const cy =
        py +
        (width * parent_scale_y * parent_rz_sin +
          height * parent_scale_x * parent_rz_cos) /
          2

      const c = { x: cx, y: cy }
      const p = { x: px, y: py }

      const cp = subtractVector(p, c)
      const rcp = rotateVector(cp, rzr)
      const fp = addVector(c, rcp)

      x = fp.x
      y = fp.y
    }

    const update = (): void => {
      _update()
      this._callback({ x, y, sx, sy, rx, ry, rz })
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

        const parentPositionCallback = ({
          x: _parent_x,
          y: _parent_y,
          sx: _parent_scale_x,
          sy: _parent_scale_y,
          rx: _parent_rotate_x,
          ry: _parent_rotate_y,
          rz: _parent_rotate_z,
        }) => {
          parent_x = _parent_x
          parent_y = _parent_y
          parent_scale_x = _parent_scale_x
          parent_scale_y = _parent_scale_y
          parent_rx = _parent_rotate_x
          parent_ry = _parent_rotate_y
          parent_rz = _parent_rotate_z

          update_local()
        }

        const parentPostionObserver = new PositionObserver(
          this._system,
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

    return { x, y, sx, sy, rx, ry, rz }
  }

  disconnect() {
    if (this._unlisten) {
      this._unlisten()
      this._unlisten = undefined
    }
  }
}
