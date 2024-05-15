import { JSDOM } from 'jsdom'
import { BootOpt, System } from '../../../system'
import { Unlisten } from '../../../types/Unlisten'
import { SYSTEM_ROOT_ID } from '../../SYSTEM_ROOT_ID'
import { webBoot } from '../web/boot'

export function boot(opt?: BootOpt): [System, Unlisten] {
  const { window } = new JSDOM(`<div id="${SYSTEM_ROOT_ID}"></div>`, {
    url: 'http://localhost/',
  })

  const root = window.document.getElementById(SYSTEM_ROOT_ID)

  window.fetch = fetch
  window.HTMLCanvasElement.prototype.getContext = () => null

  // @ts-ignore
  return webBoot(window, root, opt)
}
