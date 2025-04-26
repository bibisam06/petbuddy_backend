FROM node:23-alpine

# 앱 디렉토리 생성
WORKDIR /usr/src/app

# 패키지 파일 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

RUN npm run build

# 앱 소스 코드 복사
COPY . .


# 앱이 실행될 포트
EXPOSE 3000

# 앱 실행
CMD ["npm", "start"]
