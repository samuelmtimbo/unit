import { Req } from '../req'
import { extractAuthTokenFromReq } from './extractAuthToken'
import { verifyAuthToken } from './verifyAuthToken'

export const authHeaderMid = () => {
  return async function (req: Req, res, next) {
    const authToken = extractAuthTokenFromReq(req)
    try {
      const user = await verifyAuthToken(authToken)

      req.user = user

      next()
    } catch (err) {
      res.status(401).send({})
    }
  }
}
