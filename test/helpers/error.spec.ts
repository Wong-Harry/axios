import { CreateError } from '../../src/helper/error'
import { AxiosRequestConfig, AxiosResponse } from '../../src/types'

describe(('helper:error'), () => {
  test(('should create an Error with message, config, code, request, response and isAxiosError'), () => {
    const request = new XMLHttpRequest()
    const config: AxiosRequestConfig = { method: 'post' }
    const response: AxiosResponse = {
      data: { foo: 'bar' },
      status: 200,
      statusText: 'ok',
      headers: null,
      config,
      request
    }
    const error = CreateError('boom', config, 'SMOETHING', request, response)
    expect(error instanceof Error).toBeTruthy()
    expect(error.message).toBe('boom')
    expect(error.congif).toBe(config)
    expect(error.code).toBe('SMOETHING')
    expect(error.request).toBe(request)
    expect(error.response).toBe(response)
    expect(error.isAxiosError).toBeTruthy()
  })
})
