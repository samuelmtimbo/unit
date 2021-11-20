import { BootOpt, Host, System } from '../../../system'
import { boot } from '../../../boot'
import deepMerge from '../../../system/f/object/DeepMerge/f'
import classes from '../../../system/_classes'
import components from '../../../system/_components'
import specs from '../../../system/_specs'
import { GraphSpec } from '../../../types'
import env, { dev, prod } from '../../env'
import { isConnected, send } from '../../host/socket'
import { isPWA } from '../../isPWA'
import noise from '../../paperBackground'
import { render } from '../../render'
import root from '../../root'
import { showNotification } from '../../showNotification'
import { RED } from '../../theme'

export default function web_render(spec: GraphSpec, opt: BootOpt = {}): System {
  console.log('env', env)

  if (env === 'production') {
    console.log = function () {}
  }

  window.addEventListener('error', function (event: ErrorEvent) {
    const message = event.error || event.message

    if (isConnected()) {
      send({
        type: 'client',
        data: {
          type: 'log',
          data: {
            type: 'error',
            data: {
              message,
            },
          },
        },
      })
    }

    // AD HOC
    if (message === 'ResizeObserver loop limit exceeded') {
      return
    }

    // log('error', message)
    showNotification(message, {
      // showNotification('An exception has ocurred; please refresh.', {
      color: RED,
      borderColor: RED,
    })

    return false
  })

  window.addEventListener('unhandledrejection', function (event) {
    console.log('unhandledrejection', event)
    // TODO logging
  })

  // Vivaldi

  const TEXT_INPUT_TYPE_SET = new Set([
    'text',
    'password',
    'file',
    'search',
    'email',
    'number',
    'date',
    'color',
    'datetime',
    'datetime-local',
    'month',
    'range',
    'search',
    'tel',
    'time',
    'url',
    'week',
  ])

  window.addEventListener(
    'keydown',
    (event) => {
      const { key, target } = event
      let doPrevent = true
      if (key === 'Backspace') {
        if (target instanceof HTMLElement) {
          const { tagName, isContentEditable } = target
          if (isContentEditable) {
            doPrevent = false
          } else if (tagName === 'TEXTAREA') {
            doPrevent = false
          } else if (tagName === 'INPUT') {
            let { type } = target as HTMLInputElement
            type = type.toLowerCase()
            if (TEXT_INPUT_TYPE_SET.has(type)) {
              doPrevent = false
            }
          }
        }
        if (doPrevent) {
          event.preventDefault()
          return false
        }
      }
    },
    true
  )

  if (prod && isPWA) {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        const { pathname } = location

        const swUrl = `${
          pathname.endsWith('/') ? pathname : `${pathname}/`
        }sw.js`

        navigator.serviceWorker
          .register(swUrl)
          .then((registration) => {
            registration.onupdatefound = () => {
              const installingWorker = registration.installing
              if (installingWorker) {
                installingWorker.onstatechange = () => {
                  if (installingWorker.state === 'installed') {
                    if (navigator.serviceWorker.controller) {
                      !dev &&
                        showNotification(
                          'A new update is available; please refresh.',
                          { color: '#ffcc00', borderColor: '#ffcc00' },
                          3000
                        )
                    } else {
                      !dev &&
                        showNotification(
                          'App is cached for offline use.',
                          { color: '#ffcc00', borderColor: '#ffcc00' },
                          3000
                        )
                    }
                  }
                }
              } else {
                console.log('registration.installing worker was not found')
              }
            }
          })
          .catch((error) => {
            console.error('Error during service worker registration:', error)
          })
      })
    }
  }

  noise(document.body)

  const tabStorage: Storage = {
    length: 0,

    clear: function (): void {
      throw new Error('Function not implemented.')
    },

    getItem: function (key: string): string {
      throw new Error('Function not implemented.')
    },

    key: function (index: number): string {
      throw new Error('Function not implemented.')
    },

    removeItem: function (key: string): void {
      throw new Error('Function not implemented.')
    },

    setItem: function (key: string, value: string): void {
      throw new Error('Function not implemented.')
    },
  }

  const cloudStorage: Storage = {
    length: 0,

    clear: function (): void {
      throw new Error('Function not implemented.')
    },

    getItem: function (key: string): string {
      throw new Error('Function not implemented.')
    },

    key: function (index: number): string {
      throw new Error('Function not implemented.')
    },

    removeItem: function (key: string): void {
      throw new Error('Function not implemented.')
    },

    setItem: function (key: string, value: string): void {
      throw new Error('Function not implemented.')
    },
  }

  const host: Host = {
    tabStorage,
    localStorage,
    sessionStorage,
    cloudStorage,
    location,
  }

  const _opt = deepMerge({ specs, classes, components, host }, opt) as BootOpt

  const $system = boot({ spec, specs: {} }, _opt)

  render($system, root)

  return $system
}
