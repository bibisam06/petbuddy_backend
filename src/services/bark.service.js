import axios from 'axios';

// FitBark에서 받은 authorization code로 토큰 발급
export const getUserCredentials = async (code) => {
const FITBARK_CREDENTIALS = "https://app.fitbark.com/oauth/token";

try {
    const response = await axios.post(
    FITBARK_CREDENTIALS,
    new URLSearchParams({
        grant_type: "authorization_code",
        code, // 리다이렉션에서 받은 코드
        redirect_uri: process.env.FITBARK_REDIRECT_URI, // 반드시 개발자 콘솔 등록 값과 일치
        client_id: process.env.FITBARK_CLIENT_ID,
        client_secret: process.env.FITBARK_CLIENT_SECRET,
    }),
    {
        headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        },
    }
    );

    return response.data; // { access_token, refresh_token, expires_in ... }
} catch (error) {
    console.error(
    "토큰 발급 실패:",
    error.response?.data || error.message
    );
    throw error;
}
};