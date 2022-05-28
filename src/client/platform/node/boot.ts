import { JSDOM } from 'jsdom'
import { System } from '../../../system'
import { SYSTEM_ROOT_ID } from '../../SYSTEM_ROOT_ID'
import { _webBoot } from '../web/boot'

export function nodeBoot(): System {
  const { window } = new JSDOM(`<div id="${SYSTEM_ROOT_ID}"></div>`, {
    url: 'http://localhost/',
  })

  const root = window.document.getElementById(SYSTEM_ROOT_ID)

  // @ts-ignore
  return _webBoot(window, root)
}
