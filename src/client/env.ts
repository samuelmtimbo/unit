const env = (globalThis.env && globalThis.env.NODE_ENV) || 'development'

export const dev = env === 'development'

export default env
