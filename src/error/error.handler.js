import { CustomError } from './custom.error.js';

function createErrorClass(name, defaultMessage, statusCode) {
    return class extends CustomError {
    constructor(message = defaultMessage) {
        super(message, statusCode);
        this.name = name;
    }
    };
}

// auth, user error 
export const NoTokenError = createErrorClass('NoTokenError', '요청에 액세스 토큰이 존재하지 않습니다.', 401);
export const UserNotFoundError = createErrorClass('UserNotFoundError', '해당 사용자가 존재하지 않습니다', 404);
export const UnAuthorizedError = createErrorClass('UnAuthorizedError', '블랙리스트에 등록된 토큰(사용자)입니다', 403);
export const PasswordMisMatch = createErrorClass('PasswordMisMatch', '비밀번호가 일치하지 않습니다', 401);
export const AlreadyRegisterdError = createErrorClass('AlreadyRegisteredError', '이미 등록되어있는 이메일입니다', 409);

// dog Error 
export const NoDogError = createErrorClass('NoDogError', '강아지 정보가 존재하지 않습니다.', 404);

//food
export const NoFoodError = createErrorClass('NoFoodError', '사료 정보가 조회되지 않습니다', 404);
export const BadFoodRequest = createErrorClass("BadFoodRequest", "잘못된 요청입니다.", 400);
// image upload
export const NoFileDetectedError = createErrorClass('NoFileDetectedError', '이미지 파일이 업로드되지 않았습니다.', 400); 

// poo
export const BadRequestPooCode = createErrorClass('BadRequestError', '잘못된 상태코드입니다.', 400);


