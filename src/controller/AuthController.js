import axios from 'axios';

class AuthController {
    async getKakaoToken(code) {
        const KAKAO_TOKEN_URL = 'https://kauth.kakao.com/oauth/token';
    
        const response = await axios.post(KAKAO_TOKEN_URL, null, {
            params: {
                grant_type: 'authorization_code',
                client_id: process.env.KAKAO_CLIENT_ID,
                client_secret: process.env.KAKAO_CLIENT_SECRET, // 선택 사항
                redirect_uri: process.env.KAKAO_REDIRECT_URI,
                code
            }
        });
    
        return response.data.access_token;
    }
}

// export default로 변경
export default AuthController;
