// logger.js -> winston + morgan
import { createLogger, format, transport } from "winston";
const { combine, timestamp, printf, colorize } = format


const logFormat = printf(({ level, message, timestamp }) => {
  return `[${timestamp}] ${level}: ${message}`;
});

const logger = createLogger({
    level: 'info',
    format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
    ),
    transports: [
    new transport.Console({ format: combine(colorize(), logFormat) }), // 콘솔
    new transport.File({ filename: 'logs/error.log', level: 'error' }), // 에러 전용
    new transport.File({ filename: 'logs/combined.log' }) // 전체 로그
    ],
});

module.exports = logger;

