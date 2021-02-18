const ApiError = require("./ApiError");

class FirstnameError extends ApiError{
    constructor() {
        super(100,'firstname required.')
    }
}

module.exports = new FirstnameError();