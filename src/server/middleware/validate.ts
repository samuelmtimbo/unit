import Joi = require('joi')

export const validateBodyMid = (schema: Joi.AnySchema) => {
  return async function (req, res, next) {
    const { body } = req
    _validate(schema, body, req, res, next)
  }
}

export const validateParamsMid = (schema: Joi.AnySchema) => {
  return async function (req, res, next) {
    const { params } = req
    _validate(schema, params, req, res, next)
  }
}

async function _validate(schema: Joi.AnySchema, data: any, req, res, next) {
  try {
    await schema.validateAsync(data)
  } catch (err) {
    res.status(400).end()
    return
  }
  next()
}
