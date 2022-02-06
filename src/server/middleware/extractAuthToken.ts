import { Req } from '../req'

export const extractAuthTokenFromReq = (req: Req): string | undefined => {
  const { headers } = req
  const header = headers['authorization']
  if (header) {
    const bearer = header.split(' ')
    const authToken = bearer[1]
    return authToken
  } else {
    return undefined
  }
}
