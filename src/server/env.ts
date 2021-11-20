export const env = process.env.NODE_ENV || 'development'

export const DEV = env === 'development'
export const PROD = env === 'production'
