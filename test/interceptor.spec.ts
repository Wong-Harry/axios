import axios, { AxiosRequestConfig, AxiosResponse } from '../src/index'
import { getAjaxRequest } from './helper'

describe('interceptors', () => {
  beforeEach(() => {
    jasmine.Ajax.install()
  })

  afterEach(() => {
    jasmine.Ajax.uninstall()
  })

  test('should add a request interceptor', () => {
    const instance = axios.create()
    instance.interceptors.request.use((config: AxiosRequestConfig) => {
      config.headers.test = 'added by interceptor'
      return config
    })

    instance('/foo')
    return getAjaxRequest().then(request => {
      expect(request.requestHeaders.test).toBe('added by interceptor')
    })
  })

  test('should add a request interceptor that returns a new config object', () => {
    const instance = axios.create()
    instance.interceptors.request.use(() => {
      return {
        url: '/bar',
        method: 'post'
      }
    })

    instance('/foo')

    return getAjaxRequest().then(request => {
      expect(request.method).toBe('POST')
      expect(request.url).toBe('/bar')
    })
  })

  test('should add a request interceptor that rerurns a promise', done => {
    const instance = axios.create()

    instance.interceptors.request.use((config: AxiosRequestConfig) => {
      return new Promise(resolve => {
        setTimeout(() => {
          config.headers.async = 'promise'
          resolve(config)
        }, 10);
      })
    })

    instance('/foo')

    setTimeout(() => {
      // tslint:disable-next-line: no-floating-promises
      getAjaxRequest().then(requeset => {
        expect(requeset.requestHeaders.async).toBe('promise')
        done()
      })
    }, 100);
  })

  test('should add mutiple request interceptors', () => {
    const instance = axios.create()

    instance.interceptors.request.use(config => {
      config.headers.test1 = '1'
      return config
    })
    instance.interceptors.request.use(config => {
      config.headers.test2 = '2'
      return config
    })
    instance.interceptors.request.use(config => {
      config.headers.test3 = '3'
      return config
    })

    instance('/foo')

    return getAjaxRequest().then(request => {
      expect(request.requestHeaders.test1).toBe('1')
      expect(request.requestHeaders.test2).toBe('2')
      expect(request.requestHeaders.test3).toBe('3')
    })
  })

  test('should add a respinse interceptor', done => {
    let response: AxiosResponse
    const instance = axios.create()

    instance.interceptors.response.use(data => {
      data.data = data.data + ' - modified by interceptor'
      return data
    })

    // tslint:disable-next-line: no-floating-promises
    instance('/foo').then(data => {
      response = data
    })

    // tslint:disable-next-line: no-floating-promises
    getAjaxRequest().then(request => {
      request.respondWith({
        status: 200,
        responseText: 'ok'
      })

      setTimeout(() => {
        expect(response.data).toBe('ok - modified by interceptor')
        done()
      }, 100);
    })
  })

  test('should add a response interceptor that returns a new data object', done => {
    let response: AxiosResponse
    const instance = axios.create()

    instance.interceptors.response.use(() => {
      return {
        data: 'stuff',
        headers: null,
        status: 500,
        statusText: 'ERR',
        request: null,
        config: {}
      }
    })
    // tslint:disable-next-line: no-floating-promises
    instance('/foo').then(res => {
      response = res
    })
    // tslint:disable-next-line: no-floating-promises
    getAjaxRequest().then(request => {
      request.respondWith({
        status: 200,
        responseText: 'ok'
      })

      setTimeout(() => {
        expect(response.data).toBe('stuff')
        expect(response.headers).toBeNull()
        expect(response.status).toBe(500)
        expect(response.statusText).toBe('ERR')
        expect(response.request).toBeNull()
        expect(response.config).toEqual({})
        done()
      }, 100);
    })
  })

  test('should add a response interceptor that returrns a promise ', done => {
    let response: AxiosResponse
    const instance = axios.create()

    instance.interceptors.response.use(data => {
      return new Promise((resolve) => {
        setTimeout(() => {
          data.data = 'you have been promised!'
          resolve(data)
        }, 10);
      })
    })
    // tslint:disable-next-line: no-floating-promises
    instance('/foo').then(res => {
      response = res
    })
    // tslint:disable-next-line: no-floating-promises
    getAjaxRequest().then(request => {
      request.respondWith({
        status: 200,
        responseText: 'ok'
      })
      setTimeout(() => {
        expect(response.data).toBe('you have been promised!')
        done()
      }, 100);
    })
  })
  test('should add multiple response interceptors', done => {
    let response: AxiosResponse
    const instance = axios.create()

    instance.interceptors.response.use(data => {
      data.data = data.data + '1'
      return data
    })
    instance.interceptors.response.use(data => {
      data.data = data.data + '2'
      return data
    })
    instance.interceptors.response.use(data => {
      data.data = data.data + '3'
      return data
    })

    // tslint:disable-next-line: no-floating-promises
    instance('/foo').then(data => {
      response = data
    })

    // tslint:disable-next-line: no-floating-promises
    getAjaxRequest().then(request => {
      request.respondWith({
        status: 200,
        responseText: 'OK'
      })

      setTimeout(() => {
        expect(response.data).toBe('OK123')
        done()
      }, 100)
    })
  })

  test('should allow removing interceptors', done => {
    let response: AxiosResponse
    let intercept
    const instance = axios.create()

    instance.interceptors.response.use(data => {
      data.data = data.data + '1'
      return data
    })
    intercept = instance.interceptors.response.use(data => {
      data.data = data.data + '2'
      return data
    })
    instance.interceptors.response.use(data => {
      data.data = data.data + '3'
      return data
    })

    instance.interceptors.response.eject(intercept)
    instance.interceptors.response.eject(5)

    // tslint:disable-next-line: no-floating-promises
    instance('/foo').then(data => {
      response = data
    })

    // tslint:disable-next-line: no-floating-promises
    getAjaxRequest().then(request => {
      request.respondWith({
        status: 200,
        responseText: 'OK'
      })

      setTimeout(() => {
        expect(response.data).toBe('OK13')
        done()
      }, 100)
    })
  })
})
