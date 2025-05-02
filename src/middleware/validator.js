import express from "express";
import { validationResult } from "express-validator";
const app = express()
app.use(express.json());

export const validate = (req, res, next) => {
    const errors = validationResult(req) 
    console.log(errors)
    if(errors.isEmpty()){  
        return next()
    }
    // error가 있다면
    const error = new Error("Token is not found");
    error.status = 400;
    throw error;
};

module.exports = { validate };