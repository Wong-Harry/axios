const JasmineCore = require('jasmine-core')

global.getJasmineRequireObj = function () {
  return JasmineCore
}

require('jasmine-ajax')
