export function apiNotSupportedError(name: string): string {
  return `${name} API not implemented`
}

export class APINotSupportedError extends Error {
  constructor(name: string) {
    super(apiNotSupportedError(name))
  }
}
