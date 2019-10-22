"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dispatchRequest_1 = require("./dispatchRequest");
var interceptorManager_1 = require("./interceptorManager");
var mergeConfig_1 = require("./mergeConfig");
var Axios = /** @class */ (function () {
    function Axios(initConfig) {
        this.defaults = initConfig;
        this.interceptors = {
            request: new interceptorManager_1.default(),
            response: new interceptorManager_1.default()
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
        config = mergeConfig_1.default(this.defaults, config);
        config.method = config.method.toLowerCase();
        var chain = [{
                resolved: dispatchRequest_1.default,
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
        config = mergeConfig_1.default(this.defaults, config);
        return dispatchRequest_1.transformUrl(config);
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
exports.default = Axios;
//# sourceMappingURL=Axios.js.map