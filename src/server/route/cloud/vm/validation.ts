import Joi = require('joi')

export const JOI_VM_SCHEMA = Joi.object({
  id: Joi.string().uuid(),
  data: Joi.object(),
})
