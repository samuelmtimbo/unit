import { _user_auth } from './auth'

export const cookieUserMid = () => {
  return async function (req, res, next) {
    const { cookies } = req

    const { authToken } = cookies

    try {
      const user = await _user_auth(authToken)
      const { userId } = user

      req.userId = userId
      req.user = user

      next()
    } catch (err) {
      next()
    }
  }
}
