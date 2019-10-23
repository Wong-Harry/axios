/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var AxiosError = /** @class */ (function (_super) {
    __extends(AxiosError, _super);
    function AxiosError(message, config, code, request, response) {
        var _this = _super.call(this, message) || this;
        _this.congif = config;
        _this.code = code;
        _this.request = request;
        _this.response = response;
        _this.isAxiosError = true;
        Object.setPrototypeOf(_this, AxiosError.prototype);
        return _this;
    }
    return AxiosError;
}(Error));
function CreateError(message, config, code, request, response) {
    var error = new AxiosError(message, config, code, request, response);
    return error;
}

var toString = Object.prototype.toString;
function isDate(val) {
    return toString.call(val) === '[object Date]';
}
// export function isObject(val: any): val is Object {
//   return val !== null && typeof val === 'object'
// }
function isPlainObject(val) {
    return toString.call(val) === '[object Object]';
}
function extend(to, from) {
    for (var key in from) {
        to[key] = from[key];
    }
    return to;
}
function isURLSearchParams(val) {
    return typeof val !== 'undefined' && val instanceof URLSearchParams;
}
function deepMerge() {
    var objs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        objs[_i] = arguments[_i];
    }
    var result = Object.create(null);
    objs.forEach(function (obj) {
        if (obj) {
            Object.keys(obj).forEach(function (key) {
                var val = obj[key];
                if (isPlainObject(val)) {
                    if (isPlainObject(result[key])) {
                        result[key] = deepMerge(result[key], val);
                    }
                    else {
                        result[key] = deepMerge(val);
                    }
                }
                else {
                    result[key] = val;
                }
            });
        }
    });
    return result;
}
function isFormData(val) {
    return typeof val !== 'undefined' && val instanceof FormData;
}

function encode(val) {
    return encodeURIComponent(val)
        .replace(/%40/g, '@')
        .replace(/%3A/gi, ':')
        .replace(/%24/g, '$')
        .replace(/%2C/gi, ',')
        .replace(/%20/g, '+')
        .replace(/%5B/gi, '[')
        .replace(/%5D/gi, ']');
}
function buildURL(url, params, paramsSerializer) {
    if (!params) {
        return url;
    }
    var serializedParams;
    if (paramsSerializer) {
        serializedParams = paramsSerializer(params);
    }
    else if (isURLSearchParams(params)) {
        serializedParams = params.toString();
    }
    else {
        var parts_1 = [];
        // 用作拼接请求,params对象可能为空,数组,对象,特殊字符,date类型
        Object.keys(params).forEach(function (keys) {
            var val = params[keys];
            // 判断params的值是否为空
            if (val === null || typeof val === 'undefined') {
                return;
            }
            // 判断params是否为数组
            var values;
            if (Array.isArray(val)) {
                // 如果是数组
                values = val;
                keys += '[]';
            }
            else {
                values = [val];
            }
            values.forEach(function (val) {
                if (isDate(val)) {
                    val = val.toISOString();
                }
                else if (isPlainObject(val)) {
                    val = JSON.stringify(val);
                }
                parts_1.push(encode(keys) + "=" + encode(val));
            });
        });
        serializedParams = parts_1.join('&');
    }
    if (serializedParams) {
        var markIndex = url.indexOf('#');
        if (markIndex !== -1) {
            url = url.slice(0, markIndex);
        }
        url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
    }
    return url;
}
function isURLSameOrigin(requestURL) {
    var parsedOrigin = resolveURL(requestURL);
    return (parsedOrigin.protocol === currentOrigin.protocol && parsedOrigin.host === currentOrigin.host);
}
var urlParsingNode = document.createElement('a');
var currentOrigin = resolveURL(window.location.href);
function resolveURL(url) {
    urlParsingNode.setAttribute('href', url);
    var protocol = urlParsingNode.protocol, host = urlParsingNode.host;
    return { protocol: protocol, host: host };
}
function isAbsoluteURL(url) {
    return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
}
function combineURL(baseURL, relativeURL) {
    return relativeURL ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '') : baseURL;
}

var cookie = {
    read: function (name) {
        var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
        return match ? decodeURIComponent(match[3]) : null;
    }
};

function normalizeHeaderName(headers, normalizedName) {
    if (!headers) {
        return;
    }
    Object.keys(headers).forEach(function (name) {
        if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
            headers[normalizedName] = headers[name];
            delete headers[name];
        }
    });
}
function processHeaders(headers, data) {
    normalizeHeaderName(headers, 'Content-Type');
    if (isPlainObject(data)) {
        if (headers && !headers['Content-Type']) {
            headers['Content-Type'] = 'application/json;charset=UTF-8';
        }
    }
    return headers;
}
function parseHeaders(headers) {
    var parsed = Object.create(null);
    if (!headers) {
        return parsed;
    }
    headers.split('\r\n').forEach(function (line) {
        var _a = line.split(':'), key = _a[0], vals = _a.slice(1);
        key = key.trim().toLowerCase();
        if (!key) {
            return;
        }
        var val = vals.join(':').trim();
        parsed[key] = val;
    });
    return parsed;
}
function flattenHeaders(headers, method) {
    if (!headers) {
        return headers;
    }
    headers = deepMerge(headers.common, headers[method], headers);
    var methodToDelete = ['delete', 'get', 'head', 'options', 'post', 'put', 'patch', 'common'];
    methodToDelete.forEach(function (method) {
        delete headers[method];
    });
    return headers;
}

