export const logUrlMid = async function (req, res, next) {
  const { url } = req
  console.log(url)
  next()
}
