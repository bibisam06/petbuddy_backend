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

CREATE TYPE poop_grade AS ENUM('1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13',
'14', '15', '16', '17');
-- poop_log 테이블 생성

drop table poop_log;


CREATE TABLE poop_log (
    poop_log_id SERIAL PRIMARY KEY,               
    pet_id INT NOT NULL,
    user_id INT NOT NULL,
    poop_date DATE,  
    poop_score_total INT,                        
    poop_grade_total poop_grade,   
    poop_grade_moisture poop_status,
    poop_score_moisutre INT,
    poop_grade_color poop_status,
    poop_score_color INT,
    poop_grade_parasite poop_status,            
    poop_score_parasite INT, 
    poop_url TEXT,                                
    FOREIGN KEY (pet_id) REFERENCES pet(pet_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);


CREATE TABLE activity_log (
    activity_log_id SERIAL PRIMARY KEY,
    pet_id INTEGER REFERENCES pet(pet_id) ON DELETE CASCADE,
	user_id INTEGER REFERENCES users(user_id) ON delete CASCADE,
    activity_date DATE NOT NULL,
    activity_hourly_steps JSONB NOT NULL, 
    UNIQUE(pet_id, activity_date)
);








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

