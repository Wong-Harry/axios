import { isDate, isPlainObject } from './util'
function encode(val: string): string {
  return encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}

export function buildURL(url: string, params: any) {
  if (!params) { return url }

  const parts: string[] = []
  // 用作拼接请求,params对象可能为空,数组,对象,特殊字符,date类型
  Object.keys(params).forEach((keys) => {
    console.log('keys', keys);
    let val: any = params[keys]
    // 判断params的值是否为空
    if (val === null || typeof val === 'undefined') {
      return
    }
    // 判断params是否为数组
    let values: string[]
    if (Array.isArray(val)) {
      values = val
      keys += '[]'
    } else {
      values = [val]
    }
    // 群不判断玩后开始插入到数组当中
    console.log('values', values);

    values.forEach((val) => {
      if (isDate(val)) {
        val = val.toISOString()
      } else if (isPlainObject(val)) {
        val = JSON.stringify(val)
      }
      parts.push(`${encode(keys)}=${encode(val)}`)
    })
  })

  let serializedParams = parts.join('&')
  if (serializedParams) {
    const markIndex = url.indexOf('#')
    if (markIndex !== -1) {
      url = url.slice(0, markIndex)
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams
  }
  return url
}
