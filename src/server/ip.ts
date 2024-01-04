import * as os from 'os'

export const LOCAL_IP_ADDRESS = Object.values(os.networkInterfaces()).reduce(
  (r, list) =>
    r.concat(
      list.reduce(
        (rr, i) =>
          rr.concat((i.family === 'IPv4' && !i.internal && i.address) || []),
        []
      )
    ),
  []
)[0]
