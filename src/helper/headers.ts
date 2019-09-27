import { isPlainObject, deepMerge } from './util'
import { Method } from '../types'

function normalizeHeaderName(headers: any, normalizedName: string): void {
  if (!headers) {
    return
  }
  Object.keys(headers).forEach(name => {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = headers[name]
      delete headers[name]
    }
  })
}

export function processHeaders(headers: any, data: any): any {
  normalizeHeaderName(headers, 'Content-Type')

  if (isPlainObject(data)) {
    if (headers && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json;charset=UTF-8'
    }
  }
  return headers
}


export default function flattenHeaders(headers: any, method: Method): any {
  if (!headers) {
    return headers
  }

  headers = deepMerge(headers.common, headers[method], headers)

  const methodToDelete = ['delete', 'get', 'hed', 'options', 'post', 'put', 'patch', 'common']
  methodToDelete.forEach(method => {
    console.log(method);

    delete headers[method]
  })

  return headers
}
