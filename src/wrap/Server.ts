import { Server, ServerHandler } from '../API'
import { $ } from '../Class/$'
import { System } from '../system'
import { Dict } from '../types/Dict'
import { SE } from '../types/interface/SE'
import { Unlisten } from '../types/Unlisten'

export function wrapHTTPServer(server: Server, system: System): $ & SE {
  return new (class Server extends $ implements SE {
    __: string[] = ['SE']

    listen(port: number, handler: ServerHandler, servers: Dict<any>): Unlisten {
      return server.listen(port, handler, servers)
    }
  })(system)
}
