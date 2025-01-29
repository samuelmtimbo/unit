import { System } from '../system'
import {
  IPositionObserverEntry,
  PositionObserver,
  PositionObserverCallback,
} from '../types/global/PositionObserver'
import { Unlisten } from '../types/Unlisten'
import { callAll } from '../util/call/callAll'
import { animateThrottle } from './animateThrottle'
import { applyLayoutValue } from './parseLayoutValue'
import { parseTransform } from './parseTransform'
import {
  addVector,
  angleToRad,
  rotateVector,
  subtractVector,
} from './util/geometry'

export class PositionObserver_ implements PositionObserver {
  private _system: System

  private _callback: PositionObserverCallback
  private _unlisten: () => void
  private _abort: () => void

  constructor(system: System, callback: PositionObserverCallback) {
    this._system = system
    this._callback = callback
  }

  public observe(element: HTMLElement): IPositionObserverEntry {
    // console.log('PositionObserver', 'observe')

    const {
      api: {
        document: { MutationObserver, ResizeObserver },
        animation: { requestAnimationFrame, cancelAnimationFrame },
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

    let bx: number = 0
    let by: number = 0

    let gbx: number = 0
    let gby: number = 0

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

    let parent_bx: number = 0
    let parent_by: number = 0

    let parent_gbx: number = 0
    let parent_gby: number = 0

    let parent_scroll_top = 0
    let parent_scroll_left = 0

    let parent_scale_x = 1
    let parent_scale_y = 1

    let parent_rx = 0
    let parent_ry = 0
    let parent_rz = 0

    let _transform: string | undefined
    let _borderWidth: string | undefined

    let _border_x: number = 0
    let _border_y: number = 0

    function _update_local(): void {
      __update_local()

      update()
    }

    function __update_local(): void {
      const {
        offsetLeft = 0,
        offsetTop = 0,
        offsetWidth = 0,
        offsetHeight = 0,
      } = element

      offset_x = offsetLeft
      offset_y = offsetTop

      let { transform } = element.style

      const computedStyle = getComputedStyle(element)

      const { borderWidth } = computedStyle

      transform = transform || computedStyle.transform

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
          ] = parseTransform(transform, offsetWidth, offsetHeight)

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

      if (borderWidth !== _borderWidth) {
        if (borderWidth) {
          const [borderSizeStr] = borderWidth.split(' ')

          let borderSize = 0

          if (['thin', 'medium', 'thick'].includes(borderSizeStr)) {
            // TODO
          } else {
            borderSize = applyLayoutValue(borderSizeStr, 0)
          }

          _border_x = borderSize
          _border_y = borderSize

          _borderWidth = borderWidth

          bx = _border_x
          by = _border_y
        }
      }

      gbx = parent_bx + parent_gbx
      gby = parent_by + parent_gby

      width = offsetWidth
      height = offsetHeight
    }

    const { f: update_local, abort } = animateThrottle(
      _update_local,
      requestAnimationFrame,
      cancelAnimationFrame
    )

    // const update_local = _update_local

    // const abort = NOOP

    // this._abort = abort

    function _update(): void {
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
        parent_gbx / 2 +
        parent_x -
        parent_scroll_left +
        parent_scaled_rotated_local_x * scale_x -
        ((width * parent_scale_x) / 2) * (scale_x - 1)

      const py =
        parent_gby / 2 +
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

      this._callback(x, y, sx, sy, rx, ry, rz, bx, by, gbx, gby)
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

    // Safari (iOS) will not accept this config
    // resizeObserver.observe(element, resizeConfig)
    resizeObserver.observe(element)

    function unlisten_self() {
      abort()

      mutationObserver.disconnect()

      resizeObserver.unobserve(element)
      resizeObserver.disconnect()
    }

    const update_parent = () => {
      const { offsetParent, parentElement } = element

      const targetParent = parentElement
      // const targetParent = offsetParent

      if (targetParent) {
        const scrollParentUnlisten: Unlisten[] = []

        const pushScrollParent = (p: Element) => {
          const { scrollLeft, scrollTop } = p

          parent_scroll_top += scrollTop
          parent_scroll_left += scrollLeft

          let _scrollLeft = scrollLeft
          let _scrollTop = scrollTop

          function parentScrollListener() {
            const { scrollLeft, scrollTop } = p

            parent_scroll_left += scrollLeft - _scrollLeft
            parent_scroll_top += scrollTop - _scrollTop

            _scrollLeft = scrollLeft
            _scrollTop = scrollTop

            update()
          }

          const { f: parentScrollListener_, abort: parentScrollAbort_ } =
            animateThrottle(
              parentScrollListener,
              requestAnimationFrame,
              cancelAnimationFrame
            )

          p.addEventListener('scroll', parentScrollListener_, {
            passive: true,
          })

          function unlisten() {
            p.removeEventListener('scroll', parentScrollListener_)

            parentScrollAbort_()
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

        function parentMutationCallback() {
          update_local()
        }

        const parentMutationObserver = new MutationObserver(
          parentMutationCallback
        )

        parentMutationObserver.observe(targetParent, parentConfig)

        function parentPositionCallback(
          x: number,
          y: number,
          sx: number,
          sy: number,
          rx: number,
          ry: number,
          rz: number,
          bx: number,
          by: number,
          gbx: number,
          gby: number
        ) {
          parent_x = x
          parent_y = y
          parent_bx = bx
          parent_by = by
          parent_gbx = gbx
          parent_gby = gby
          parent_scale_x = sx
          parent_scale_y = sy
          parent_rx = rx
          parent_ry = ry
          parent_rz = rz

          update_local()
        }

        const parentPositionObserver = new PositionObserver_(
          this._system,
          parentPositionCallback
        )

        const {
          x: _parent_x,
          y: _parent_y,
          sx: _parent_scale_x,
          sy: _parent_scale_y,
        } = parentPositionObserver.observe(targetParent as HTMLElement)

        parent_x = _parent_x
        parent_y = _parent_y

        parent_scale_x = _parent_scale_x
        parent_scale_y = _parent_scale_y

        _update()

        function parentResizeObserverCallback() {
          update_local()
        }

        const parentResizeObserver = new ResizeObserver(
          parentResizeObserverCallback
        )

        parentResizeObserver.observe(targetParent)

        return function () {
          unlitenScroll()

          parentResizeObserver.disconnect()
          parentMutationObserver.disconnect()
          parentPositionObserver.disconnect()
        }
      } else {
        return function () {}
      }
    }

    const unlisten_parent = update_parent()

    function unlisten() {
      unlisten_self()
      unlisten_parent()
    }

    this._unlisten = unlisten
    this._abort = abort

    __update_local()
    _update()

    return { x, y, sx, sy, rx, ry, rz, bx, by, gbx, gby }
  }

  disconnect() {
    // console.log('PositionObserver', 'disconnect')

    if (this._unlisten) {
      this._unlisten()
      this._unlisten = undefined
    }

    if (this._abort) {
      this._abort()
      this._abort = undefined
    }
  }
}
