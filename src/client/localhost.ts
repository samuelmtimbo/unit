export const isLocalHost = (hostname: string) => {
  return hostname === 'localhost' || hostname.endsWith('.localhost')
}
