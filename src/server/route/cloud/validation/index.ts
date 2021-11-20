import * as Joi from 'joi'

export const JOI_GET_SCHEMA = Joi.object({
  // id: Joi.string().uuid(),
  id: Joi.string(),
})

export const JOI_RESOURCE_SCHEMA = Joi.object({
  // id: Joi.string().uuid(),
  id: Joi.string(),
})

export const JOI_SHARED_ENTRY_SCHEMA = Joi.object({
  // id: Joi.string().uuid(),
  id: Joi.string(),
  data: {
    userId: Joi.string().uuid(),
    entryId: Joi.string().uuid(),
  },
})
