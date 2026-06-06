export default class ApiError extends Error {
    constructor(statusCode,message,IsOperational=true) {
        super(message);
        this.statusCode = statusCode;
        this.IsOperational = IsOperational;
    }
}
