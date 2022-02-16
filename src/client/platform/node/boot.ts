import { JSDOM } from 'jsdom'
import { System } from '../../../system'
import { SYSTEM_ROOT_ID } from '../../SYSTEM_ROOT_ID'
import { _webBoot } from '../web/boot'

export function nodeBoot(): System {
  const { window } = new JSDOM(`<div id="${SYSTEM_ROOT_ID}"></div>`)

  // @ts-ignore
  return _webBoot(window)
}
