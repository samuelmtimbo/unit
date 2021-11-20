import * as Joi from 'joi'

export const JOI_GRAPH_SCHEMA = Joi.object({
  // id: Joi.string().uuid(),
  id: Joi.string(),
  data: Joi.object(),
})
