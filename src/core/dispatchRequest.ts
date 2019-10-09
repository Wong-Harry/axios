import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import xhr from './xhr'
import { buildURL, isAbsoluteURL, combineURL } from '../helper/url';
import flattenHeaders from '../helper/headers';
import transform from '../transform';

export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  // 开始处理请求
  throwIfCancellationRequested(config)
  processConfig(config)
  // 请求处理完成，发送请求
  return xhr(config).then((res) => {
    return tansformResponseData(res)
  })
}

function processConfig(config: AxiosRequestConfig): void {
  config.url = transformUrl(config)
  config.data = transform(config.data, config.headers, config.transformRequest)

  config.headers = flattenHeaders(config.headers, config.method!)

}

export function transformUrl(config: AxiosRequestConfig): string {
  let { url, params, paramSerializer, baseURL } = config
  if (baseURL && !isAbsoluteURL(url!)) { url = combineURL(baseURL, url) }
  return buildURL(url!, params, paramSerializer)
}

function throwIfCancellationRequested(config: AxiosRequestConfig): void {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested()
  }

}

// function transformRequestData(config: AxiosRequestConfig): any {
//   return transformReqest(config.data)
// }

// function transformHeaders(config: AxiosRequestConfig): any {
//   const { headers = {}, data } = config
//   return processHeaders(headers, data)

// }

function tansformResponseData(res: AxiosResponse): AxiosResponse {
  res.data = transform(res.data, res.headers, res.config.transformResponse)
  return res
}

// export default axios
