import { verifyAuthToken } from './verifyAuthToken'
import { Req } from '../req'
import { extractAuthTokenFromReq } from './extractAuthToken'

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
