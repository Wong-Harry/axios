import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import { CreateError } from '../helper/error'
import { isURLSameOrigin } from '../helper/url'
import cookie from '../helper/cookie'
import { isFormData } from '../helper/util'
import { parseHeaders } from '../helper/headers'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {

  return new Promise((resolve, reject) => {

    const {
      data = null,
      url,
      method = 'get',
      headers,
      responseType,
      timeout,
      cancelToken,
      withCredentials,
      xsrfCookieName,
      xsrfHeaderName,
      onDownloadProgress,
      onUploadProgress,
      auth,
      validateStatus } = config
    // 创建个request实例
    const request = new XMLHttpRequest()
    // request初始化
    request.open(method.toUpperCase(), url!, true)
    // 配置request配置项
    configureRequest()
    // 添加request事件处理函数
    addEvebts()
    // 设置request请求头
    processHeaders()
    // 设置request取消方法
    processCancel()

    // 发送请求
    request.send(data)
    // 设置超时，返回body类型，xsrf证件（跨域东西）
    function configureRequest(): void {
      if (timeout) {
        request.timeout = timeout
      }
      if (responseType) {
        request.responseType = responseType
      }
      if (withCredentials) {
        request.withCredentials = true
      }
    }
    // 添加request事件处理函数
    function addEvebts(): void {
      request.onreadystatechange = function handleLoad() {
        if (request.readyState !== 4) {
          return
        }
        if (request.status === 0) {
          return
        }
        const responseHeaders = parseHeaders(request.getAllResponseHeaders())
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
      if (onDownloadProgress) {
        request.onprogress = onDownloadProgress
      }

      if (onUploadProgress) {
        request.upload.onprogress = onUploadProgress
      }

    }
    // 设置请求头的类型
    function processHeaders(): void {
      if (isFormData(data)) {
        delete headers['Content-Type']
      }
      if ((withCredentials || isURLSameOrigin(url!)) && xsrfCookieName) {
        const xsrfValue = cookie.read(xsrfCookieName)
        if (xsrfValue) {
          headers[xsrfHeaderName!] = xsrfValue
        }
      }
      if (auth) {
        headers['Authorization'] = 'Basic ' + btoa(auth.username + ':' + auth.password)
      }
      Object.keys(headers).forEach(name => {
        if (data === null && name.toLowerCase() === 'content-type') {
          delete headers[name]
        } else {
          request.setRequestHeader(name, headers[name])
        }
      })
    }

    // 设置取消请求方法
    function processCancel(): void {
      if (cancelToken) {
        cancelToken.promise.then(reason => {
          request.abort()
          reject(reason)
        }).catch(e => { console.log(e) })
      }
    }
    // 请求拦截器，成功才有resolve
    function handleResoinse(response: AxiosResponse): void {
      // if (response.status >= 200 && response.status < 300) {
      //   resolve(response)
      // } else {
      //   reject(CreateError(`Request failed with status code ${response.status}`, config, null, request, response))
      // }
      if (!validateStatus || validateStatus(response.status)) {
        resolve(response)
      } else {
        reject(
          CreateError(
            `Request failed with status code ${response.status}`, config, null, request, response)
        )
      }
    }

  })


}
