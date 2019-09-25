import { AxiosPromise, AxiosRequestConfig } from "..";
import dispatchRequest from "./dispatchRequest";
import { Method } from "../types";

export default class Axios {

  request(config: AxiosRequestConfig): AxiosPromise {
    return dispatchRequest(config)
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
