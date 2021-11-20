export const noopMid = () => {
  return function (req, res, next) {
    next()
  }
}
