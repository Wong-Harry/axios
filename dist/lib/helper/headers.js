"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("./util");
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
    if (util_1.isPlainObject(data)) {
        if (headers && !headers['Content-Type']) {
            headers['Content-Type'] = 'application/json;charset=UTF-8';
        }
    }
    return headers;
}
exports.processHeaders = processHeaders;
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
exports.parseHeaders = parseHeaders;
function flattenHeaders(headers, method) {
    if (!headers) {
        return headers;
    }
    headers = util_1.deepMerge(headers.common, headers[method], headers);
    var methodToDelete = ['delete', 'get', 'head', 'options', 'post', 'put', 'patch', 'common'];
    methodToDelete.forEach(function (method) {
        delete headers[method];
    });
    return headers;
}
exports.flattenHeaders = flattenHeaders;
//# sourceMappingURL=headers.js.map