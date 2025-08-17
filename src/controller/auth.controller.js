import axios from 'axios';
import jwt from 'jsonwebtoken';
import redisClient from '../config/redis-local.js';
// const redisCli = redisClient.v4 ; //TODO : Defualt REdis Client -> Callback 기반,v4는 Promise기반..

// TODO : 죄다 리팩토링 예정입니다. 
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
        return response.data.access_token;
    }


    static async getKakaoUserInfo(accessToken) {
        const KAKA0_USERINFO_URL = 'https://kapi.kakao.com/v2/user/me';
        const response = await axios.get(KAKA0_USERINFO_URL, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
    
        return response.data;
    } //->bis앱전환후사용할

    static async getNaverUserInfo(accessToken) {
        const response = await axios.get('https://openapi.naver.com/v1/nid/me', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
    
        return response.data.response; 
    }    


    static async getNaverToken(code){
        const NAVER_TOKEN_URL = 'https://nid.naver.com/oauth2.0/token';

        const response = await axios.get(NAVER_TOKEN_URL, {
            params: {
                grant_type: 'authorization_code',
                client_id: process.env.NAVER_CLIENT_ID,
                client_secret: process.env.NAVER_CLIENT_SECRET,
                code
                //state
            }
        });
        return response.data.access_token;
    }

    static async signWithNaver(accessToken){
        const userInfo = await this.getNaverUserInfo(accessToken);

        const name = userInfo.name;
        const email = userInfo.email;
        const phoneNumber = userInfo.phoneNumber;

        
        let newuser = await user.findOne({
            where: { name }
        });

        if(!newuser){
            newuser = await user.create({
                name,
                email,
                phoneNumber
            })

            const accessToken = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET, {
                expiresIn: '1d'
            });
            const refreshToken = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET, {
                expiresIn: '10d'
            });
            
            await this.saveRefreshToken(refreshToken, userId);
            return { accessToken, refreshToken };
        }

    }
    static async signWithKakao(accessToken){
        const userInfo = await this.getKakaoUserInfo(accessToken); 

    
        const kakaoId = userInfo.id; 
        const email = userInfo.kakao_account?.email;
        const nickname = userInfo.kakao_account?.profile?.nickname;

        let newuser = await user.findOne({
            where : {kakaoId}    
        });
        if (!newuser){
        newuser = await user.create({
        kakaoId,
        email,
        name: nickname
        });

        const accessToken = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET, {
            expiresIn: '1d'
        });
        const refreshToken = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET, {
            expiresIn: '10d'
        });

        await this.saveRefreshToken(refreshToken, userId);
        return { accessToken, refreshToken };
        }
    } 



    // Redis Token Logics 

    static async createTokens(newuser){
        const accessToken = jwt.sign({ userId: newuser.user_id }, process.env.JWT_SECRET, {
            expiresIn: '1d'
        });
        const refreshToken = jwt.sign({ userId: newuser.user_id }, process.env.JWT_SECRET, {
            expiresIn: '10d'
        });
        return {accessToken, refreshToken};
    }

    static async saveRefreshToken(refreshToken, userId){
        const key = `refresh:${userId}`;
        try{
            console.log('[Redis] 시도 시작 ');
            const result = await redisClient.set(key, refreshToken, 'EX', 60 * 60 * 24 * 10); //만료일은 10일로설정..
            console.log(`[Redis:Save] 성공 - key: ${key}`);

            return result;
        }catch(error){
            console.error(`[Redis:Save] 실패 - key: ${key}, error:`, error);
        }
    }

    // 핏 - 바크 

    // 레디스에 액세스토큰 10분짜리 저장해두는 로직입니다.. 세터
    static async saveFitBarkToken(accessToken, userId){
        try{
            const key = `fitbark:${userId}`
            console.log('[Redis-FitBark] trying... ');
            const result = await redisClient.set(key, accessToken, 'EX', 60 * 10 ); // 만료 시간은 10분입니당...
            const response = this.getUserCredentials(accessToken, userId);
            return response;
        }catch(error){
            console.error(`[Redis:Save] 실패 - key: ${key}, error:`, error);
        }

    }
    


    //TODO : 이거 에러 처리 리팩토링 필요함 

    // Delete
    static async deleteRefreshToken(userId){
        await redisClient.del(`refresh:${userId}`);
    }

    // Blacklist 
    static async addToBlackList(refreshToken){
        console.log("added to blacklist");
        await redisClient.set(refreshToken, 'blacklisted', 'EX', 60 * 60 * 24); // 1일 동안 유효
    }
    
    static async isBlacklisted(token) {
        const result = await redisClient.get(token);
        console.log(result);
        return result !== null; 
    }

    static async isRedisSaved(userId) {
        return await redisClient.exists(`refresh:${userId}`);
        //'' 은 문자열 , ` 이게 템플릿리터럴 
        
    }

    
}

export default AuthController;
