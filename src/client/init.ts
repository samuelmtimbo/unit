import { System } from '../boot'
import { uuid } from '../util/id'
import { Unlisten } from './../Unlisten'
import { isSupportedEvent } from './event/keyboard'
import { isPhone, isTablet } from './platform'

export default function init($system: System, $root: HTMLElement): Unlisten {
  $root.ondblclick = (event: MouseEvent) => {
    event.preventDefault()
  }

  // $root.addEventListener(
  //   'wheel',
  //   (event: WheelEvent) => {
  //     const { ctrlKey } = event

  //     if (ctrlKey) {
  //       // prevent pull to refresh on Safari
  //       // prevent pinch to zoom on Chrome
  //       // event.preventDefault()
  //     }
  //   },
  //   { passive: false }
  // )

  // $root.addEventListener(
  //   'wheel',
  //   function(event: WheelEvent) {
  //     const { ctrlKey } = event
  //     if (!ctrlKey) {
  //       const scale = $root.visualViewport.scale || 1
  //       if (scale > 1) {
  //         event.preventDefault()
  //       }
  //     }
  //   },
  //   { passive: false }
  // )

  if (!isPhone && !isTablet) {
    $root.oncontextmenu = function () {
      return false
    }
  }

  $root.addEventListener('webkitmouseforcewillbegin', function (event) {
    event.preventDefault()
    return false
  })

  $root.addEventListener(
    'blur',
    function (event: FocusEvent) {
      const { relatedTarget } = event

      // when window is blurred by a popup/alert as a result of a "keydown",
      // "keyup" will not be fired
      if (!relatedTarget) {
        $system.$input.$keyboard.$pressed = []
      }
    },
    true
  )

  // $root.addEventListener('touchmove', (event: TouchEvent) => {
  //   const { touches } = event
  //   console.log('touchmove', touches)
  // })

  // $root.addEventListener('pointercancel', (event: TouchEvent) => {
  //   console.log('pointercancel')
  //   // alert('pointercancel')
  // })

  $root.addEventListener(
    'keydown',
    (event: KeyboardEvent) => {
      if (!isSupportedEvent(event)) {
        return
      }

      const { keyCode, repeat } = event

      const index = $system.$input.$keyboard.$pressed.indexOf(keyCode)
      $system.$input.$keyboard.$repeat = repeat
      if (index === -1) {
        $system.$input.$keyboard.$pressed.push(keyCode)
      }
    },
    true
  )

  $root.addEventListener(
    'keyup',
    (event: KeyboardEvent) => {
      if (!isSupportedEvent(event)) {
        return
      }

      const { keyCode, key } = event

      const index = $system.$input.$keyboard.$pressed.indexOf(keyCode)
      $system.$input.$keyboard.$pressed.splice(index, 1)
    },
    true
  )

  const __name__to__id = {}

  for (let id in globalThis.__specs) {
    const spec = globalThis.__specs[id]
    const { name } = spec
    __name__to__id[name] = id
  }
  globalThis.__name__to__id = __name__to__id

  // isInstalled().then((installed: boolean) => {
  //   // alert(installed)
  // })

  // setInterval(() => {
  //   log($root.document.activeElement)
  // }, 1000)

  let subSessionId = sessionStorage.getItem('subSessionId')
  if (!subSessionId) {
    subSessionId = uuid()
    sessionStorage.setItem('subSessionId', subSessionId)
  }
  // console.log('subSessionId', subSessionId)

  // document.addEventListener(
  //   'visibilitychange',
  //   () => {
  //     log('visibilitychange', document.visibilityState)
  //   },
  //   false
  // )

  // if ($root.visualViewport) {
  //   $root.visualViewport.addEventListener('scroll', (event) => {
  //     // console.log('visualViewport', 'scroll', $root.visualViewport)
  //   })
  //   $root.visualViewport.addEventListener('resize', (event) => {
  //     // console.log('visualViewport', 'resize', $root.visualViewport)
  //   })
  // }

  // $root.addEventListener('scroll', (event: MouseEvent) => {
  //   const { clientX, clientY } = event
  //   log('scroll', clientX, clientY)
  // })

  // $root.addEventListener('wheel', (event: MouseEvent) => {
  //   const { clientX, clientY } = event
  //   log('wheel', clientX, clientY)
  // })

  // $root.addEventListener('touchmove', (event: TouchEvent) => {
  //   const { touches } = event
  //   for (let i = 0; i < touches.length; i++) {
  //     const touch = touches.item(i)!
  //     log('touchmove', touch)
  //   }
  // })

  return () => {}
}
