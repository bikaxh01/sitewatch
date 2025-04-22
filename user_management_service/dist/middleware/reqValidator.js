"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reqValidator = reqValidator;
const response_1 = require("../utils/response");
function reqValidator(schema) {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            const errors = result.error.errors.map((err) => ({
                field: err.path.join("."),
                message: err.message,
            }));
            return (0, response_1.sendResponse)(res, response_1.STATUS.INVALID_DATA, `${errors[0].field + " " + errors[0].message}`, [], "Invalid request data");
        }
        next();
    };
}
