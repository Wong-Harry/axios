"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("./util");
function transformReqest(data) {
    if (util_1.isPlainObject(data)) {
        return JSON.stringify(data);
    }
    return data;
}
exports.transformReqest = transformReqest;
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
exports.transformResponse = transformResponse;
//# sourceMappingURL=data.js.map