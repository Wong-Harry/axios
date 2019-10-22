"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var error_1 = require("../helper/error");
var url_1 = require("../helper/url");
var cookie_1 = require("../helper/cookie");
var util_1 = require("../helper/util");
var headers_1 = require("../helper/headers");
function xhr(config) {
    return new Promise(function (resolve, reject) {
        var _a = config.data, data = _a === void 0 ? null : _a, url = config.url, method = config.method, _b = config.headers, headers = _b === void 0 ? {} : _b, responseType = config.responseType, timeout = config.timeout, cancelToken = config.cancelToken, withCredentials = config.withCredentials, xsrfCookieName = config.xsrfCookieName, xsrfHeaderName = config.xsrfHeaderName, onDownloadProgress = config.onDownloadProgress, onUploadProgress = config.onUploadProgress, auth = config.auth, validateStatus = config.validateStatus;
        // 创建个request实例
        var request = new XMLHttpRequest();
        // request初始化
        request.open(method.toUpperCase(), url, true);
        // 配置request配置项
        configureRequest();
        // 添加request事件处理函数
        addEvebts();
        // 设置request请求头
        processHeaders();
        // 设置request取消方法
        processCancel();
        // 发送请求
        request.send(data);
        // 设置超时，返回body类型，xsrf证件（跨域东西）
        function configureRequest() {
            if (timeout) {
                request.timeout = timeout;
            }
            if (responseType) {
                request.responseType = responseType;
            }
            if (withCredentials) {
                request.withCredentials = true;
            }
        }
        // 添加request事件处理函数
        function addEvebts() {
            request.onreadystatechange = function handleLoad() {
                if (request.readyState !== 4) {
                    return;
                }
                if (request.status === 0) {
                    return;
                }
                var responseHeaders = headers_1.parseHeaders(request.getAllResponseHeaders());
                // const responseData = responseType !== 'text' ? request.response : request.responseText
                var responseData = responseType && responseType !== 'text' ? request.response : request.responseText;
                var response = {
                    data: responseData,
                    status: request.status,
                    statusText: request.statusText,
                    headers: responseHeaders,
                    config: config,
                    request: request
                };
                handleResoinse(response);
            };
            // 设置请求错误（网络不通的清空）
            request.onerror = function handleError() {
                // reject(new Error('Network Error'))
                reject(error_1.CreateError('Network Error', config, null, request));
            };
            request.ontimeout = function handleTimeOut() {
                // reject(new Error(`TimeOut of ${timeout} Error`))
                reject(error_1.CreateError("TimeOut of " + timeout + " Error", config, 'ECONNABORTED', request));
            };
            if (onDownloadProgress) {
                request.onprogress = onDownloadProgress;
            }
            if (onUploadProgress) {
                request.upload.onprogress = onUploadProgress;
            }
        }
        // 设置请求头的类型
        function processHeaders() {
            if (util_1.isFormData(data)) {
                delete headers['Content-Type'];
            }
            if ((withCredentials || url_1.isURLSameOrigin(url)) && xsrfCookieName) {
                var xsrfValue = cookie_1.default.read(xsrfCookieName);
                if (xsrfValue) {
                    headers[xsrfHeaderName] = xsrfValue;
                }
            }
            if (auth) {
                headers['Authorization'] = 'Basic ' + btoa(auth.username + ':' + auth.password);
            }
            Object.keys(headers).forEach(function (name) {
                if (data === null && name.toLowerCase() === 'content-type') {
                    delete headers[name];
                }
                else {
                    request.setRequestHeader(name, headers[name]);
                }
            });
        }
        // 设置取消请求方法
        function processCancel() {
            if (cancelToken) {
                // tslint:disable-next-line: no-floating-promises
                cancelToken.promise.then(function (reason) {
                    request.abort();
                    reject(reason);
                });
            }
        }
        // 请求拦截器，成功才有resolve
        function handleResoinse(response) {
            // if (response.status >= 200 && response.status < 300) {
            //   resolve(response)
            // } else {
            //   reject(CreateError(`Request failed with status code ${response.status}`, config, null, request, response))
            // }
            if (!validateStatus || validateStatus(response.status)) {
                resolve(response);
            }
            else {
                reject(error_1.CreateError("Request failed with status code " + response.status, config, null, request, response));
            }
        }
    });
}
exports.default = xhr;
//# sourceMappingURL=xhr.js.map