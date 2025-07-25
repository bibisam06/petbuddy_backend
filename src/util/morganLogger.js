// morganLogger.js
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirname 대체용
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 📄 logs 디렉토리 없으면 생성
const logDirectory = path.join(__dirname, 'logs');
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

// 📄 access.log 스트림 생성
const accessLogStream = fs.createWriteStream(path.join(logDirectory, 'access.log'), { flags: 'a' });

// 📌 morgan 미들웨어 2개 export
export const fileLogger = morgan('combined', { stream: accessLogStream });
export const devLogger = morgan('dev');
