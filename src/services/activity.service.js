/*
TODO : 활동량 조회 전 AUTH 를 수행하는 서비스 로직입니다.
*/

export const getDogSlug = async(req, res, next) => {
try{

    return true; 
}catch(error){
    console.error(error.message);
    next(error);
}
};