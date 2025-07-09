import { CustomError } from './custom.error.js';

function createErrorClass(name, defaultMessage, statusCode) {
    return class extends CustomError {
    constructor(message = defaultMessage) {
        super(message, statusCode);
        this.name = name;
    }
    };
}
//common, server Error
export const InternalServerError = createErrorClass('InternalServerError', '서버 내부 오류입니다.', 500);
export const NotImplementedError = createErrorClass('NotImplementedError', '아직 구현되지 않은 기능입니다.', 501);

//validation
export const ValidationError = createErrorClass('ValidationError', '입력 값이 유효하지 않습니다.', 400);
export const MissingFieldError = createErrorClass('MissingFieldError', '필수 입력값이 누락되었습니다.', 400);

export const AlreadyExistsError = createErrorClass('AlreadyExistsError', '이미 존재하는 항목입니다.', 409);
export const ConflictStateError = createErrorClass('ConflictStateError', '현재 상태에서는 이 작업을 수행할 수 없습니다.', 409);

export const PetNotOwnedError = createErrorClass('PetNotOwnedError', '해당 강아지에 대한 접근 권한이 없습니다.', 403);
export const FeedNotFoundError = createErrorClass('FeedNotFoundError', '급여 정보가 존재하지 않습니다.', 404);
export const NotificationNotFoundError = createErrorClass('NotificationNotFoundError', '알림 내역이 존재하지 않습니다.', 404);

export const ExternalApiError = createErrorClass('ExternalApiError', '외부 API 호출 중 오류가 발생했습니다.', 502);
export const S3UploadError = createErrorClass('S3UploadError', '이미지 업로드에 실패했습니다.', 500);


// auth, user error 
export const NoTokenError = createErrorClass('NoTokenError', '요청에 액세스 토큰이 존재하지 않습니다.', 401);
export const UserNotFoundError = createErrorClass('UserNotFoundError', '해당 사용자가 존재하지 않습니다', 404);
export const UnAuthorizedError = createErrorClass('UnAuthorizedError', '블랙리스트에 등록된 토큰(사용자)입니다', 403);
export const PasswordMisMatch = createErrorClass('PasswordMisMatch', '비밀번호가 일치하지 않습니다', 401);
export const AlreadyRegisterdError = createErrorClass('AlreadyRegisteredError', '이미 등록되어있는 이메일입니다', 409);

// dog Error 
export const NoDogError = createErrorClass('NoDogError', '강아지 정보가 존재하지 않습니다.', 404);
export const DogRegistrationError = createErrorClass('DogRegistrationError', '강아지는 3마리까지 등록가능합니다', 400);

//food
export const NoFoodError = createErrorClass('NoFoodError', '사료 정보가 조회되지 않습니다', 404);
export const BadFoodRequest = createErrorClass("BadFoodRequest", "잘못된 요청입니다.", 400);
// image upload
export const NoFileDetectedError = createErrorClass('NoFileDetectedError', '이미지 파일이 업로드되지 않았습니다.', 400); 

// poo
export const BadRequestPooCode = createErrorClass('BadRequestError', '잘못된 상태코드입니다.', 400);


// request 
export const DateError = createErrorClass('DateRequestError', '잘못된 형식의 날짜입니다', 400);
export const InvalidRequestError = createErrorClass('InvalidRequestError', '잘못된 요청 형식입니다', 400);