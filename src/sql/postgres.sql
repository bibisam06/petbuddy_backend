//사용하는 sql구문을 올려둡니당..
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,          -- 사용자 ID (자동 증가)
    user_name VARCHAR(255) NOT NULL,     -- 사용자 이름
    email VARCHAR(255) NOT NULL UNIQUE,   -- 이메일 (고유값)
    phone_number VARCHAR(255),            -- 전화번호 (NULL 허용)
    sex VARCHAR(10) NOT NULL,             -- 성별
    password VARCHAR(255) NOT NULL,       -- 비밀번호
    address TEXT NOT NULL,                 -- 주소 (사전 동의 필요)
    remark TEXT,                           -- 비고 (가입 사유 등, NULL 허용)
    birth VARCHAR(255) NOT NULL,          -- 생년월일
    interest VARCHAR(255),                 -- 관심사 (NULL 허용)
    signin_route VARCHAR(255),             -- 로그인 경로 (NULL 허용)
    signin_route_detail TEXT               -- 로그인 경로 세부사항 (NULL 허용)
);
