"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("./util");
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
    else if (util_1.isURLSearchParams(params)) {
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
                if (util_1.isDate(val)) {
                    val = val.toISOString();
                }
                else if (util_1.isPlainObject(val)) {
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
exports.buildURL = buildURL;
function isURLSameOrigin(requestURL) {
    var parsedOrigin = resolveURL(requestURL);
    return (parsedOrigin.protocol === currentOrigin.protocol && parsedOrigin.host === currentOrigin.host);
}
exports.isURLSameOrigin = isURLSameOrigin;
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
exports.isAbsoluteURL = isAbsoluteURL;
function combineURL(baseURL, relativeURL) {
    return relativeURL ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '') : baseURL;
}
exports.combineURL = combineURL;
//# sourceMappingURL=url.js.map