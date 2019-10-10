import { transformReqest, transformResponse } from '../../src/helper/data'

describe('transformReqest', () => {
  test('should transform request data to string if data is a PlainObject', () => {
    const a = { a: 1 }
    expect(transformReqest(a)).toBe('{"a":1}')
  })

  test('should transform request data to string if data is a PlainObject', () => {
    const a = new URLSearchParams('a=b')
    expect(transformReqest(a)).toBe(a)
  })
})

describe('transformResponse', () => {
  test('should transform response data to Object if data is a JSON string', () => {
    const a = '{ "a": 2 }'
    expect(transformResponse(a)).toEqual({ a: 2 })
  })

  test('should do nothing if data is a string but not a JSON string', () => {
    const a = '{ a: 2 }'
    expect(transformResponse(a)).toBe('{ a: 2 }')
  })

  test('should do nothing if data is not a string', () => {
    const a = { a: 2 }
    expect(transformResponse(a)).toBe(a)
  })

  test('should do nothing if data is number', () => {
    const a: number = 12
    expect(transformResponse(a)).toBe(12)
  })
})
