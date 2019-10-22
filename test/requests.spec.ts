import axios, { AxiosError, AxiosResponse } from '../src/index'
import { getAjaxRequest } from './helper'

describe('requests', () => {
  beforeEach(() => {
    jasmine.Ajax.install()
  })

  afterEach(() => {
    jasmine.Ajax.uninstall()
  })

  test('should support array buffer response', done => {
    let response: AxiosResponse

    function str2ab(str: string) {
      const buff = new ArrayBuffer(str.length * 2)
      const view = new Uint16Array(buff)
      for (let i = 0; i < str.length; i++) {
        view[i] = str.charCodeAt(i)
      }
      return buff
    }

    // tslint:disable-next-line: no-floating-promises
    axios('/foo', {
      responseType: 'arraybuffer'
    }).then(data => {
      response = data
    })
    // tslint:disable-next-line: no-floating-promises
    getAjaxRequest().then(request => {
      request.respondWith({
        status: 200,
        // @ts-ignore
        response: str2ab('Hello world')
      })

      setTimeout(() => {
        expect(response.data.byteLength).toBe(22)
        done()
      }, 100)
    })
  })

  test('should treat single string arg as url', () => {
    axios('/foo')
    return getAjaxRequest().then(request => {
      expect(request.url).toBe('/foo')
      expect(request.method).toBe('GET')
    })
  })

  test('should treat method value as lowercase string', done => {
    // tslint:disable-next-line: no-floating-promises
    axios({
      url: '/foo',
      method: 'POST'
    }).then(response => {
      expect(response.config.method).toBe('post')
      done()
    })
    // tslint:disable-next-line: no-floating-promises
    getAjaxRequest().then(req => {
      req.respondWith({
        status: 200
      })
    })
  })

  test('shoule reject on network errors', done => {
    const resolveSpy = jest.fn((res: AxiosResponse) => {
      return res
    })

    const rejectSpy = jest.fn((e: AxiosError) => {
      return e
    })

    jasmine.Ajax.uninstall()

    // tslint:disable-next-line: no-floating-promises
    axios('/foo').then(resolveSpy).catch(rejectSpy).then(next)

    function next(reason: AxiosResponse | AxiosError) {
      expect(resolveSpy).not.toHaveBeenCalled()
      expect(rejectSpy).toHaveBeenCalled()
      expect(reason instanceof Error).toBeTruthy()
      expect((reason as AxiosError).message).toBe('Network Error')
      expect(reason.request).toEqual(expect.any(XMLHttpRequest))

      jasmine.Ajax.install()

      done()
    }
  })

  test('should reject when request timeout', done => {
    let err: AxiosError
    axios('/foo', {
      timeout: 2000,
      method: 'post'
    }).catch(e => {
      err = e
    })

    // tslint:disable-next-line: no-floating-promises
    getAjaxRequest().then(request => {
      // @ts-ignore
      request.eventBus.trigger('timeout')
    })

    setTimeout(() => {
      expect(err instanceof Error).toBeTruthy()
      expect(err.message).toBe('TimeOut of 2000 Error')
      done()
    }, 100);
  })

  test('should reject when validateStatus returns false', done => {
    const resolveSpy = jest.fn((res: AxiosResponse) => {
      return res
    })

    const rejectSpy = jest.fn((e: AxiosError) => {
      return e
    })

    // tslint:disable-next-line: no-floating-promises
    axios('/foo', {
      validateStatus(status) {
        return status !== 500
      }
    }).then(resolveSpy).catch(rejectSpy).then(next)

    // tslint:disable-next-line: no-floating-promises
    getAjaxRequest().then(req => {
      req.respondWith({
        status: 500
      })
    })

    function next(reason: AxiosError | AxiosResponse) {
      expect(resolveSpy).not.toHaveBeenCalled()
      expect(rejectSpy).toHaveBeenCalled()
      expect(reason instanceof Error).toBeTruthy()
      expect((reason as AxiosError).message).toBe('Request failed with status code 500')
      expect((reason as AxiosError).response!.status).toBe(500)
      done()
    }
  })

  test('should resolve when validateStatus returns true', done => {
    const resolveSpy = jest.fn((res: AxiosResponse) => {
      return res
    })

    const rejectSpy = jest.fn((e: AxiosError) => {
      return e
    })

    // tslint:disable-next-line: no-floating-promises
    axios('/foo', {
      validateStatus(status) {
        return status === 500
      }
    }).then(resolveSpy).catch(rejectSpy).then(next)

    // tslint:disable-next-line: no-floating-promises
    getAjaxRequest().then(req => {
      req.respondWith({
        status: 500
      })
    })

    function next(res: AxiosError | AxiosResponse) {
      expect(resolveSpy).toHaveBeenCalled()
      expect(rejectSpy).not.toHaveBeenCalled()
      expect(res.config.url).toBe('/foo')
      done()
    }
  })

  test('should return JSON when resolved', done => {
    let response: AxiosResponse

    // tslint:disable-next-line: no-floating-promises
    axios('/api/account/signup', {
      auth: {
        username: '',
        password: ''
      },
      method: 'post',
      headers: {
        Accept: 'application/json'
      }
    }).then(res => {
      response = res
    })

    // tslint:disable-next-line: no-floating-promises
    getAjaxRequest().then(req => {
      req.respondWith({
        status: 200,
        statusText: 'ok',
        responseText: '{"a":1}'
      })

      setTimeout(() => {
        expect(response.data).toEqual({ a: 1 })
        done()
      }, 100);
    })
  })

  test('should return JSON when rejecting', done => {
    let response: AxiosResponse

    // tslint:disable-next-line: no-floating-promises
    axios('/api/account/signup', {
      auth: {
        username: '',
        password: ''
      },
      method: 'post',
      headers: {
        Accept: 'application/json'
      }
    }).catch(e => {
      response = e.response
    })

    // tslint:disable-next-line: no-floating-promises
    getAjaxRequest().then(request => {
      request.respondWith({
        status: 400,
        statusText: 'Bad Request',
        responseText: '{"error": "BAD USERNAME", "code": 1}'
      })

      setTimeout(() => {
        expect(typeof response.data).toBe('object')
        expect(response.data.error).toBe('BAD USERNAME')
        expect(response.data.code).toBe(1)
        done()
      }, 100);
    })
  })

  test('should supply correct response', done => {
    let response: AxiosResponse
    // tslint:disable-next-line: no-floating-promises
    axios.post('/foo').then(res => {
      response = res
    })
    // tslint:disable-next-line: no-floating-promises
    getAjaxRequest().then(request => {
      request.respondWith({
        status: 200,
        statusText: 'ok',
        responseText: '{"foo":"bar"}',
        responseHeaders: {
          "Content-Type": "application/json"
        }
      })

      setTimeout(() => {
        expect(response.data.foo).toBe('bar')
        expect(response.status).toBe(200)
        expect(response.statusText).toBe('ok')
        expect(response.headers['content-type']).toBe('application/json')
        done()
      }, 100);
    })
  })

  test('should allow overriding content-Type header case-insensitive', () => {
    let response: AxiosResponse

    // tslint:disable-next-line: no-floating-promises
    axios.post('/foo', { porp: 'value' }, {
      headers: {
        'content-type': 'application/json'
      }
    }).then(res => {
      response = res
    })

    return getAjaxRequest().then(request => {
      expect(request.requestHeaders['Content-Type']).toBe('application/json')
    })


  })

})
