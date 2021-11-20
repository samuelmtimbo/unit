import * as Joi from 'joi'

export const JOI_FILE_SCHEMA = Joi.object({
  id: Joi.string().uuid(),
  data: Joi.object({
    name: Joi.string().uuid(),
    parentId: Joi.string().uuid(),
  }),
})
