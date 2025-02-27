import axios from 'axios';
import redisClient from '../config/redis.js';
class AuthController {
    static async getKakaoToken(code) { 
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
        console.log(response.data.access_token);
        return response.data.access_token;
    }

    static async signWithKakao(accessToken){
        const userInfo = await this.getKakaoUserInfo(accessToken); //userInfo가져와서

        //TODO : 사용자정보 db에저장 + 다른정보추가필요
        const kakaoId = userInfo.id; 
        const email = userInfo.kakao_account?.email;
        const nickname = userInfo.kakao_account?.profile?.nickname;
       // const male = userInfo.kakao_account?.

        let user = await User.findOne({ kakaoId });
        if (!user) {
        user = await User.create({
        kakaoId,
        email,
        name: nickname
        });

        const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE
        });
        const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '10d'
        });

        await this.saveRefreshToken(refreshToken, userId);
        return jwtToken; 
}
    }

    static async saveRefreshToken(refreshToken, userId){
        await redisClient.set(`refresh:${userId}`, refreshToken, 'EX', 60 * 60 * 24 * 10); //만료일은 10일로설정..
    }


    static async getKakaoUserInfo(accessToken) {
        const response = await axios.get('https://kapi.kakao.com/v2/user/me', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
    
        return response.data;
    } //->bis앱전환후사용할
    
    
}

// export default로 변경
export default AuthController;
