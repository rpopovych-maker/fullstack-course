export interface SignatureService {
  create(values: string[]): string
  verify(signature: string, values: string[]): boolean
}
