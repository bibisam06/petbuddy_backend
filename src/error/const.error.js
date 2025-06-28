import { CustomError } from './custom.error.js';

export class UserNotFoundError extends CustomError {
    constructor(message = "해당 사용자가 존재하지 않습니다") {
    super(message, 404);
    }
};

export class UnAuthorizedError extends CustomError {
    constructor(message = "  "){
        super(message, 403);
    }
};