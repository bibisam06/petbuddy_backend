import { CustomError } from './custom.error.js';

function createErrorClass(name, defaultMessage, statusCode) {
    return class extends CustomError {
    constructor(message = defaultMessage) {
        super(message, statusCode);
        this.name = name;
    }
    };
}

export const UserNotFoundError = createErrorClass('UserNotFoundError', '해당 사용자가 존재하지 않습니다', 404);
export const UnAuthorizedError = createErrorClass('UnAuthorizedError', '블랙리스트에 등록된 토큰(사용자)입니다', 403);
export const PasswordMisMatch = createErrorClass('PasswordMisMatch', '비밀번호가 일치하지 않습니다', 401);
