import e from 'express';
import { CustomError } from './custom.error.js';


// Authorization Error Error list 
// user-not-found
export class UserNotFoundError extends CustomError {
    constructor(message = "해당 사용자가 존재하지 않습니다") {
    super(message, 404);
    }
};
// black-listed
export class UnAuthorizedError extends CustomError {
    constructor(message = "블랙리스트에 등록된 토큰(사용자)입니다") {
        super(message, 403);
    }
};

//password mismatched
export class PasswordMisMatch extends CustomError{


};