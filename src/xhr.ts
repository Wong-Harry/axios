import { AxiosRequestConfig } from './types'

export default function xhr(congif: AxiosRequestConfig): void {
  const { data = null, url, method = 'get' } = congif
  const request = new XMLHttpRequest()
  request.open(method.toUpperCase(), url, true)
  request.send(data)
}
