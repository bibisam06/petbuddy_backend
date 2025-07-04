// middlewares/validate.js
import { validationResult } from "express-validator";
import { CustomError } from "../error/custom.error.js";

const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
    return next();
    }

    const formatted = errors.array().map(err => ({
    field: err.path,
    message: err.msg,
    }));

    return next(new CustomError("Validation Failed", 400, formatted));
};

export default validate;