import { API } from '../../../API'
import { boot } from '../../../boot'
import { BootOpt, System } from '../../../system'
import { attachApp } from '../../render/attachApp'
import { attachCanvas } from '../../render/attachCanvas'
import { attachGesture } from '../../render/attachGesture'
import { attachLongPress } from '../../render/attachLongPress'
import { attachSprite } from '../../render/attachSprite'
import { attachStyle } from '../../render/attachStyle'
import { attachSVG } from '../../render/attachSVG'
import { SYSTEM_ROOT_ID } from '../../SYSTEM_ROOT_ID'
import { webAlert } from './api/alert'
import { webAnimation } from './api/animation'
import { webBluetooth } from './api/bluetooth'
import { webChannel } from './api/channel'
import { webClipboard } from './api/clipboard'
import { webDB } from './api/db'
import { webDevice } from './api/device'
import { webDocument } from './api/document'
import { webFile } from './api/file'
import { webGeolocation } from './api/geolocation'
import { webHTTP } from './api/http'
import { webInput } from './api/input'
import { webLocation } from './api/location'
import { webMedia } from './api/media'
import { webQuerystring } from './api/querystring'
import { webScreen } from './api/screen'
import { webSelection } from './api/selection'
import { webSpeech } from './api/speech'
import { webStorage } from './api/storage'
import { webText } from './api/text'
import { webURI } from './api/uri'
import { webURL } from './api/url'
import { webWorker } from './api/worker'

export default function webBoot(opt: BootOpt = {}): System {
  const root = document.getElementById(SYSTEM_ROOT_ID)

  return _webBoot(window, root, opt)
}

export function _webBoot(
  window: Window,
  root: HTMLElement,
  opt: BootOpt = {}
): System {
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
  const storage = webStorage(window, opt)
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

  const api: API = {
    alert,
    storage,
    selection,
    file,
    animation,
    db,
    device,
    screen,
    bluetooth,
    clipboard,
    location,
    geolocation,
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
  }

  const system = boot(null, api, opt)

  root.appendChild(_root)

  system.root = _root

  attachSprite(system)
  attachStyle(system)
  attachApp(system)
  attachCanvas(system)
  attachSVG(system)
  attachGesture(system)
  attachLongPress(system)
  // attachFocus(system)

  return system
}
