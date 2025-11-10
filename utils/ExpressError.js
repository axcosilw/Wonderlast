class ExpressError extends Error {
    constructor(statusCode, message) {
        super(); // ✅ pass message to the parent Error class
        this.statusCode = statusCode;
        this.message=message;
    }
}

module.exports = ExpressError; // ✅ CommonJS export
