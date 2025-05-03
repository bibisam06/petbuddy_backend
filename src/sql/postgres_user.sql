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




CREATE TABLE food (
    food_id SERIAL PRIMARY KEY,
    food_brand VARCHAR(20),
    food_name VARCHAR(255),
    food_total_amount INT, --kg단위로 
    food_price INTEGER
);


CREATE TABLE food_log (
    food_log_id SERIAL PRIMARY KEY,
    pet_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
	food_id INTEGER NOT NULL,
    food_provide_time JSONB,
    food_remain_amount INTEGER,
    food_score TEXT,
    food_remain_days INTEGER,
    food_close_yn BOOLEAN,
    food_register_amount INTEGER,
    food_register_date TIMESTAMP WITHOUT TIME ZONE,
    food_modify_date TIMESTAMP WITHOUT TIME ZONE,
    food_times INTEGER,
    food_add_yn BOOLEAN,
    food_add_amount INTEGER,
    FOREIGN KEY (pet_id) REFERENCES pet(pet_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (food_id) REFERENCES food(food_id)
);



-- 여기까지 업데이트 되었음 
CREATE TABLE poop_log (
    poop_log_id SERIAL,
    pet_id INT NOT NULL,
    user_id INT NOT NULL,
    poop_date TIMESTAMP,
    poop_score INT,
    poop_moisture INT,
    poop_color INT,
    PRIMARY KEY (poop_log_id, pet_id, user_id),
    FOREIGN KEY (pet_id) REFERENCES 반려동물(pet_id),
    FOREIGN KEY (user_id) REFERENCES 사용자(user_id)
);

CREATE TABLE poop_status (
    feces_status_id SERIAL,
    feces_log_id INT NOT NULL,
    pet_id INT NOT NULL,
    user_id INT NOT NULL,
    feces_status TEXT NOT NULL,
    feces_description TEXT,
    feces_image TEXT,
    PRIMARY KEY (feces_status_id, feces_log_id, pet_id, user_id),
    FOREIGN KEY (feces_log_id) REFERENCES 대변보고(poop_log_id),
    FOREIGN KEY (pet_id) REFERENCES 반려동물(pet_id),
    FOREIGN KEY (user_id) REFERENCES 사용자(user_id)
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
