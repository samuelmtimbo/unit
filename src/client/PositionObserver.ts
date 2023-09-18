import { System } from '../system'
import {
  IPositionCallback,
  IPositionEntry,
  IPositionObserver,
} from '../types/global/IPositionObserver'
import { Unlisten } from '../types/Unlisten'
import { callAll } from '../util/call/callAll'
import { applyLayoutValue } from './parseLayoutValue'
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
    // console.log('PositionObserver', 'observe')

    const {
      api: {
        document: { MutationObserver, ResizeObserver },
      },
    } = this._system
    if (this._abort) {
      this._abort()

      this._abort = undefined
    }

    const { isConnected } = element

    if (!isConnected) {
      throw new Error('element is not mounted')
    }

    let x: number = 0
    let y: number = 0

    let sx: number = 1
    let sy: number = 1

    let rx: number = 0
    let ry: number = 0
    let rz: number = 0

    let px: number = 0
    let py: number = 0

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
    let _border: string | undefined

    const _update_local = (): void => {
      __update_local()

      update()
    }

    const __update_local = (): void => {
      const { offsetLeft, offsetTop, offsetWidth, offsetHeight, style } =
        element

      offset_x = offsetLeft
      offset_y = offsetTop

      const { transform, border } = style

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

      if (border !== _border) {
        if (border) {
          const [borderSizeStr] = border.split(' ')

          let borderSize = 0

          if (['thin', 'medium', 'thick'].includes(borderSizeStr)) {
            // TODO
          } else {
            borderSize = applyLayoutValue(borderSizeStr, 0)
          }

          px = borderSize
          py = borderSize
        }

        _border = border
      }

      width = offsetWidth
      height = offsetHeight
    }

    const { f: update_local, abort } = animateThrottle(
      this._system,
      _update_local
    )

    this._abort = abort

    // const update_local = _update_local

    // this._abort = NOOP

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

      const parent_scaled_local_x = local_x * parent_scale_x
      const parent_scaled_local_y = local_y * parent_scale_y

      const parent_scaled_rotated_local_x =
        parent_scaled_local_x * parent_rz_cos -
        parent_scaled_local_y * parent_rz_sin
      const parent_scaled_rotated_local_y =
        parent_scaled_local_y * parent_rz_cos +
        parent_scaled_local_x * parent_rz_sin

      const px =
        parent_x -
        parent_scroll_left +
        parent_scaled_rotated_local_x * scale_x -
        ((width * parent_scale_x) / 2) * (scale_x - 1)

      const py =
        parent_y -
        parent_scroll_top +
        parent_scaled_rotated_local_y * scale_y -
        ((height * parent_scale_y) / 2) * (scale_y - 1)

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

      this._callback(x, y, sx, sy, rx, ry, rz, px, py)
    }

    const mutationConfig = {
      childList: false,
      subtree: false,
      attributes: true,
      attributeFilter: ['style'],
    }

    const mutationObserver = new MutationObserver(update_local)

    mutationObserver.observe(element, mutationConfig)

    const resizeObserver = new ResizeObserver(update_local)

    const resizeConfig: ResizeObserverOptions = {
      box: 'device-pixel-content-box',
    }

    // Safari (on iOS) will not accept this config
    // resizeObserver.observe(element, resizeConfig)
    resizeObserver.observe(element)

    const unlisten_self = () => {
      mutationObserver.disconnect()

      resizeObserver.unobserve(element)
      resizeObserver.disconnect()
    }

    const update_parent = (): (() => void) => {
      const { offsetParent, parentElement } = element

      // const targetParent = parentElement
      const targetParent = offsetParent

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

          const { f: _parentScrollListener } = animateThrottle(
            this._system,
            parentScrollListener
          )

          p.addEventListener('scroll', _parentScrollListener, {
            passive: true,
          })
          const unlisten = () => {
            p.removeEventListener('scroll', _parentScrollListener)
          }
          scrollParentUnlisten.push(unlisten)
        }

        if (element.style.position === 'absolute') {
          //
        } else {
          let p = parentElement

          while (p && p !== targetParent) {
            if (p instanceof HTMLElement) {
              if (
                p.style.position === 'absolute' ||
                p.style.position === 'fixed'
              ) {
                break
              }
            }

            pushScrollParent(p)

            p = p.parentElement
          }

          pushScrollParent(targetParent)
        }

        const unlitenScroll = callAll(scrollParentUnlisten)

        const parentConfig = {
          childList: true,
          subtree: false,
          attributes: true,
          attributeFilter: ['style'],
        }

        const parentMutationCallback: MutationCallback = (mutationsList) => {
          update_local()
        }

        const parentMutationObserver = new MutationObserver(
          parentMutationCallback
        )

        parentMutationObserver.observe(targetParent, parentConfig)

        const parentPositionCallback = (
          x: number,
          y: number,
          sx: number,
          sy: number,
          rx: number,
          ry: number,
          rz: number,
          px: number,
          py: number
        ) => {
          parent_x = x + px
          parent_y = y + py
          parent_scale_x = sx
          parent_scale_y = sy
          parent_rx = rx
          parent_ry = ry
          parent_rz = rz

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

    __update_local()
    _update()

    return { x, y, sx, sy, rx, ry, rz, px, py }
  }

  disconnect() {
    // console.log('PositionObserver', 'disconnect')

    if (this._unlisten) {
      this._unlisten()

      this._unlisten = undefined
    }
  }
}