function xhr(config) {
    return new Promise(function (resolve, reject) {
        var _a = config.data, data = _a === void 0 ? null : _a, url = config.url, method = config.method, _b = config.headers, headers = _b === void 0 ? {} : _b, responseType = config.responseType, timeout = config.timeout, cancelToken = config.cancelToken, withCredentials = config.withCredentials, xsrfCookieName = config.xsrfCookieName, xsrfHeaderName = config.xsrfHeaderName, onDownloadProgress = config.onDownloadProgress, onUploadProgress = config.onUploadProgress, auth = config.auth, validateStatus = config.validateStatus;
        var request = new XMLHttpRequest();
        request.open(method.toUpperCase(), url, true);
        configureRequest();
        addEvebts();
        processHeaders$$1();
        processCancel();
        request.send(data);
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
        function addEvebts() {
            request.onreadystatechange = function handleLoad() {
                if (request.readyState !== 4) {
                    return;
                }
                if (request.status === 0) {
                    return;
                }
                var responseHeaders = parseHeaders(request.getAllResponseHeaders());
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
            request.onerror = function handleError() {
                reject(CreateError('Network Error', config, null, request));
            };
            request.ontimeout = function handleTimeOut() {
                reject(CreateError("TimeOut of " + timeout + " Error", config, 'ECONNABORTED', request));
            };
            if (onDownloadProgress) {
                request.onprogress = onDownloadProgress;
            }
            if (onUploadProgress) {
                request.upload.onprogress = onUploadProgress;
            }
        }
        function processHeaders$$1() {
            if (isFormData(data)) {
                delete headers['Content-Type'];
            }
            if ((withCredentials || isURLSameOrigin(url)) && xsrfCookieName) {
                var xsrfValue = cookie.read(xsrfCookieName);
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
        function processCancel() {
            if (cancelToken) {
                cancelToken.promise.then(function (reason) {
                    request.abort();
                    reject(reason);
                });
            }
        }
        function handleResoinse(response) {
            if (!validateStatus || validateStatus(response.status)) {
                resolve(response);
            }
            else {
                reject(CreateError("Request failed with status code " + response.status, config, null, request, response));
            }
        }
    });
}

function transform(data, headers, fns) {
    if (!fns) {
        return data;
    }
    if (!Array.isArray(fns)) {
        fns = [fns];
    }
    fns.forEach(function (fn) {
        data = fn(data, headers);
    });
    return data;
}

function dispatchRequest(config) {
    throwIfCancellationRequested(config);
    processConfig(config);
    return xhr(config).then(function (res) {
        return tansformResponseData(res);
    }, function (e) {
        if (e && e.response) {
            e.response = tansformResponseData(e.response);
        }
        return Promise.reject(e);
    });
}
function processConfig(config) {
    config.url = transformUrl(config);
    config.data = transform(config.data, config.headers, config.transformRequest);
    config.headers = flattenHeaders(config.headers, config.method);
}
function transformUrl(config) {
    var url = config.url, params = config.params, paramSerializer = config.paramSerializer, baseURL = config.baseURL;
    if (baseURL && !isAbsoluteURL(url)) {
        url = combineURL(baseURL, url);
    }
    return buildURL(url, params, paramSerializer);
}
function throwIfCancellationRequested(config) {
    if (config.cancelToken) {
        config.cancelToken.throwIfRequested();
    }
}
function tansformResponseData(res) {
    res.data = transform(res.data, res.headers, res.config.transformResponse);
    return res;
}

var InterceptorManager = /** @class */ (function () {
    function InterceptorManager() {
        this.interceptors = [];
    }
    InterceptorManager.prototype.use = function (resolved, rejected) {
        this.interceptors.push({
            resolved: resolved,
            rejected: rejected
        });
        return this.interceptors.length - 1;
    };
    InterceptorManager.prototype.forEach = function (fn) {
        this.interceptors.forEach(function (interceptor) {
            if (interceptor !== null) {
                fn(interceptor);
            }
        });
    };
    InterceptorManager.prototype.eject = function (id) {
        if (this.interceptors[id]) {
            this.interceptors[id] = null;
        }
    };
    return InterceptorManager;
}());

var strats = Object.create(null);
function defaultStrat(val1, val2) {
    return typeof val2 !== 'undefined' ? val2 : val1;
}
function fromVal2Start(val1, val2) {
    if (typeof val2 !== 'undefined') {
        return val2;
    }
}
function deepMergeStrat(val1, val2) {
    if (isPlainObject(val2)) {
        return deepMerge(val1, val2);
    }
    else if (typeof val2 !== 'undefined') {
        return val2;
    }
    else if (isPlainObject(val1)) {
        return deepMerge(val1);
    }
    else {
        return val1;
    }
}
var startKeysFromVal2 = ['url', 'params', 'data'];
startKeysFromVal2.forEach(function (key) {
    strats[key] = fromVal2Start;
});
var startKeysdeepMerge = ['headers', 'auth'];
startKeysdeepMerge.forEach(function (key) {
    strats[key] = deepMergeStrat;
});
function mergeConfig(config1, config2) {
    if (!config2) {
        config2 = {};
    }
    var config = Object.create(null);
    for (var key in config2) {
        mergeField(key);
    }
    for (var key in config1) {
        if (!config2[key]) {
            mergeField(key);
        }
    }
    function mergeField(key) {
        var strat = strats[key] || defaultStrat;
        config[key] = strat(config1[key], config2[key]);
    }
    return config;
}

var Axios = /** @class */ (function () {
    function Axios(initConfig) {
        this.defaults = initConfig;
        this.interceptors = {
            request: new InterceptorManager(),
            response: new InterceptorManager()
        };
    }
    Axios.prototype.request = function (url, config) {
        if (typeof url === 'string') {
            if (!config) {
                config = {};
            }
            config.url = url;
        }
        else {
            config = url;
        }
        config = mergeConfig(this.defaults, config);
        config.method = config.method.toLowerCase();
        var chain = [{
                resolved: dispatchRequest,
                rejected: undefined
            }];
        this.interceptors.request.forEach(function (interceptor) {
            chain.unshift(interceptor);
        });
        this.interceptors.response.forEach(function (interceptor) {
            chain.push(interceptor);
        });
        var promis = Promise.resolve(config);
        while (chain.length) {
            var _a = chain.shift(), resolved = _a.resolved, rejected = _a.rejected;
            promis = promis.then(resolved, rejected);
        }
        return promis;
    };
    Axios.prototype.get = function (url, config) {
        return this._requestMethodWithoutData('get', url, config);
    };
    Axios.prototype.delete = function (url, config) {
        return this._requestMethodWithoutData('delete', url, config);
    };
    Axios.prototype.head = function (url, config) {
        return this._requestMethodWithoutData('head', url, config);
    };
    Axios.prototype.options = function (url, config) {
        return this._requestMethodWithoutData('options', url, config);
    };
    Axios.prototype.post = function (url, data, config) {
        return this._requestMethodWithtData('post', url, data, config);
    };
    Axios.prototype.put = function (url, data, config) {
        return this._requestMethodWithtData('put', url, data, config);
    };
    Axios.prototype.getUri = function (config) {
        config = mergeConfig(this.defaults, config);
        return transformUrl(config);
    };
    Axios.prototype.patch = function (url, data, config) {
        return this._requestMethodWithtData('patch', url, data, config);
    };
    Axios.prototype._requestMethodWithoutData = function (method, url, config) {
        return this.request(Object.assign(config || {}, {
            method: method,
            url: url
        }));
    };
    Axios.prototype._requestMethodWithtData = function (method, url, data, config) {
        return this.request(Object.assign(config || {}, {
            method: method,
            url: url,
            data: data
        }));
    };
    return Axios;
}());

function transformReqest(data) {
    if (isPlainObject(data)) {
        return JSON.stringify(data);
    }
    return data;
}
function transformResponse(data) {
    if (typeof data === 'string') {
        try {
            data = JSON.parse(data);
        }
        catch (error) {
            // do nothin
        }
    }
    return data;
}

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
            processHeaders(headers, data);
            return transformReqest(data);
        }
    ],
    transformResponse: [
        function (data) {
            return transformResponse(data);
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

var Cancel = /** @class */ (function () {
    function Cancel(message) {
        this.message = message;
    }
    return Cancel;
}());
function isCancel(value) {
    return value instanceof Cancel;
}

var CancelToken = /** @class */ (function () {
    function CancelToken(executor) {
        var _this = this;
        var resolvePromise;
        this.promise = new Promise(function (resolve) {
            resolvePromise = resolve;
        });
        executor(function (message) {
            if (_this.reason) {
                return;
            }
            _this.reason = new Cancel(message);
            resolvePromise(_this.reason);
        });
    }
    CancelToken.prototype.throwIfRequested = function () {
        if (this.reason) {
            throw this.reason;
        }
    };
    CancelToken.source = function () {
        var cancel;
        var token = new CancelToken(function (c) {
            cancel = c;
        });
        return {
            cancel: cancel,
            token: token
        };
    };
    return CancelToken;
}());

function createInstance(config) {
    var context = new Axios(config);
    var instance = Axios.prototype.request.bind(context);
    extend(instance, context);
    return instance;
}
var axios = createInstance(defaults);
axios.CancelToken = CancelToken;
axios.Cancel = Cancel;
axios.isCancel = isCancel;
axios.all = function all(promises) {
    return Promise.all(promises);
};
axios.spread = function spread(callback) {
    return function wrap(arr) {
        return callback.apply(null, arr);
    };
};
axios.create = function create(config) {
    return createInstance(mergeConfig(defaults, config));
};
axios.Axios = Axios;

export default axios;
//# sourceMappingURL=ts-axios.es5.js.map
