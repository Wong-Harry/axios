import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import xhr from './xhr'
import { buildURL, isAbsoluteURL, combineURL } from '../helper/url';
import { flattenHeaders } from '../helper/headers';
import transform from '../transform';

export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  throwIfCancellationRequested(config)
  processConfig(config)
  return xhr(config).then((res) => {
    return tansformResponseData(res)
  }, e => {
    if (e && e.response) {
      e.response = tansformResponseData(e.response)
    }
    return Promise.reject(e)
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
function tansformResponseData(res: AxiosResponse): AxiosResponse {
  res.data = transform(res.data, res.headers, res.config.transformResponse)
  return res
}
