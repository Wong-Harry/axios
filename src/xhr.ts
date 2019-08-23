import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from './types'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {

  return new Promise((resolve) => {

    const { data = null, url, method = 'get', headers, responseType } = config
    console.log('headers', headers);

    const request = new XMLHttpRequest()

    if (responseType) {
      request.responseType = responseType
    }
    // 设置请求方式
    request.open(method.toUpperCase(), url, true)
    //
    request.onreadystatechange = function handleLoad() {
      if (request.readyState !== 4) {
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
      resolve(response)
    }
    // 设置请求头的类型
    Object.keys(headers).forEach((name: any) => {
      if (data === null && name.toLowerCase() === 'content-type') {
        delete headers[name]
      } else {
        request.setRequestHeader(name, headers[name])
      }
    });
    console.log(data);
    // 发送请求
    request.send(data)
  })
}
