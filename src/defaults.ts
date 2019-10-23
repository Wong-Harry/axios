import { AxiosRequestConfig } from "./types";
import { processHeaders } from "./helper/headers";
import { transformReqest, transformResponse } from "./helper/data";

const defaults: AxiosRequestConfig = {
  method: 'get',
  timeout: 0,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  headers: {
    common: {
      Accept: 'application/json, text/plain, */*'
    }
  },
  transformRequest: [
    function (data: any, headers: any): any {
      processHeaders(headers, data)
      return transformReqest(data)
    }
  ],
  transformResponse: [
    function (data: any): any {
      return transformResponse(data)
    }
  ],
  validateStatus(status: number): boolean {
    return status >= 200 && status < 300
  }
}

const methodeNoData = ['delete', 'get', 'head', 'options']
methodeNoData.forEach(method => {
  defaults.headers[method] = {}
})
const methodeWithData = ['post', 'put', 'patch']
methodeWithData.forEach(method => {
  defaults.headers[method] = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})
export default defaults
