import express from "express";
import { validationResult } from "express-validator";
const app = express()
app.use(express.json());

const validate = (req, res, next) => {
    const errors = validationResult(req) 
    console.log(errors)
    if(errors.isEmpty()){  
        return next()
    }
    // error가 있다면
    return res.status(400).json({message: errors.array()

    })}

module.exports = { validate };