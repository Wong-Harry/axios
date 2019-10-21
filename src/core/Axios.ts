import dispatchRequest, { transformUrl } from "./dispatchRequest";
import { AxiosResponse, Method, ResolvedFn, AxiosRequestConfig, AxiosPromise, RejectedFn } from "../types";
import InterceptorManager from "./interceptorManager";
import mergeConfig from "./mergeConfig";

interface Interceptors {
  request: InterceptorManager<AxiosRequestConfig>
  response: InterceptorManager<AxiosResponse>
}

interface PromiseChain<T> {
  resolved: ResolvedFn<T> | ((config: AxiosRequestConfig) => AxiosPromise),
  rejected?: RejectedFn

}

export default class Axios {
  defaults: AxiosRequestConfig
  interceptors: Interceptors

  constructor(initConfig: AxiosRequestConfig) {
    this.defaults = initConfig
    this.interceptors = {
      request: new InterceptorManager<AxiosRequestConfig>(),
      response: new InterceptorManager<AxiosResponse>()
    }
  }

  request(url: any, config?: any): AxiosPromise {
    if (typeof url === 'string') {
      if (!config) {
        config = {}
      }
      config.url = url
    } else {
      config = url
    }

    config = mergeConfig(this.defaults, config)
    config.method = config.method.toLowerCase()

    const chain: PromiseChain<any>[] = [{
      resolved: dispatchRequest,
      rejected: undefined
    }]

    this.interceptors.request.forEach(interceptor => {
      chain.unshift(interceptor)
    })
    this.interceptors.response.forEach(interceptor => {
      chain.push(interceptor)
    })

    let promis = Promise.resolve(config)

    while (chain.length) {
      const { resolved, rejected } = chain.shift()!
      promis = promis.then(resolved, rejected)
    }

    return promis
  }

  get(url: string, config: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('get', url, config)
  }

  delete(url: string, config: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('delete', url, config)
  }

  head(url: string, config: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('head', url, config)
  }

  options(url: string, config: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('options', url, config)
  }

  post(url: string, data: any, config: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithtData('post', url, data, config)
  }

  put(url: string, data: any, config: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithtData('put', url, data, config)
  }

  getUri(config: AxiosRequestConfig): string {
    config = mergeConfig(this.defaults, config)
    return transformUrl(config)
  }

  patch(url: string, data: any, config: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithtData('patch', url, data, config)
  }

  _requestMethodWithoutData(method: Method, url: string, config?: AxiosRequestConfig) {
    return this.request(Object.assign(config || {}, {
      method,
      url
    }))
  }

  _requestMethodWithtData(method: Method, url: string, data?: any, config?: AxiosRequestConfig) {
    return this.request(Object.assign(config || {}, {
      method,
      url,
      data
    }))
  }
}
