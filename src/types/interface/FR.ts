export interface FR {
  readAsDataUrl(file: File | Blob): Promise<string>
  readAsText(file: File | Blob): Promise<string>
}
