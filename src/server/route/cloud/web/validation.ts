import Joi = require('joi')

export const JOI_WEB_SCHEMA = Joi.object({
  id: Joi.string().uuid(),
  data: Joi.object(),
})
