/*
FitBark 서비스 로직을 작성하는 파일입니당... 
*/
// import
import axios from 'axios';

// 진짜 토큰 발급 
export const getUserCredentials = async (token) => {
const FITBARK_CREDENTIALS = "https://app.fitbark.com/oauth/token";

try {
    const response = await axios.post(
    FITBARK_CREDENTIALS,
    {
        grant_type: "client_credentials",
        client_id: process.env.FITBARK_CLIENT_ID,
        client_secret: process.env.FITBARK_CLIENT_SECRET,
        scope: process.env.FITBARK_SCOPE,
    },
    {
        headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
        },
    }
    );

    return response.data;
} catch (error) {
    console.error(
    "토큰 발급 실패:",
    error.response?.data || error.message
    );
    throw error;
}
};