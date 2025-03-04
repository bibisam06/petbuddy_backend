const app = express()
app.use(express.json())  // 미들웨어로 등록 - json으로 데이터를 받기 위해

//validationResult : request 객체를 파라미터로 받음, 이 함수를 사용하면 request 객체에서 검사할 데이터를 추출하고, 검사를 수행한 결과를 담은 객체를 반환
// 핸들러
const validate = (req, res, next) => {
    const errors = validationResult(req) 
    console.log(errors)
    if(errors.isEmpty()){  // errors가 비어있다면
        return next()
    }
    // error가 있다면
    return res.status(400).json({message: errors.array()})}


// static async function(_req){

// }