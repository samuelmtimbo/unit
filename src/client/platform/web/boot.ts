import { API } from '../../../API'
import { boot } from '../../../boot'
import { BootOpt, System } from '../../../system'
import _classes from '../../../system/_classes'
import _components from '../../../system/_components'
import _specs from '../../../system/_specs'
import { Unlisten } from '../../../types/Unlisten'
import { attachApp } from '../../render/attachApp'
import { attachGesture } from '../../render/attachGesture'
import { attachHTML } from '../../render/attachHTML'
import { attachLayout } from '../../render/attachLayout'
import { attachLongPress } from '../../render/attachLongPress'
import { attachStyle } from '../../render/attachStyle'
import { attachSVG } from '../../render/attachSVG'
import { attachVoid } from '../../render/attachVoid'
import { SYSTEM_ROOT_ID } from '../../SYSTEM_ROOT_ID'
import { webAlert } from './api/alert'
import { webAnimation } from './api/animation'
import { webBluetooth } from './api/bluetooth'
import { webChannel } from './api/channel'
import { webClipboard } from './api/clipboard'
import { webCrypto } from './api/crypto'
import { webDB } from './api/db'
import { webDevice } from './api/device'
import { webDocument } from './api/document'
import { webFile } from './api/file'
import { webGeolocation } from './api/geolocation'
import { webHistory } from './api/history'
import { webHTTP } from './api/http'
import { webInput } from './api/input'
import { webLayout } from './api/layout'
import { webLocation } from './api/location'
import { webMedia } from './api/media'
import { webNavigator } from './api/navigator'
import { webQuerystring } from './api/querystring'
import { webScreen } from './api/screen'
import { webSelection } from './api/selection'
import { webSpeech } from './api/speech'
import { webText } from './api/text'
import { webTheme } from './api/theme'
import { webURI } from './api/uri'
import { webURL } from './api/url'
import { webWindow } from './api/window'
import { webWorker } from './api/worker'

export function defaultWebBoot(opt?: BootOpt): [System, Unlisten] {
  const root = document.getElementById(SYSTEM_ROOT_ID)

  return webBoot(window, root, opt)
}

export function webBoot(
  window: Window,
  root: HTMLElement,
  opt: BootOpt = {
    specs: _specs,
    classes: _classes,
    components: _components,
  }
): [System, Unlisten] {
  const _root = window.document.createElement('div')

  _root.style.width = '100%'
  _root.style.height = '100%'
  _root.style.overflow = 'hidden'

  _root.attachShadow({ mode: 'open' })

  const http = webHTTP(window, opt)
  const channel = webChannel(window, opt)
  const file = webFile(window, opt)
  const screen = webScreen(window, opt)
  const device = webDevice(window, opt)
  const geolocation = webGeolocation(window, opt)
  const speech = webSpeech(window, opt)
  const media = webMedia(window, opt)
  const clipboard = webClipboard(window, opt)
  const selection = webSelection(window, opt)
  const animation = webAnimation(window, opt)
  const document = webDocument(window, _root, opt)
  const querystring = webQuerystring(window, opt)
  const bluetooth = webBluetooth(window, opt)
  const text = webText(window, opt)
  const input = webInput(window, root, opt)
  const db = webDB(window, opt)
  const worker = webWorker(window, opt)
  const url = webURL(window, opt)
  const uri = webURI(window, opt)
  const alert = webAlert(window, opt)
  const location = webLocation(window, opt)
  const history = webHistory(window, opt)
  const _window = webWindow(window, opt)
  const navigator = webNavigator(window, opt)
  const layout = webLayout(window, opt)
  const theme = webTheme(window, _root, opt)
  const crypto = webCrypto(window, opt)

  const api: API = {
    alert,
    selection,
    file,
    animation,
    db,
    device,
    screen,
    bluetooth,
    clipboard,
    crypto,
    location,
    history,
    geolocation,
    layout,
    media,
    http,
    channel,
    input,
    speech,
    document,
    querystring,
    text,
    worker,
    url,
    uri,
    window: _window,
    navigator,
    theme,
  }

  const system = boot(null, api, opt)

  root.appendChild(_root)

  _root.style.fontFamily = "'Inconsolata', monospace"

  system.root = _root

  attachStyle(system)
  attachApp(system)
  attachSVG(system)
  attachHTML(system)
  attachGesture(system)
  attachLongPress(system)
  attachLayout(system)
  attachVoid(system)
  // attachFocus(system)

  const unlisten = () => {
    root.removeChild(_root)

    system.destroy()
  }

  return [system, unlisten]
}
