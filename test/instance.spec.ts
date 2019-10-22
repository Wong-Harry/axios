import axios, { AxiosRequestConfig, AxiosResponse } from '../src/index'
import { getAjaxRequest } from './helper'

describe('instance', () => {
  beforeEach(() => {
    jasmine.Ajax.install()
  })

  afterEach(() => {
    jasmine.Ajax.uninstall()
  })

  test('shoule make a http request without verb helper', () => {
    const instance = axios.create()

    instance('/foo')

    return getAjaxRequest().then(request => {
      expect(request.url).toBe('/foo')
    })
  })

  test('shoule make a http request', () => {
    const instance = axios.create()

    instance.get('/foo')

    return getAjaxRequest().then(request => {
      expect(request.url).toBe('/foo')
      expect(request.method).toBe('GET')
    })
  })

  test('shoule make a post request', () => {
    const instance = axios.create()

    instance.post('/foo')

    return getAjaxRequest().then(request => {
      expect(request.method).toBe('POST')
    })
  })

  test('shoule make a put request', () => {
    const instance = axios.create()

    instance.put('/foo')

    return getAjaxRequest().then(request => {
      expect(request.method).toBe('PUT')
    })
  })
  test('shoule make a patch request', () => {
    const instance = axios.create()

    instance.patch('/foo')

    return getAjaxRequest().then(request => {
      expect(request.method).toBe('PATCH')
    })
  })

  test('shoule make a options request', () => {
    const instance = axios.create()

    instance.options('/foo')

    return getAjaxRequest().then(request => {
      expect(request.method).toBe('OPTIONS')
    })
  })

  test('shoule make a delete request', () => {
    const instance = axios.create()

    instance.delete('/foo')

    return getAjaxRequest().then(request => {
      expect(request.method).toBe('DELETE')
    })
  })

  test('shoule make a head request', () => {
    const instance = axios.create()

    instance.head('/foo')

    return getAjaxRequest().then(request => {
      expect(request.method).toBe('HEAD')
    })
  })

  test('shoule use instance pptions', () => {
    const instance = axios.create({ timeout: 1000 })

    instance.get('/foo')

    return getAjaxRequest().then(request => {
      expect(request.timeout).toBe(1000)
    })
  })

  test('should have defaults.headers', () => {
    const instance = axios.create({ baseURL: 'https://api.example.com' })
    expect(typeof instance.defaults.headers).toBe('object')
    expect(typeof instance.defaults.headers.common).toBe('object')
  })

  test('should have interceptors onthe instance', done => {
    axios.interceptors.request.use(config => {
      config.timeout = 2000
      return config
    })

    const instance = axios.create()
    instance.interceptors.request.use(config => {
      config.withCredentials = true
      return config
    })

    let response: AxiosResponse
    // tslint:disable-next-line: no-floating-promises
    instance.get('/foo').then(res => {
      response = res
    })

    // tslint:disable-next-line: no-floating-promises
    getAjaxRequest().then(request => {
      request.respondWith({
        status: 200
      })

      setTimeout(() => {
        expect(response.config.timeout).toEqual(0)
        expect(response.config.withCredentials).toEqual(true)
        done()
      }, 100);
    })


  })

  test('should get the computed uri', () => {
    const fakeConfig: AxiosRequestConfig = {
      baseURL: 'https://www.baidu.com',
      url: '/user/12345',
      params: {
        idClient: 1,
        idTest: 2,
        testString: 'thisIsATest'
      }
    }
    expect(axios.getUri(fakeConfig)).toBe('https://www.baidu.com/user/12345?idClient=1&idTest=2&testString=thisIsATest')
  })
})
