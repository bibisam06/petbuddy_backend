# Node 기반 이미지
FROM node:23

# 앱 워킹 디렉토리 설정
WORKDIR /usr/src/app

# package.json, package-lock.json 복사
COPY package*.json ./

# 프로덕션용 의존성 설치
RUN npm install --production

# 빌드된 dist 폴더 복사
COPY dist/ ./dist

# 앱이 사용하는 포트 오픈
EXPOSE 3000

# 앱 실행
CMD ["node", "dist/index.js"]
