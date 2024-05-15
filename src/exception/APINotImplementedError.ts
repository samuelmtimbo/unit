export function apiNotSuportedError(name: string): string {
  return `${name} API not implemented`
}

export class APINotSupportedError extends Error {
  constructor(name: string) {
    super(apiNotSuportedError(name))
  }
}
