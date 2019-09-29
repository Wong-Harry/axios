import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import { CreateError } from '../helper/error'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {

  return new Promise((resolve, reject) => {

    const { data = null, url, method = 'get', headers, responseType, timeout, cancelToken } = config

    const request = new XMLHttpRequest()

    if (timeout) {
      request.timeout = timeout
    }

    if (responseType) {
      request.responseType = responseType
    }

    if (cancelToken) {
      cancelToken.promise.then(reason => {
        request.abort()
        reject(reason)
      }).catch(e => { console.log(e) })
    }

    // 设置请求方式
    request.open(method.toUpperCase(), url!, true)
    //
    request.onreadystatechange = function handleLoad() {
      if (request.readyState !== 4) {
        return
      }
      if (request.status === 0) {
        return
      }
      const responseHeaders = request.getAllResponseHeaders()
      const responseData = responseType !== 'text' ? request.response : request.responseText
      const response: AxiosResponse = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      }
      handleResoinse(response)
    }
    // 设置请求错误（网络不通的清空）
    request.onerror = function handleError() {
      // reject(new Error('Network Error'))
      reject(CreateError('Network Error', config, null, request))
    }

    request.ontimeout = function handleTimeOut() {
      // reject(new Error(`TimeOut of ${timeout} Error`))
      reject(CreateError(`TimeOut of ${timeout} Error`, config, 'ECONNABORTED', request))
    }

    // 设置请求头的类型
    Object.keys(headers).forEach(name => {
      if (data === null && name.toLowerCase() === 'content-type') {
        delete headers[name]
      } else {
        request.setRequestHeader(name, headers[name])
      }
    })

    // 发送请求
    request.send(data)

    function handleResoinse(response: AxiosResponse): void {
      if (response.status >= 200 && response.status < 300) {
        resolve(response)
      } else {
        // reject(new Error(`Request failed with status code ${response.status}`))
        reject(CreateError(`Request failed with status code ${response.status}`, config, null, request, response))
      }
    }

  })
}
