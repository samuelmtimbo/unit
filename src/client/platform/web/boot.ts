import { boot } from '../../../boot'
import { API, System } from '../../../system'
import { attachApp } from '../../render/attachApp'
import { attachCanvas } from '../../render/attachCanvas'
import { attachFocus } from '../../render/attachFocus'
import { attachGesture } from '../../render/attachGesture'
import { attachLongPress } from '../../render/attachLongPress'
import { attachSprite } from '../../render/attachSprite'
import { attachSVG } from '../../render/attachSVG'
import { SYSTEM_ROOT_ID } from '../../SYSTEM_ROOT_ID'
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
import { webInit } from './api/init'
import { webInput } from './api/input'
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

export default function webBoot(): System {
  const root = document.getElementById(SYSTEM_ROOT_ID)

  return _webBoot(window, root)
}

export function _webBoot(
  window: Window,
  root: HTMLElement,
  prefix: string = ''
): System {
  const http = webHTTP(window, prefix)
  const channel = webChannel(window, prefix)
  const file = webFile(window, prefix)
  const screen = webScreen(window, prefix)
  const device = webDevice(window, prefix)
  const geolocation = webGeolocation(window, prefix)
  const speech = webSpeech(window, prefix)
  const media = webMedia(window, prefix)
  const clipboard = webClipboard(window, prefix)
  const selection = webSelection(window, prefix)
  const storage = webStorage(window, prefix)
  const animation = webAnimation(window, prefix)
  const document = webDocument(window, prefix)
  const querystring = webQuerystring(window, prefix)
  const bluetooth = webBluetooth(window, prefix)
  const text = webText(window, prefix)
  const input = webInput(window, root, prefix)
  const init = webInit(window, prefix)
  const db = webDB(window, prefix)
  const worker = webWorker(window, prefix)
  const url = webURL(window, prefix)
  const uri = webURI(window, prefix)

  const api: API = {
    init,
    storage,
    selection,
    file,
    animation,
    db,
    device,
    screen,
    bluetooth,
    clipboard,
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

  const system = boot({ api })

  system.root = root
  system.mounted = true

  attachSprite(system)
  attachApp(system)
  attachCanvas(system)
  attachSVG(system)
  attachGesture(system)
  attachLongPress(system)
  // attachFocus(system)

  return system
}
