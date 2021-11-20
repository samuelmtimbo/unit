const env = (globalThis.env && globalThis.env.NODE_ENV) || 'development'

export const dev = env === 'development'

export const prod = !dev

export default env
