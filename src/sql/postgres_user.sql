//사용하는 sql구문을 올려둡니당..
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,          -- 사용자 ID (자동 증가)
    user_name VARCHAR(255) NOT NULL,     -- 사용자 이름
    email VARCHAR(255) NOT NULL UNIQUE,   -- 이메일 (고유값)
    phone_number VARCHAR(255),            -- 전화번호 (NULL 허용)
    gender VARCHAR(10) NOT NULL,             -- 성별
    password VARCHAR(255) NOT NULL,       -- 비밀번호
    address TEXT NOT NULL,                 -- 주소 (사전 동의 필요)
    remark TEXT,                           -- 비고 (가입 사유 등, NULL 허용)
    birth VARCHAR(255) NOT NULL,          -- 생년월일
    interest VARCHAR(255),                 -- 관심사 (NULL 허용)
    signin_route VARCHAR(255),             -- 로그인 경로 (NULL 허용)
    signin_route_detail TEXT               -- 로그인 경로 세부사항 (NULL 허용)
);

-- ENUM 타입 정의
CREATE TYPE poop_status AS ENUM ('A', 'B', 'C');
CREATE TYPE poop_total_grade AS ENUM ('1', '2', '3', '4', '5');

-- poop_log 테이블 생성
CREATE TABLE poop_log (
    poop_log_id SERIAL PRIMARY KEY,               -- 단일 기본키
    pet_id INT NOT NULL,
    user_id INT NOT NULL,
    poop_date DATE,
    poop_score_total INT,                         -- 수치형 점수 (0~100 등)
    poop_score_grade poop_total_grade,            -- ENUM 등급 (1~5)
    poop_score_moisture poop_status,
    poop_score_color poop_status,
    poop_score_parasite poop_status,              -- 기생충 여부 (이전: infection)
    poop_url TEXT,                                -- URI 대신 TEXT

    -- 외래키 제약 조건 + 삭제 시 CASCADE
    FOREIGN KEY (pet_id) REFERENCES pet(pet_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
--- here 







CREATE TABLE analysis (
    key_id SERIAL,
    pet_id INT NOT NULL,
    user_id INT NOT NULL,
    score TEXT,
    description TEXT,
    recommend TEXT,
    PRIMARY KEY (key_id, pet_id, user_id),
    FOREIGN KEY (pet_id) REFERENCES 반려동물(pet_id),
    FOREIGN KEY (user_id) REFERENCES 사용자(user_id)
);

CREATE TABLE sleep (
    sleep_id SERIAL PRIMARY KEY,
    pet_id INT NOT NULL,
    user_id INT NOT NULL,
    sleep_date DATE UNIQUE,
    sleep_start TIMESTAMP,
    sleep_end TIMESTAMP,
    sleep_efficiency INT CHECK (sleep_efficiency BETWEEN 0 AND 100),
    sleep_grade TEXT NOT NULL,
    sleep_pattern TEXT,
    FOREIGN KEY (pet_id) REFERENCES 반려동물(pet_id),
    FOREIGN KEY (user_id) REFERENCES 사용자(user_id)
);

CREATE TABLE activity (
    activity_id SERIAL PRIMARY KEY,
    pet_id INT NOT NULL,
    user_id INT NOT NULL,
    activity_date DATE,
    activity_steps INT NOT NULL,
    activity_km TEXT,
    activity_time INT,
    activity_start TIMESTAMP,
    activity_end TIMESTAMP,
    FOREIGN KEY (pet_id) REFERENCES 반려동물(pet_id),
    FOREIGN KEY (user_id) REFERENCES 사용자(user_id)
);
