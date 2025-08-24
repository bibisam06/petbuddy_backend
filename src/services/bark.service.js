import axios from 'axios';

// FitBark에서 받은 authorization code로 토큰 발급
export const getUserCredentials = async (code) => {
const FITBARK_CREDENTIALS = "https://app.fitbark.com/oauth/token";

try {
    const response = await axios.post(
    FITBARK_CREDENTIALS,
    {
        grant_type: "authorization_code",
        code: code,
        redirect_uri: "https://backend.pawprint.ai.kr/bark/redirect",
        client_id: process.env.FITBARK_CLIENT_ID,
        client_secret: process.env.FITBARK_CLIENT_SECRET
    },
    {
        headers: {
        "Content-Type": "application/json",
        },
    }
    );

    console.log(response);
    return response.data; // { access_token, refresh_token, expires_in ... }
} catch (error) {
    console.error(
    "토큰 발급 실패:",
    error.response?.data || error.message
    );
    throw error;
}
};