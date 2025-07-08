import axios from 'axios';

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;

export const notifyNewUser = async (user) => {
    try {
    await axios.post(SLACK_WEBHOOK_URL, {
        text: `📢 새로운 유저 가입!\n이름: ${user.user_name}\n이메일: ${user.email}`
    });
    } catch (err) {
    console.error('슬랙 알림 전송 실패:', err.message);
    }
};
