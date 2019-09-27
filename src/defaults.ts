import { AxiosRequestConfig } from "./types";

const defaults: AxiosRequestConfig = {
  method: 'get',
  timeout: 0,
  headers: {
    common: {
      Accept: 'application/json, text/plain, */*'
    }
  }
}

const methodeNoData = ['delete', 'get', 'heade', 'options']
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
