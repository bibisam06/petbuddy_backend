# Node 기반 이미지
FROM node:23

# 앱 워킹 디렉토리 설정
WORKDIR /usr/src/app

# package.json 및 package-lock.json 복사
COPY package*.json ./

# 프로덕션용 의존성 설치
RUN npm install

# 소스 전체 복사
COPY . .

# 🔧 빌드 추가
RUN npm run build

# 포트 오픈
EXPOSE 3000

# 앱 실행
CMD ["npm", "start"]
