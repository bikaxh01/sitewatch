"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STATUS = void 0;
exports.sendResponse = sendResponse;
var STATUS;
(function (STATUS) {
    STATUS[STATUS["SUCCESS"] = 200] = "SUCCESS";
    STATUS[STATUS["NOT_FOUND"] = 404] = "NOT_FOUND";
    STATUS[STATUS["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    STATUS[STATUS["NOT_ALLOWED"] = 405] = "NOT_ALLOWED";
    STATUS[STATUS["CREATED"] = 201] = "CREATED";
    STATUS[STATUS["INTERNAL_ERROR"] = 500] = "INTERNAL_ERROR";
    STATUS[STATUS["INVALID_DATA"] = 400] = "INVALID_DATA";
    STATUS[STATUS["ALREADY_EXISTS"] = 409] = "ALREADY_EXISTS";
})(STATUS || (exports.STATUS = STATUS = {}));
function sendResponse(res, status, message, data, error) {
    const success = status >= 399 ? false : true;
    res.status(status).json({
        success: success,
        message: message,
        data: success ? data : undefined,
        error: success ? undefined : error,
    });
}
