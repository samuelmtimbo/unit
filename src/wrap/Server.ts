import { Server, ServerHandler } from '../API'
import { $ } from '../Class/$'
import { System } from '../system'
import { Callback } from '../types/Callback'
import { SE } from '../types/interface/SE'
import { Unlisten } from '../types/Unlisten'

export function wrapHTTPServer(server: Server, system: System): $ & SE {
  return new (class Server extends $ implements SE {
    __: string[] = ['SE']

    listen(port: number, handler: ServerHandler, onerror: Callback): Unlisten {
      return server.listen(port, handler, onerror)
    }
  })(system)
}
