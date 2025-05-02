CREATE TABLE pet_division_1 (
    pet_division_1_code VARCHAR(20) PRIMARY KEY,
    pet_division_1_name VARCHAR(100) NOT NULL
);

drop table pet_division1;
CREATE TABLE pet_division_2 (
    pet_divison_2_code VARCHAR(20) PRIMARY KEY,
    pet_division_2_name VARCHAR(100) NOT NULL,
    division1_code VARCHAR(20),
    CONSTRAINT fk_div1
      FOREIGN KEY (division1_code)
      REFERENCES pet_division_1(pet_division_1_code)
      ON DELETE CASCADE
      ON UPDATE CASCADE
);

CREATE TYPE petsize as ENUM('LARGE', 'MEDIUM', 'SMALL');
CREATE TYPE gender as ENUM('MALE', 'FEMALE', 'OTHER');


CREATE TABLE pet (
    pet_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    pet_name VARCHAR(20) NOT NULL,
    pet_division_2_code VARCHAR(20) NOT NULL,
    pet_birth date,
    pet_gender gender NOT NULL,
    pet_size petsize NOT NULL,
    neuter_yn BOOLEAN, 
    device_uuid VARCHAR(100), 
    dog_slug VARCHAR(100) UNIQUE,
    CONSTRAINT fk_pet_div2
      FOREIGN KEY (pet_division_2_code)
      REFERENCES pet_division_2(pet_division_2_code)
      ON DELETE CASCADE
      ON UPDATE CASCADE,
    CONSTRAINT fk_user_id
      FOREIGN KEY (user_id)
      REFERENCES users(user_id)
      ON DELETE CASCADE
      ON UPDATE CASCADE
);

INSERT INTO pet_division_1 (pet_division_1_code, pet_division_1_name, pet_division_1_remark) 
VALUES 
  ('A001', '강아지', '강아지입니다.'),
  ('A002', '고양이', '고양이입니다.');


INSERT INTO pet_division_1 (pet_division_1_code, pet_division_1_name, createdAt, updatedAt)
VALUES ('A001', '강아지', "강아지입니다.");

ALTER TABLE public.pet_division_1 
ALTER COLUMN createdAt SET DEFAULT NOW(),
ALTER COLUMN updatedAt SET DEFAULT NOW();


-- 강아지 소분류 품종 21개 입력
INSERT INTO pet_division_2 (division1_code, pet_division_2_code, pet_division_2_name) VALUES
('A001', 'A001001', '푸들'),
('A001', 'A001002', '포메라니안'),
('A001', 'A001003', '말티즈'),
('A001', 'A001004', '시추'),
('A001', 'A001005', '요크셔테리어'),
('A001', 'A001006', '골든리트리버'),
('A001', 'A001007', '래브라도리트리버'),
('A001', 'A001008', '비글'),
('A001', 'A001009', '보더콜리'),
('A001', 'A001010', '불독'),
('A001', 'A001011', '치와와'),
('A001', 'A001012', '코커스패니얼'),
('A001', 'A001013', '닥스훈트'),
('A001', 'A001014', '셰퍼드'),
('A001', 'A001015', '도베르만'),
('A001', 'A001016', '사모예드'),
('A001', 'A001017', '웰시코기'),
('A001', 'A001018', '아프간하운드'),
('A001', 'A001019', '달마시안'),
('A001', 'A001020', '그레이하운드'),
('A001', 'A001021', '진돗개');



INSERT INTO pet_division_2 (division1_code, pet_division_2_code, pet_division_2_name) VALUES
('A002', 'A002001', '코리안숏헤어'),
('A002', 'A002002', '러시안블루'),
('A002', 'A002003', '샴'),
('A002', 'A002004', '스코티시폴드'),
('A002', 'A002005', '브리티시숏헤어'),
('A002', 'A002006', '뱅갈'),
('A002', 'A002007', '메인쿤'),
('A002', 'A002008', '터키시앙고라'),
('A002', 'A002009', '노르웨이숲'),
('A002', 'A002010', '페르시안'),
('A002', 'A002011', '아메리칸쇼트헤어'),
('A002', 'A002012', '랙돌'),
('A002', 'A002013', '버만'),
('A002', 'A002014', '싱가푸라'),
('A002', 'A002015', '소말리'),
('A002', 'A002016', '스핑크스'),
('A002', 'A002017', '아비시니안'),
('A002', 'A002018', '히말라얀'),
('A002', 'A002019', '셀커크렉스'),
('A002', 'A002020', '오리엔탈숏헤어');
