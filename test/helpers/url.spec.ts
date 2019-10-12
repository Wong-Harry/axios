import { buildURL, isAbsoluteURL, combineURL, isURLSameOrigin } from '../../src/helper/url'

describe('helper:url', () => {
  describe('buildURL', () => {
    test('should support null params', () => {
      expect(buildURL('/foo')).toBe('/foo')
    })

    test('should support params', () => {
      expect(buildURL('/foo', { foo: 'bar' })).toBe('/foo?foo=bar')
    })

    test('should ignore if some param value is null', () => {
      expect(buildURL('/foo', {
        foo: 'bar',
        bar: null
      })).toBe('/foo?foo=bar')
    })

    test('should ignore if the only param value is null', () => {
      expect(buildURL('/foo', {
        bar: null
      })).toBe('/foo')
    })

    test('should support object params', () => {
      expect(buildURL('/foo', {
        foo: {
          bar: 'hhh'
        }
      })).toBe(`/foo?foo=${encodeURI('{"bar":"hhh"}')}`)
    })

    test('should support array params', () => {
      expect(buildURL('/foo', {
        foo: [1, 2]
      })).toBe('/foo?foo[]=1&foo[]=2')
    })

    test('should support date params', () => {
      const data = new Date()
      expect(buildURL('/foo', { data })).toBe(`/foo?data=${data.toISOString()}`)
    })

    test('shoule support char params', () => {
      expect(buildURL('/foo', {
        foo: '@:$, '
      })).toBe('/foo?foo=@:$,+')
    })

    test('showle support existing params', () => {
      expect(buildURL('/foo?bar=bar', {
        baz: 'baz'
      })).toBe('/foo?bar=bar&baz=baz')
    })

    test('should correct discard url hans masrk', () => {
      expect(buildURL('/foo?foo=bar#hash', {
        query: 'baz'
      })).toBe(`/foo?foo=bar&query=baz`)
    })

    test('should use serializer if provided', () => {
      const serializer = jest.fn(() => {
        return 'foo=bar'
      })
      const params = { foo: 'bar' }
      expect(buildURL('/foo', params, serializer)).toBe(`/foo?foo=bar`)
      expect(serializer).toHaveBeenCalled()
      expect(serializer).toHaveBeenCalledWith(params)
    })

    test('should support URLsearchParams', () => {
      expect(buildURL('/foo', new URLSearchParams('bar=baz'))).toBe('/foo?bar=baz')
    })

  })

  describe('isAbsoluteURL', () => {
    test('should return true if URL begins with valid scheme name', () => {
      expect(isAbsoluteURL('https://api.github.com/users')).toBeTruthy()
      expect(isAbsoluteURL('custom-scheme-v1.0://example.com/')).toBeTruthy()
      expect(isAbsoluteURL('HTTP://example.com/')).toBeTruthy()
    })

    test('should return false if URL begins with invalid scheme name', () => {
      expect(isAbsoluteURL('123://example.com/')).toBeFalsy()
      expect(isAbsoluteURL('!valid://example.com/')).toBeFalsy()
    })

    test('should return true if URL is protocol-relative', () => {
      expect(isAbsoluteURL('//example.com/')).toBeTruthy()
    })

    test('should return false if URL is relative', () => {
      expect(isAbsoluteURL('/foo')).toBeFalsy()
      expect(isAbsoluteURL('foo')).toBeFalsy()
    })
  })

  describe('combineURL', () => {
    test('should combine URL', () => {
      expect(combineURL('https://api.github.com', '/users')).toBe('https://api.github.com/users')
    })

    test('should insert missing slash', () => {
      expect(combineURL('https://api.github.com', 'users')).toBe('https://api.github.com/users')
    })

    test('should remove duplicate slashes', () => {
      expect(combineURL('https://api.github.com/', '/users')).toBe('https://api.github.com/users')
    })

    test('should not insert slash when relative url missing/empty', () => {
      expect(combineURL('https://api.github.com/users', '')).toBe('https://api.github.com/users')
    })
    test('should allow a single slash for relative url', () => {
      expect(combineURL('https://api.github.com/users', '/')).toBe('https://api.github.com/users/')
    })
  })

  describe('', () => {
    test('should detect same origin', () => {
      expect(isURLSameOrigin(window.location.href)).toBeTruthy()
    })
    test('should detect different origin', () => {
      expect(isURLSameOrigin('https://api.github.com/axios/axiso')).toBeFalsy()
    })
  })

})
