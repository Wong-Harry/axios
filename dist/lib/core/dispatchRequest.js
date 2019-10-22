"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var xhr_1 = require("./xhr");
var url_1 = require("../helper/url");
var headers_1 = require("../helper/headers");
var transform_1 = require("../transform");
function dispatchRequest(config) {
    // 开始处理请求
    throwIfCancellationRequested(config);
    processConfig(config);
    // 请求处理完成，发送请求
    return xhr_1.default(config).then(function (res) {
        return tansformResponseData(res);
    }, function (e) {
        if (e && e.response) {
            e.response = tansformResponseData(e.response);
        }
        return Promise.reject(e);
    });
}
exports.default = dispatchRequest;
function processConfig(config) {
    config.url = transformUrl(config);
    config.data = transform_1.default(config.data, config.headers, config.transformRequest);
    config.headers = headers_1.flattenHeaders(config.headers, config.method);
}
function transformUrl(config) {
    var url = config.url, params = config.params, paramSerializer = config.paramSerializer, baseURL = config.baseURL;
    if (baseURL && !url_1.isAbsoluteURL(url)) {
        url = url_1.combineURL(baseURL, url);
    }
    return url_1.buildURL(url, params, paramSerializer);
}
exports.transformUrl = transformUrl;
function throwIfCancellationRequested(config) {
    if (config.cancelToken) {
        config.cancelToken.throwIfRequested();
    }
}
// function transformRequestData(config: AxiosRequestConfig): any {
//   return transformReqest(config.data)
// }
// function transformHeaders(config: AxiosRequestConfig): any {
//   const { headers = {}, data } = config
//   return processHeaders(headers, data)
// }
function tansformResponseData(res) {
    res.data = transform_1.default(res.data, res.headers, res.config.transformResponse);
    return res;
}
// export default axios
//# sourceMappingURL=dispatchRequest.js.map