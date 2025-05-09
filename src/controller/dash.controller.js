
export const getDashBoard = async(req, res) => {
    try{
        res.json(req.dog);
    }catch(error){
        console.error(error.message);
        const statusCode = error.status ?? 500;
        return sendError(res, { errorMessage: error.message }, { responseCode: statusCode });
    }
}