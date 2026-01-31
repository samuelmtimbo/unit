import fs from 'fs'
import path from 'path'

export class FileSystemLocalStorage implements Storage {
  private readonly dir: string

  constructor(directory: string) {
    this.dir = directory

    fs.mkdirSync(this.dir, { recursive: true })
  }

  get length(): number {
    return this.keys().length
  }

  key(index: number): string | null {
    const keys = this.keys()

    return index >= 0 && index < keys.length ? keys[index] : null
  }

  getItem(key: string): string | null {
    const file = this.filePath(key)

    if (!fs.existsSync(file)) {
      return null
    }

    return fs.readFileSync(file, 'utf8')
  }

  setItem(key: string, value: string): void {
    const file = this.filePath(key)

    fs.writeFileSync(file, String(value), 'utf8')
  }

  removeItem(key: string): void {
    const file = this.filePath(key)

    if (fs.existsSync(file)) {
      fs.unlinkSync(file)
    }
  }

  clear(): void {
    for (const key of this.keys()) {
      this.removeItem(key)
    }
  }

  private keys(): string[] {
    const keys = fs
      .readdirSync(this.dir, { withFileTypes: true })
      .filter((d) => d.isFile())
      .map((d) => this.decodeKey(d.name))
      .sort()

    return keys
  }

  private filePath(key: string): string {
    return path.join(this.dir, this.encodeKey(key))
  }

  private encodeKey(key: string): string {
    return encodeURIComponent(key)
  }

  private decodeKey(filename: string): string {
    return decodeURIComponent(filename)
  }
}
