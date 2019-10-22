"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var headers_1 = require("./helper/headers");
var data_1 = require("./helper/data");
var defaults = {
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
        function (data, headers) {
            headers_1.processHeaders(headers, data);
            return data_1.transformReqest(data);
        }
    ],
    transformResponse: [
        function (data) {
            return data_1.transformResponse(data);
        }
    ],
    validateStatus: function (status) {
        return status >= 200 && status < 300;
    }
};
var methodeNoData = ['delete', 'get', 'head', 'options'];
methodeNoData.forEach(function (method) {
    defaults.headers[method] = {};
});
var methodeWithData = ['post', 'put', 'patch'];
methodeWithData.forEach(function (method) {
    defaults.headers[method] = {
        'Content-Type': 'application/x-www-form-urlencoded'
    };
});
exports.default = defaults;
//# sourceMappingURL=defaults.js.map