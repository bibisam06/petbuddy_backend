FROM node:23

# 앱 디렉토리 생성
WORKDIR /usr/src/app

# 패키지 파일 복사
COPY package*.json ./

# 의존성 설치
RUN npm ci

# 앱 소스 코드 복사 (npm run build가 제대로 실행되도록 소스 코드 복사)
COPY . .

# 빌드 실행
RUN npm run build

# 앱이 실행될 포트
EXPOSE 3000

# 앱 실행
CMD ["npm", "start"]
