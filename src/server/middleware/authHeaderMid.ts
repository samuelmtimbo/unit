import { _user_auth } from './auth'
import { extractAuthTokenFromReqAuthorizationHeader } from './extractAuthToken'

export const authHeaderMid = () => {
  return async function (req, res, next) {
    const authToken = extractAuthTokenFromReqAuthorizationHeader(req)
    try {
      const { userId, username } = await _user_auth(authToken)
      req.userId = userId
      req.username = username
      next()
    } catch (err) {
      res.status(401).send({})
    }
  }
}
