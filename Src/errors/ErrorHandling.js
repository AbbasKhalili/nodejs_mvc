const ApiError = require("./ApiError");

function errorHandling(err,req,res,next){

    if(err instanceof ApiError)
    {
        res.json(err);
        return;
    }
    res.status(500).json('Ineternal server error.')
}

module.exports = errorHandling;