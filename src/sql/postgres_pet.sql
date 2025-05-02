CREATE TABLE pet_division_1 (  강아지 고양이 
    pet_division_1_code VARCHAR(10) PRIMARY KEY,
    pet_division_1_name VARCHAR(255) NOT NULL 
);

CREATE TABLE pet_division_2 (
    pet_division_2_code SERIAL PRIMARY KEY,
    remark TEXT,
    pet_division_2_name TEXT NOT NULL
);

CREATE TABLE pet (
    pet_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    pet_name TEXT NOT NULL,
    pet_division_1_code INT NOT NULL,
    pet_division_2_code INT NOT NULL,
    pet_birth TEXT,
    pet_gender TEXT NOT NULL,
    pet_size TEXT,
    neuter_yn BOOLEAN, //중성화 여부 
    device_uuid TEXT, //기기 아이디 입니다. 
    dog_slug TEXT, //기기 접근 아이디입니다. 
    FOREIGN KEY (user_id) REFERENCES 사용자(user_id),
    FOREIGN KEY (pet_division_1_code) REFERENCES 반려동물대분류(pet_division_1_code),
    FOREIGN KEY (pet_division_2_code) REFERENCES 반려동물중분류(pet_division_2_code)
);



//인서트 
-- 대분류 (강아지, 고양이)
INSERT INTO pet_division_1 (pet_division_1_code) VALUES (DEFAULT); -- 강아지 (A001)
INSERT INTO pet_division_1 (pet_division_1_code) VALUES (DEFAULT); -- 고양이 (A002)

-- 강아지 품종 20개
INSERT INTO pet_division_2 (remark, pet_division_2_name) VALUES
('A001', '푸들'),
('A001', '포메라니안'),
('A001', '말티즈'),
('A001', '시추'),
('A001', '요크셔테리어'),
('A001', '골든리트리버'),
('A001', '래브라도리트리버'),
('A001', '비글'),
('A001', '보더콜리'),
('A001', '불독'),
('A001', '치와와'),
('A001', '코커스패니얼'),
('A001', '닥스훈트'),
('A001', '셰퍼드'),
('A001', '도베르만'),
('A001', '사모예드'),
('A001', '웰시코기'),
('A001', '아프간하운드'),
('A001', '달마시안'),
('A001', '그레이하운드');



-- 고양이 품종 20개
INSERT INTO pet_division_2 (remark, pet_division_2_name) VALUES
('A002', '코리안숏헤어'),
('A002', '러시안블루'),
('A002', '샴'),
('A002', '스코티시폴드'),
('A002', '브리티시숏헤어'),
('A002', '뱅갈'),
('A002', '메인쿤'),
('A002', '터키시앙고라'),
('A002', '노르웨이숲'),
('A002', '페르시안'),
('A002', '아메리칸쇼트헤어'),
('A002', '랙돌'),
('A002', '버만'),
('A002', '싱가푸라'),
('A002', '소말리'),
('A002', '스핑크스'),
('A002', '아비시니안'),
('A002', '히말라얀'),
('A002', '셀커크렉스'),
('A002', '오리엔탈숏헤어');
